import { create } from 'zustand';

const defaultParams = {
  // Base params
  title: '',
  description: '',
  domain: 'climate',
  timeframe_years: 3,
  scale: 'national',
  budget_billion_usd: 7.5,
  // Domain params block
  domain_params: {
    // Climate
    subsidy_change_pct: 20,
    initial_ev_adoption_pct: 8.0,
    renewable_investment_pct: 0,
    // Finance
    interest_rate_pct: 5.0,
    corporate_tax_pct: 0.0,
    stimulus_billion: 0.0,
    // Healthcare
    hospital_budget_bn: 5.0,
    telehealth_mandate_pct: 10.0,
    preventative_care_pct: 5.0,
    // Urban
    housing_zoning_reform_pct: 10.0,
    transit_budget_bn: 2.0,
    density_limit_increase_pct: 15.0,
  }
};

const useStore = create((set, get) => ({
  activeDomain: 'climate',
  setActiveDomain: (domain) => set(state => ({
    activeDomain: domain,
    scenario: { ...state.scenario, domain, title: '', description: '' }
  })),

  scenario: { ...defaultParams },
  updateScenario: (updates) => set(state => ({
    scenario: { ...state.scenario, ...updates }
  })),
  updateDomainParam: (key, value) => set(state => ({
    scenario: {
      ...state.scenario,
      domain_params: { ...state.scenario.domain_params, [key]: value }
    }
  })),

  // Backward compat
  setScenarioField: (field, value) => set(state => ({
    scenario: { ...state.scenario, [field]: value }
  })),
  setScenario: (s) => set(state => ({
    scenario: {
      ...state.scenario,
      title: s.title || '',
      description: s.description || '',
      domain: s.domain || 'climate',
      scale: s.scale || state.scenario.scale,
      timeframe_years: s.timeframe_years || state.scenario.timeframe_years,
      budget_billion_usd: s.budget_billion_usd || state.scenario.budget_billion_usd,
      domain_params: { ...state.scenario.domain_params, ...s.domain_params }
    }
  })),

  isSimulating: false,
  result: null,
  error: null,
  setSimulating: (v) => set({ isSimulating: v }),
  setResult: (r) => set({ result: r, error: null, activeView: 'results' }),
  setError: (e) => set({ error: e, isSimulating: false }),

  comparisonMode: false,
  scenarioB: null,
  comparisonResult: null,
  setComparisonMode: (v) => set({ comparisonMode: v }),
  setScenarioB: (s) => set({ scenarioB: s }),
  setComparisonResult: (r) => set({ comparisonResult: r }),
  resetComparison: () => set({ comparisonResult: null }),

  activeView: 'landing',
  setActiveView: (v) => set({ activeView: v }),

  theme: 'dark',
  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  snapshotMode: false,
  snapshotOpen: false,
  setSnapshotMode: (v) => set({ snapshotMode: v, snapshotOpen: v }),
  openSnapshot: () => set({ snapshotMode: true, snapshotOpen: true }),
  closeSnapshot: () => set({ snapshotMode: false, snapshotOpen: false }),

  resetAll: () => set({
    scenario: { ...defaultParams },
    result: null, error: null, isSimulating: false, comparisonResult: null, activeView: 'landing', snapshotMode: false, snapshotOpen: false,
  }),
}));

export default useStore;
