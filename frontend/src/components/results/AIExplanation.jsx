import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle } from 'lucide-react';

const AIExplanation = ({ text, recommendation, risks, benefits }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i += 3;
      if (i > text.length) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <div style={{
      padding: 24, background: 'var(--bg-card)',
      border: '1px solid var(--border-active)', borderRadius: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Brain size={16} color="var(--violet)" />
        <span style={{ fontSize: 10, color: 'var(--violet)', letterSpacing: 2, fontFamily: 'var(--font-display)' }}>
          SYNAPSE AI — ANALYSIS
        </span>
      </div>

      <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20, minHeight: 80 }}>
        {displayed}
        <span style={{ animation: 'pulse-glow 1s ease infinite', color: 'var(--cyan)' }}>█</span>
      </p>

      {recommendation && (
        <div style={{
          padding: '12px 16px', marginBottom: 20,
          background: 'var(--cyan-glow)', border: '1px solid var(--cyan-dim)',
          borderRadius: 8, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6,
        }}>
          {recommendation}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--emerald)', letterSpacing: 1, marginBottom: 10, fontFamily: 'var(--font-display)' }}>
            KEY BENEFITS
          </div>
          {benefits?.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <CheckCircle size={12} color="var(--emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--orange)', letterSpacing: 1, marginBottom: 10, fontFamily: 'var(--font-display)' }}>
            KEY RISKS
          </div>
          {risks?.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <AlertTriangle size={12} color="var(--orange)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIExplanation;
