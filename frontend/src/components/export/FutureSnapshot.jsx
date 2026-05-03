import React, { useRef } from 'react';
import { X, Share2 } from 'lucide-react';

const FutureSnapshot = ({ result, onClose }) => {
  const cardRef = useRef();

  const handleExport = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: '#050508' });
    const link = document.createElement('a');
    link.download = `synapse-${result.scenario_id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const snapshotMetrics = [
    ...result.metrics.slice(0, 3).map((m, i) => ({
      label: m.label,
      value: `${m.value} ${m.unit.trim().replace('/', '')}`,
      color: ['var(--emerald)', 'var(--cyan)', 'var(--violet)'][i]
    })),
    { label: 'System Confidence', value: `${result.confidence_pct.toFixed(0)}%`, color: 'var(--text-primary)' }
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }}>
      <div style={{ maxWidth: 480, width: '90%' }}>
        {/* Snapshot Card */}
        <div ref={cardRef} style={{
          padding: 32, borderRadius: 16,
          background: 'linear-gradient(135deg, #0D0F1A 0%, #131629 100%)',
          border: '1px solid var(--cyan-dim)',
          boxShadow: '0 0 60px var(--cyan-glow)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 3, color: 'var(--cyan)', marginBottom: 4 }}>
                SYNAPSE GRID — FUTURE SNAPSHOT
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>
                {result.title}
              </div>
            </div>
            <div style={{
              padding: '4px 12px', borderRadius: 20,
              background: result.risk_level === 'low' ? 'var(--emerald-glow)' : 'var(--orange-glow)',
              border: `1px solid ${result.risk_level === 'low' ? 'var(--emerald)' : 'var(--orange)'}60`,
              color: result.risk_level === 'low' ? 'var(--emerald)' : 'var(--orange)',
              fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: 2,
            }}>
              {result.risk_level.toUpperCase()} RISK
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {snapshotMetrics.map(m => (
              <div key={m.label} style={{
                padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                borderRadius: 8, border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 20, color: m.color, fontWeight: 700 }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
            "{result.ai_recommendation}"
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
              synapse-grid.io
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Scenario #{result.scenario_id} · {result.domain}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
          <button
            onClick={handleExport}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', background: 'var(--cyan)',
              border: 'none', borderRadius: 8, color: '#000',
              fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 2, cursor: 'pointer',
            }}
          >
            <Share2 size={14} /> EXPORT SNAPSHOT
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px', background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)', borderRadius: 8,
              color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FutureSnapshot;
