import { useCallback } from 'react';
import useStore from '../store/useStore';
import { runSimulation } from '../utils/api';

export const useSimulation = () => {
  const { scenario, setSimulating, setResult, setError, setActiveView } = useStore();

  const simulate = useCallback(async () => {
    if (!scenario.title || !scenario.description) return;

    setSimulating(true);
    setActiveView('results');

    // Simulate loading delay for UX drama
    await new Promise(r => setTimeout(r, 2200));

    try {
      const result = await runSimulation(scenario);
      setResult(result);
    } catch (e) {
      setError(e.response?.data?.detail || 'Simulation failed. Check backend connection.');
    } finally {
      setSimulating(false);
    }
  }, [scenario]);

  return { simulate };
};

export default useSimulation;
