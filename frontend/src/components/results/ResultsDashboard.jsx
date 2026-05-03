import React from 'react';
import useStore from '../../store/useStore';
import LoadingOrb from '../simulation/LoadingOrb';
import KPICard from './KPICard';
import RiskGauge from './RiskGauge';
import ConfidenceMeter from './ConfidenceMeter';
import ImpactChart from './ImpactChart';
import AIExplanation from './AIExplanation';
import { Camera, SplitSquareHorizontal } from 'lucide-react';

const ResultsDashboard = () => {
  const { result, isSimulating, setActiveView, openSnapshot } = useStore();

  if (isSimulating) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingOrb />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div style={{ padding: 32, paddingBottom: 64, animation: 'fadeUp 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--cyan)', letterSpacing: 3, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            SIMULATION OUTCOMES // {result.scenario_id.toUpperCase()}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-primary)' }}>
            {result.title}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setActiveView('compare')}
            style={{
              padding: '10px 20px', background: 'var(--bg-elevated)',
              border: '1px solid var(--border-active)', borderRadius: 8,
              color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            }}
          >
            <SplitSquareHorizontal size={14} /> COMPARE SCENARIOS
          </button>
          <button
            onClick={openSnapshot}
            style={{
              padding: '10px 20px', background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
              border: 'none', borderRadius: 8, color: '#000',
              fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1,
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            }}
          >
            <Camera size={14} /> FUTURE SNAPSHOT
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {result.metrics.map((m, i) => (
          <KPICard key={m.key} metric={m} index={i} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>
        <ImpactChart result={result} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <RiskGauge score={result.risk_score} level={result.risk_level} />
          <ConfidenceMeter value={result.confidence_pct} />
        </div>
      </div>

      <AIExplanation
        text={result.ai_explanation}
        recommendation={result.ai_recommendation}
        risks={result.key_risks}
        benefits={result.key_benefits}
      />
    </div>
  );
};

export default ResultsDashboard;
