import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-active)',
      borderRadius: 6, padding: '8px 12px',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontSize: 14, color: 'var(--cyan)', fontFamily: 'var(--font-data)' }}>
        {payload[0].value.toFixed(2)}{unit}
      </div>
    </div>
  );
};

const ImpactChart = ({ result }) => {
  const data = result.primary_timeseries;
  const primaryMetric = result.metrics[0];
  const title = `${primaryMetric.label} Projection`;
  const unit = primaryMetric.unit.replace('/', '').trim();
  const color = 'var(--cyan)';

  return (
    <div style={{
      padding: 20, background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)', borderRadius: 10,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
        {title.toUpperCase()}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Line
            type="monotone" dataKey="value" stroke={color}
            strokeWidth={2} dot={{ fill: color, r: 3 }} activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactChart;
