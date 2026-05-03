import React, { useEffect, useState } from 'react';
import { Play, Lightbulb, ChevronDown } from 'lucide-react';
import useStore from '../../store/useStore';
import { useSimulation } from '../../hooks/useSimulation';
import { getSuggestions } from '../../utils/api';
import ParameterSliders from './ParameterSliders';

const SCALES = ['local', 'regional', 'national', 'global'];

const ScenarioBuilder = () => {
  const { scenario, updateScenario, activeDomain } = useStore();
  const { simulate } = useSimulation();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getSuggestions().then((data) => setSuggestions(data.scenarios || [])).catch(() => { });
  }, []);

  const loadSuggestion = (s) => {
    updateScenario({
      title: s.title,
      description: s.description,
      ...s.params,
    });
    setShowSuggestions(false);
  };

  const canSimulate = scenario.title.length >= 5 && scenario.description.length >= 10;

  return (
    <div style={{ padding: '32px', maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, color: 'var(--cyan)', letterSpacing: 3, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          SCENARIO BUILDER — {activeDomain.toUpperCase()} DOMAIN
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          What decision do you want to simulate?
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
          Describe a policy, investment, or intervention. SYNAPSE GRID will predict the outcome before you commit.
        </p>
      </div>

      {/* Suggestions Button */}
      <div style={{ marginBottom: 20, position: 'relative' }}>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px',
            background: 'var(--violet-glow)',
            border: '1px solid var(--violet-dim)',
            borderRadius: 6, color: 'var(--violet)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          <Lightbulb size={14} /> SCENARIO SUGGESTIONS <ChevronDown size={12} />
        </button>

        {showSuggestions && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, zIndex: 50, marginTop: 4,
            background: 'var(--bg-elevated)', border: '1px solid var(--border-active)',
            borderRadius: 8, overflow: 'hidden', minWidth: 360,
          }}>
            {suggestions.filter(s => s.domain === activeDomain).map(s => (
              <button
                key={s.id}
                onClick={() => loadSuggestion(s)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 16px', background: 'transparent',
                  border: 'none', borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--cyan-glow)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: 12, fontWeight: 500 }}>{s.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.category}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scenario Title */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
          SCENARIO TITLE
        </label>
        <input
          aria-label="Scenario Title"
          value={scenario.title}
          onChange={e => updateScenario({ title: e.target.value })}
          placeholder="e.g. EV Subsidy Increase 20% — National Policy"
          style={{
            width: '100%', padding: '12px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius)', color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--cyan-dim)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
          DESCRIBE YOUR SCENARIO (natural language)
        </label>
        <textarea
          aria-label="Scenario Description"
          value={scenario.description}
          onChange={e => updateScenario({ description: e.target.value })}
          placeholder="Describe the policy or decision in plain language. e.g. 'Increase federal EV purchase subsidies by 20% over 3 years to accelerate fleet electrification and reduce transport emissions nationally.'"
          rows={4}
          style={{
            width: '100%', padding: '12px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius)', color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none',
            resize: 'vertical', lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--cyan-dim)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
        />
      </div>

      {/* Scale Selector */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1, display: 'block', marginBottom: 10 }}>
          IMPLEMENTATION SCALE
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {SCALES.map(s => (
            <button
              key={s}
              onClick={() => updateScenario({ scale: s })}
              style={{
                flex: 1, padding: '10px 4px',
                background: scenario.scale === s ? 'var(--cyan-glow)' : 'var(--bg-elevated)',
                border: `1px solid ${scenario.scale === s ? 'var(--cyan)' : 'var(--border-subtle)'}`,
                borderRadius: 6, color: scenario.scale === s ? 'var(--cyan)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1,
                cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Sliders */}
      <ParameterSliders />

      {/* Simulate Button */}
      <button
        onClick={simulate}
        disabled={!canSimulate}
        style={{
          width: '100%', marginTop: 32,
          padding: '18px',
          background: canSimulate
            ? 'linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)'
            : 'var(--border-subtle)',
          border: 'none', borderRadius: 10,
          color: canSimulate ? '#000' : 'var(--text-muted)',
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          letterSpacing: 3, cursor: canSimulate ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'all 0.3s',
          boxShadow: canSimulate ? '0 0 40px var(--cyan-glow)' : 'none',
        }}
      >
        <Play size={16} fill="currentColor" />
        RUN SIMULATION
      </button>
    </div>
  );
};

export default ScenarioBuilder;
