import React from 'react';
import useCounter from '../../hooks/useCounter';
import { trendIcon } from '../../utils/formatters';

const KPICard = ({ metric, index }) => {
  const isDecimal = metric.value % 1 !== 0;
  const count = useCounter(metric.value, 1500 + index * 200, isDecimal ? 1 : 0);

  const TIcon = trendIcon(metric.trend);

  let glowColor = 'transparent';
  if (metric.trend === 'positive') glowColor = 'var(--emerald-glow)';
  if (metric.trend === 'warning') glowColor = 'var(--orange-glow)';
  if (metric.trend === 'negative') glowColor = 'var(--red-glow)';

  return (
    <div style={{
      padding: 20, background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 10, position: 'relative',
      overflow: 'hidden',
      animation: `fadeUp 0.6s ease ${index * 0.1}s both`,
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100, background: glowColor,
        filter: 'blur(40px)', opacity: 0.5, borderRadius: '50%',
      }} />
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
        {metric.label}
      </div>
      <div style={{ fontFamily: 'var(--font-data)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
        {count}
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 4 }}>{metric.unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <TIcon size={14} color={
          metric.trend === 'positive' ? 'var(--emerald)' :
            metric.trend === 'negative' ? 'var(--red)' :
              metric.trend === 'warning' ? 'var(--orange)' : 'var(--text-muted)'
        } />
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {metric.trend} TREND
        </span>
      </div>
    </div>
  );
};

export default KPICard;
