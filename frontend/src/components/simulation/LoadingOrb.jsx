import React from 'react';

const LoadingOrb = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '70vh', gap: 32,
  }}>
    {/* Orbital rings */}
    <div style={{ position: 'relative', width: 160, height: 160 }}>
      {/* Outer ring */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '1px solid var(--cyan-dim)', borderRadius: '50%',
        animation: 'spin-slow 3s linear infinite',
        borderTopColor: 'var(--cyan)',
      }} />
      {/* Middle ring */}
      <div style={{
        position: 'absolute', inset: 20,
        border: '1px solid var(--violet-dim)', borderRadius: '50%',
        animation: 'spin-slow 2s linear infinite reverse',
        borderRightColor: 'var(--violet)',
      }} />
      {/* Inner orb */}
      <div style={{
        position: 'absolute', inset: 50,
        background: 'radial-gradient(circle, var(--cyan) 0%, var(--violet) 100%)',
        borderRadius: '50%',
        animation: 'pulse-glow 1.5s ease-in-out infinite',
        boxShadow: '0 0 30px var(--cyan-glow), 0 0 60px var(--violet-glow)',
      }} />
    </div>

    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 4, color: 'var(--cyan)', marginBottom: 8 }}>
        SIMULATING FUTURES
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 300, lineHeight: 1.6 }}>
        Running climate models · Calculating risk cascades · Generating AI narrative
      </div>
    </div>

    {/* Progress steps */}
    {['Parsing scenario parameters...', 'Running adoption elasticity model...', 'Calculating second-order effects...', 'Generating outcome narrative...'].map((step, i) => (
      <div key={i} style={{
        fontSize: 11, color: 'var(--text-muted)',
        animation: `fadeUp 0.3s ease ${i * 0.5}s both`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--cyan)', animation: 'pulse-glow 1s ease infinite' }} />
        {step}
      </div>
    ))}
  </div>
);

export default LoadingOrb;
