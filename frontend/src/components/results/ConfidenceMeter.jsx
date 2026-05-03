import React from 'react';

const ConfidenceMeter = ({ value }) => {
  const bars = 20;
  const filled = Math.round((value / 100) * bars);

  return (
    <div style={{
      padding: 24, background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)', borderRadius: 10,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, fontFamily: 'var(--font-display)', marginBottom: 16 }}>
        MODEL CONFIDENCE
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 40,
              background: i < filled ? 'var(--violet)' : 'var(--border-subtle)',
              borderRadius: 3,
              opacity: i < filled ? 1 - (i / bars) * 0.3 : 0.3,
              transition: `background 0.05s ${i * 0.03}s`,
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 28, color: 'var(--violet)', fontWeight: 700 }}>
          {value.toFixed(0)}%
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 140, textAlign: 'right', lineHeight: 1.5 }}>
          Based on IEA elasticity models & NREL adoption curves
        </span>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
