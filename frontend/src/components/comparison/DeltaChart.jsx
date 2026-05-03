import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DeltaChart = ({ result }) => {
  const data = result.scenario_a.metrics.slice(0, 3).map((m, i) => {
    const mb = result.scenario_b.metrics[i];
    return {
      metric: m.label.split(' ')[0],
      'Scenario A': m.value,
      'Scenario B': mb.value,
    };
  });

  // Add risk to the comparison chart dynamically
  data.push({
    metric: 'Risk Score',
    'Scenario A': result.scenario_a.risk_score,
    'Scenario B': result.scenario_b.risk_score,
  });

  return (
    <div style={{
      padding: 24, background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)', borderRadius: 10, marginBottom: 24,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, fontFamily: 'var(--font-display)', marginBottom: 16 }}>
        HEAD-TO-HEAD COMPARISON
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <XAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-active)', borderRadius: 6 }}
            labelStyle={{ color: 'var(--text-secondary)', fontSize: 11 }}
            itemStyle={{ color: 'var(--text-primary)', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
          <Bar dataKey="Scenario A" fill="var(--cyan)" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
          <Bar dataKey="Scenario B" fill="var(--violet)" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeltaChart;
