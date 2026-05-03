import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import App from "./App";


vi.mock("./utils/api", () => ({
  fetchScenarioSuggestions: vi.fn(),
  runComparison: vi.fn(),
  runSimulation: vi.fn(),
  saveScenario: vi.fn(),
}));

vi.mock("html2canvas", () => ({
  default: vi.fn(async () => ({
    toDataURL: () => "data:image/png;base64,abc",
  })),
}));


import {
  fetchScenarioSuggestions,
  runComparison,
  runSimulation,
} from "./utils/api";


const sampleScenario = {
  domain: "climate",
  title: "National EV subsidy increase",
  description: "Increase EV subsidies nationally over three years.",
  subsidy_change_pct: 20,
  timeframe_years: 3,
  scale: "national",
  budget_billion_usd: 7.5,
  initial_ev_adoption_pct: 8,
  carbon_tax_usd_per_ton: 35,
  renewable_investment_pct: 12,
};

const simulationResult = {
  scenario_id: "abc12345",
  domain: "climate",
  title: "National EV subsidy increase",
  metrics: [
    { key: "co2", value: 2.4, unit: "MT/yr", label: "CO2 Reduction", trend: "positive" },
    { key: "ev", value: 18.5, unit: "%", label: "EV Fleet Adoption", trend: "positive" },
    { key: "jobs", value: 47.3, unit: "K jobs", label: "Jobs Created", trend: "positive" },
    { key: "spend", value: 9.0, unit: "$B", label: "Govt. Spending", trend: "neutral" },
    { key: "price", value: -2.2, unit: "%", label: "Consumer Price Delta", trend: "positive" },
    { key: "grid", value: 42.1, unit: "/100", label: "Grid Stress Index", trend: "neutral" }
  ],
  risk_level: "medium",
  risk_score: 44.5,
  confidence_pct: 76.2,
  primary_timeseries: [
    { year: 2024, value: 8.0 },
    { year: 2025, value: 12.3 },
    { year: 2026, value: 16.1 },
    { year: 2027, value: 18.5 }
  ],
  secondary_timeseries: [
    { year: 2025, value: 0.8 },
    { year: 2026, value: 1.6 },
    { year: 2027, value: 2.4 }
  ],
  spending_over_time: [
    { year: 2024, value: 0.0 },
    { year: 2025, value: 3.0 },
    { year: 2026, value: 6.0 },
    { year: 2027, value: 9.0 }
  ],
  ai_explanation: "Simulation summary",
  ai_recommendation: "Proceed with caution.",
  key_risks: ["Grid infrastructure stress could increase."],
  key_benefits: ["Annual emissions drop by about 2.4 MT."]
};

const comparisonResult = {
  scenario_a: simulationResult,
  scenario_b: {
    ...simulationResult,
    title: "Aggressive push",
    risk_score: 55.1,
    metrics: [
      { ...simulationResult.metrics[0], value: 3.1 },
      simulationResult.metrics[1],
      { ...simulationResult.metrics[2], value: 58.2 },
      simulationResult.metrics[3],
      simulationResult.metrics[4],
      { ...simulationResult.metrics[5], value: 61.0 }
    ]
  },
  recommended: "a",
  recommendation_reason: "Scenario A offers the better balance.",
  delta_metrics: {
    co2_reduction_mt_delta: 0.7,
    jobs_created_k_delta: 10.9,
    risk_delta: 10.6,
    grid_stress_index_delta: 18.9
  }
};


beforeEach(() => {
  fetchScenarioSuggestions.mockResolvedValue({
    scenarios: [sampleScenario, { ...sampleScenario, title: "Regional charging corridor push" }],
  });
  runSimulation.mockResolvedValue(simulationResult);
  runComparison.mockResolvedValue(comparisonResult);
});


describe("App", () => {
  test("renders builder by default", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: /simulate the future/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /climate/i })).toHaveAttribute("aria-pressed", "true");
  });

  test("updates scenario fields and enables simulation when required fields are present", async () => {
    const user = userEvent.setup();
    render(<App />);

    const titleInput = await screen.findByLabelText(/scenario title/i);
    const descriptionInput = screen.getByLabelText(/scenario description/i);
    const simulateButton = screen.getByRole("button", { name: /run simulation/i });

    expect(simulateButton).toBeDisabled();

    await user.type(titleInput, "National EV subsidy increase");
    await user.type(descriptionInput, "Increase EV subsidies nationally over three years.");

    expect(simulateButton).toBeEnabled();
  });

  test("runs a simulation and renders the results dashboard", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: /load suggestion/i }));
    await user.click(screen.getByRole("button", { name: /run simulation/i }));

    await waitFor(() => expect(runSimulation).toHaveBeenCalled());
    expect(
      await screen.findByRole("heading", { name: /simulation outcomes/i }, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByText(/co2 reduction/i)).toBeInTheDocument();
    expect(screen.getByText(/simulation summary/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /compare scenarios/i })).toBeEnabled();
  });

  test("shows comparison mode after a first simulation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: /load suggestion/i }));
    await user.click(screen.getByRole("button", { name: /run simulation/i }));
    await screen.findByRole("heading", { name: /simulation outcomes/i }, { timeout: 5000 });

    await user.click(screen.getByRole("button", { name: /compare scenarios/i }));
    await user.click(await screen.findByRole("button", { name: /run comparison/i }, { timeout: 5000 }));

    await waitFor(() => expect(runComparison).toHaveBeenCalled());
    expect(
      await screen.findByRole("heading", { name: /side-by-side scenario analysis/i }, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByText(/scenario a offers the better balance/i)).toBeInTheDocument();
  });

  test("opens the export snapshot modal from the results view", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: /load suggestion/i }));
    await user.click(screen.getByRole("button", { name: /run simulation/i }));
    await screen.findByRole("heading", { name: /simulation outcomes/i }, { timeout: 5000 });

    await user.click(screen.getByRole("button", { name: /future snapshot/i }));

    expect(
      await screen.findByRole("heading", { name: /future snapshot/i }, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /export snapshot/i }, { timeout: 5000 })
    ).toBeInTheDocument();
  });
});
