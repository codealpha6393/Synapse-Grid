import React from 'react';
import { Activity, Zap, Sun, Moon } from 'lucide-react';
import useStore from '../../store/useStore';

const TopBar = () => {
  const { result, activeView, setActiveView, activeDomain, theme, toggleTheme } = useStore();

  return (
    <header style={{
      height: 'var(--topbar-height)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'var(--bg-surface)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div
        onClick={() => setActiveView('landing')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      >
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={16} color="#000" fill="#000" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: 3, color: 'var(--text-primary)' }}>
            SYNAPSE GRID
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 2 }}>
            DECISION OPERATING SYSTEM
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{ display: 'flex', gap: 4 }}>
        {[
          { id: 'builder', label: 'SCENARIO' },
          { id: 'results', label: 'SIMULATION', disabled: !result },
          { id: 'compare', label: 'COMPARE', disabled: !result },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveView(tab.id)}
            style={{
              padding: '6px 16px',
              background: activeView === tab.id ? 'var(--cyan-glow)' : 'transparent',
              border: `1px solid ${activeView === tab.id ? 'var(--cyan)' : 'transparent'}`,
              borderRadius: 4,
              color: activeView === tab.id ? 'var(--cyan)' : tab.disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontSize: 10,
              letterSpacing: 1,
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Status & Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={12} color="var(--emerald)" />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
            {activeDomain.toUpperCase()} ENGINE ACTIVE
          </span>
        </div>

        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
