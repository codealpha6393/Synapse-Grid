import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { runComparison } from '../../utils/api';
import KPICard from '../results/KPICard';
import DeltaChart from './DeltaChart';
import AIRecommendation from './AIRecommendation';

const ComparisonMode = () => {
  const { result, scenario, comparisonResult, setComparisonResult } = useStore();
  const [scenarioBParams, setScenarioBParams] = useState({ ...scenario, title: 'Scenario B — Aggressive Push' });
  const [loading, setLoading] = useState(false);

  const runCompare = async () => {
    setLoading(true);
    try {
      const cr = await runComparison(scenario, { ...scenarioBParams, description: scenarioBParams.title });
      setComparisonResult(cr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!result) return (
    <div style={{ padding: 32, color: 'var(--text-muted)', textAlign: 'center' }}>
      Run a simulation first before comparing scenarios.
    </div>
  );

  return (
    <div style={{ padding: 32 }}>
      <div style={{ fontSize: 10, color: 'var(--cyan)', letterSpacing: 3, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
        COMPARISON MODE
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 32 }}>
        Side-by-Side Scenario Analysis
      </h2>

      {comparisonResult ? (
        <>
          <AIRecommendation result={comparisonResult} />
          <DeltaChart result={comparisonResult} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--cyan)', marginBottom: 12, fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
                SCENARIO A — {comparisonResult.scenario_a.title}
              </div>
              {comparisonResult.scenario_a.metrics.slice(0, 3).map((m, i) => (
                <KPICard key={m.label} metric={m} index={i} />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--violet)', marginBottom: 12, fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
                SCENARIO B — {comparisonResult.scenario_b.title}
              </div>
              {comparisonResult.scenario_b.metrics.slice(0, 3).map((m, i) => (
                <KPICard key={m.label} metric={m} index={i} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Adjust parameters for Scenario B, then run comparison.
          </p>
          <div style={{ marginBottom: 24, padding: 20, background: 'var(--bg-card)', border: '1px solid var(--violet-dim)', borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--violet)', letterSpacing: 2, fontFamily: 'var(--font-display)', marginBottom: 12 }}>
              SCENARIO B SETUP
            </div>
            <input
              value={scenarioBParams.title}
              onChange={e => setScenarioBParams(p => ({ ...p, title: e.target.value }))}
              placeholder="Scenario B title"
              style={{
                width: '100%', padding: '10px 14px', marginBottom: 16,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                borderRadius: 6, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', outline: 'none',
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Change the primary tracking timeframe for comparison:
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="number" value={scenarioBParams.timeframe_years}
                onChange={e => setScenarioBParams(p => ({ ...p, timeframe_years: parseFloat(e.target.value) }))}
                style={{
                  width: 80, padding: '6px 10px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderRadius: 4, color: 'var(--violet)', fontFamily: 'var(--font-data)', outline: 'none',
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>years</span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 12 }}>
              (Other parameters inherit from scenario A directly)
            </div>
          </div>
          <button
            onClick={runCompare}
            disabled={loading}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
              border: 'none', borderRadius: 8,
              color: '#000', fontFamily: 'var(--font-display)', fontSize: 12,
              letterSpacing: 2, cursor: 'pointer',
            }}
          >
            {loading ? 'COMPARING...' : 'RUN COMPARISON'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ComparisonMode;
