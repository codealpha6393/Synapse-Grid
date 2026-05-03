import React from 'react';
import { riskColor } from '../../utils/formatters';

const RiskGauge = ({ score, level }) => {
  const color = riskColor(level);
  const dashArray = 2 * Math.PI * 45;
  const dashOffset = dashArray * (1 - score / 100);

  return (
    <div style={{
      padding: 24, background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)', borderRadius: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, fontFamily: 'var(--font-display)' }}>
        RISK ASSESSMENT
      </div>
      <svg width={120} height={120} viewBox="0 0 120 120">
        <circle cx={60} cy={60} r={45} fill="none" stroke="var(--border-subtle)" strokeWidth={8} />
        <circle
          cx={60} cy={60} r={45} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={dashArray} strokeDashoffset={dashOffset}
          strokeLinecap="round" transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1.5s ease' }}
        />
        <text x={60} y={55} textAnchor="middle" fill={color} fontSize={22} fontFamily="Space Mono" fontWeight={700}>
          {score.toFixed(0)}
        </text>
        <text x={60} y={72} textAnchor="middle" fill="var(--text-muted)" fontSize={9} fontFamily="DM Mono">
          /100
        </text>
      </svg>
      <div style={{
        padding: '4px 16px', borderRadius: 20,
        background: color + '20', border: `1px solid ${color}60`,
        color, fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: 2,
      }}>
        {level.toUpperCase()} RISK
      </div>
    </div>
  );
};

export default RiskGauge;
