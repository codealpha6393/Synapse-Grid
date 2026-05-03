import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({ baseURL: BASE, timeout: 15000 });

export const runSimulation = async (scenario) => {
  const { data } = await api.post('/simulate', scenario);
  return data;
};

export const runComparison = async (scenarioA, scenarioB) => {
  const { data } = await api.post('/compare', {
    scenario_a: scenarioA,
    scenario_b: scenarioB,
  });
  return data;
};

export const getSuggestions = async () => {
  const { data } = await api.get('/scenarios/suggestions');
  return data;
};

// Backward compat alias
export const fetchScenarioSuggestions = async () => {
  const data = await getSuggestions();
  return { scenarios: data };
};

export const saveScenario = async (scenario) => {
  const { data } = await api.post('/scenarios/save', scenario);
  return data;
};
