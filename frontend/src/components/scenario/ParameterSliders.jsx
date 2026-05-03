import React from 'react';
import useStore from '../../store/useStore';

const Slider = ({ label, value, min, max, step, unit, onChange, accentColor = 'var(--cyan)', description }) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
          {description && <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 8 }}>{description}</span>}
        </div>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 14, color: accentColor, fontWeight: 700 }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ position: 'relative', height: 4, background: 'var(--border-subtle)', borderRadius: 2 }}>
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: '100%', background: accentColor, borderRadius: 2, transition: 'width 0.1s' }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            position: 'absolute', top: '50%', left: 0, width: '100%',
            transform: 'translateY(-50%)', opacity: 0, cursor: 'pointer',
            height: 20, margin: 0,
          }}
        />
      </div>
    </div>
  );
};

const DOMAIN_SLIDERS = {
  climate: [
    { key: "subsidy_change_pct", label: "Subsidy Change", min: -50, max: 100, step: 5, unit: "%", color: "var(--cyan)", desc: "% change from current" },
    { key: "initial_ev_adoption_pct", label: "Current EV Adoption", min: 0, max: 40, step: 0.5, unit: "%", color: "var(--orange)", desc: "Baseline fleet %" },
    { key: "renewable_investment_pct", label: "Renewable Investment", min: 0, max: 100, step: 5, unit: "%", color: "var(--emerald)", desc: "Grid clean energy %" }
  ],
  finance: [
    { key: "interest_rate_pct", label: "Interest Rate Target", min: 0, max: 15, step: 0.25, unit: "%", color: "var(--emerald)", desc: "Central bank base rate" },
    { key: "corporate_tax_pct", label: "Corporate Tax Change", min: -15, max: 15, step: 1, unit: "%", color: "var(--orange)", desc: "Baseline tax rate delta" },
    { key: "stimulus_billion", label: "Stimulus Package", min: 0, max: 500, step: 10, unit: "$B", color: "var(--cyan)", desc: "Direct fiscal injection" }
  ],
  healthcare: [
    { key: "hospital_budget_bn", label: "Hospital Budget", min: 1, max: 50, step: 1, unit: "$B", color: "var(--red)", desc: "Direct funding" },
    { key: "telehealth_mandate_pct", label: "Telehealth Shift", min: 0, max: 80, step: 5, unit: "%", color: "var(--cyan)", desc: "Virtual primary care" },
    { key: "preventative_care_pct", label: "Preventative Target", min: 0, max: 50, step: 2, unit: "%", color: "var(--emerald)", desc: "Early screening budget" }
  ],
  urban: [
    { key: "housing_zoning_reform_pct", label: "Zoning Reform", min: 0, max: 100, step: 5, unit: "%", color: "var(--violet)", desc: "Rezoned for multi-use" },
    { key: "transit_budget_bn", label: "Transit Budget", min: 0, max: 100, step: 2, unit: "$B", color: "var(--cyan)", desc: "Public transport funding" },
    { key: "density_limit_increase_pct", label: "Density Lift", min: 0, max: 100, step: 5, unit: "%", color: "var(--orange)", desc: "Allowable floor ratio" }
  ]
};

const ParameterSliders = () => {
  const { activeDomain, scenario, updateScenario, updateDomainParam } = useStore();
  const sliders = DOMAIN_SLIDERS[activeDomain] || DOMAIN_SLIDERS.climate;

  return (
    <div style={{
      padding: '24px', background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)', borderRadius: 10, marginBottom: 8,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 20, fontFamily: 'var(--font-display)' }}>
        SIMULATION PARAMETERS
      </div>

      <Slider
        label="Timeframe"
        value={scenario.timeframe_years}
        min={1} max={15} step={1} unit=" yrs"
        accentColor="var(--violet)"
        description="Implementation period"
        onChange={v => updateScenario({ timeframe_years: v })}
      />
      <Slider
        label="Budget (General)"
        value={scenario.budget_billion_usd}
        min={0.5} max={100} step={0.5} unit="$B"
        accentColor="var(--emerald)"
        description="Total non-specific allocation"
        onChange={v => updateScenario({ budget_billion_usd: v })}
      />

      <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '20px 0' }} />

      {sliders.map(s => (
        <Slider
          key={s.key}
          label={s.label}
          value={scenario.domain_params[s.key] !== undefined ? scenario.domain_params[s.key] : s.min}
          min={s.min} max={s.max} step={s.step} unit={s.unit}
          accentColor={s.color}
          description={s.desc}
          onChange={v => updateDomainParam(s.key, v)}
        />
      ))}
    </div>
  );
};

export default ParameterSliders;
