from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def sample_scenario(**overrides):
    scenario = {
        "domain": "climate",
        "title": "National EV subsidy increase",
        "description": "Increase EV subsidies by twenty percent over three years.",
        "timeframe_years": 3,
        "scale": "national",
        "budget_billion_usd": 7.5,
        "domain_params": {
            "subsidy_change_pct": 20.0,
            "initial_ev_adoption_pct": 8.0,
            "renewable_investment_pct": 12.0
        }
    }
    
    dp_overrides = overrides.pop("domain_params", {})
    scenario["domain_params"].update(dp_overrides)
    scenario.update(overrides)
    return scenario

def test_health_returns_operational_status():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "operational",
        "engine": "SYNAPSE GRID v1.0",
    }

def test_scenario_suggestions_returns_seeded_climate_entries():
    response = client.get("/api/v1/scenarios/suggestions")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload["scenarios"]) >= 4

def test_simulate_returns_structured_result():
    response = client.post("/api/v1/simulate", json=sample_scenario())
    assert response.status_code == 200
    payload = response.json()
    
    assert payload["domain"] == "climate"
    assert payload["title"] == "National EV subsidy increase"
    
    metrics = payload["metrics"]
    assert len(metrics) > 0
    assert metrics[0]["label"] == "CO2 Reduction"
    
    pt = payload["primary_timeseries"]
    assert len(pt) == 4
    assert pt[0]["year"] == 2024
    
    assert payload["ai_recommendation"]

def test_compare_returns_both_results_and_recommendation():
    scenario_b = sample_scenario(
        title="Scenario B",
        description="Aggressive push.",
        domain_params={"subsidy_change_pct": 50.0}
    )
    
    response = client.post(
        "/api/v1/compare",
        json={
            "scenario_a": sample_scenario(title="Scenario A"),
            "scenario_b": scenario_b,
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["recommended"] in {"a", "b"}
    assert payload["scenario_a"]["title"] == "Scenario A"
    assert payload["scenario_b"]["title"] == "Scenario B"
    assert "risk_delta" in payload["delta_metrics"]

def test_simulate_rejects_unsupported_domain():
    response = client.post(
        "/api/v1/simulate",
        json=sample_scenario(domain="unknown_domain"),
    )
    assert response.status_code == 422
    assert "not implemented" in response.json()["detail"]

def test_simulate_rejects_invalid_payload():
    response = client.post(
        "/api/v1/simulate",
        json=sample_scenario(title="Bad", timeframe_years=0),
    )
    assert response.status_code == 422

def test_save_scenario_persists_payload():
    response = client.post(
        "/api/v1/scenarios/save",
        json=sample_scenario(title="Saved scenario"),
    )
    assert response.status_code == 201
    payload = response.json()
    assert payload["status"] == "saved"
    assert payload["scenario"]["title"] == "Saved scenario"
