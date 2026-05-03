import React from 'react';
import { Trophy } from 'lucide-react';

const AIRecommendation = ({ result }) => {
  const winner = result.recommended === 'a' ? result.scenario_a : result.scenario_b;

  return (
    <div style={{
      padding: '20px 24px',
      background: 'linear-gradient(135deg, var(--cyan-glow), var(--violet-glow))',
      border: '1px solid var(--cyan-dim)',
      borderRadius: 10, marginBottom: 24,
      display: 'flex', alignItems: 'center', gap: 16,
      animation: 'fadeUp 0.5s ease both',
    }}>
      <Trophy size={32} color="var(--cyan)" />
      <div>
        <div style={{ fontSize: 10, color: 'var(--cyan)', letterSpacing: 2, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
          SYNAPSE RECOMMENDATION
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          Optimal Decision: {winner.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {result.recommendation_reason}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
