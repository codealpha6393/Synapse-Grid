import { useState } from 'react';
import useStore from '../store/useStore';
import { runComparison } from '../utils/api';

export default function useComparison() {
  const scenario = useStore((state) => state.scenario);
  const setComparisonResult = useStore((state) => state.setComparisonResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const compare = async (scenarioB) => {
    setLoading(true);
    setError('');
    try {
      const comparison = await runComparison(scenario, scenarioB);
      setComparisonResult(comparison);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { compare, loading, error };
}
