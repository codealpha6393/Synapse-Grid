import React from 'react';
import { Wind, Landmark, Activity, Building2, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';

const features = [
    { id: 'climate', icon: Wind, label: 'CLIMATE INFRASTRUCTURE', color: 'var(--cyan)', desc: 'Simulate EV adoption, CO2 footprints, and grid stress.' },
    { id: 'finance', icon: Landmark, label: 'MACRO-ECONOMIC POLICY', color: 'var(--emerald)', desc: 'Predict GDP growth, inflation, and market confidence.' },
    { id: 'healthcare', icon: Activity, label: 'HEALTHCARE SYSTEMS', color: 'var(--red)', desc: 'Analyze hospital beds, telehealth mandates, and care.' },
    { id: 'urban', icon: Building2, label: 'URBAN PLANNING', color: 'var(--violet)', desc: 'Model zoning reforms, density, and transit budgets.' },
];

const LandingPage = () => {
    const { setActiveView, setActiveDomain } = useStore();

    const handleEnterDomain = (domainId) => {
        setActiveDomain(domainId);
        setActiveView('builder');
    };

    return (
        <div style={{ padding: '64px', maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <div className="animate-fade-up" style={{ fontSize: 12, color: 'var(--cyan)', letterSpacing: 4, fontFamily: 'var(--font-display)', marginBottom: 16 }}>
                    DECISION OPERATING SYSTEM
                </div>
                <h1 className="animate-fade-up" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 56,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.1,
                    marginBottom: 24,
                    textShadow: '0 0 40px var(--cyan-glow)'
                }}>
                    Simulate the ripples<br />of your policy.
                </h1>
                <p className="animate-fade-up" style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, maxWidth: 600, margin: '0 auto', animationDelay: '0.1s' }}>
                    SYNAPSE GRID is a multi-domain simulation platform that predicts the impact of large-scale decisions across infrastructure, economy, healthcare, and urban planning.
                </p>
            </div>

            {/* Grid */}
            <div className="animate-fade-up" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                width: '100%',
                animationDelay: '0.2s'
            }}>
                {features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                        <div key={f.id} style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 16,
                            padding: 32,
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 10px 40px ${f.color}20`;
                                e.currentTarget.style.borderColor = f.color;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            }}
                            onClick={() => handleEnterDomain(f.id)}
                        >
                            <div style={{
                                position: 'absolute', top: -30, right: -30,
                                width: 150, height: 150, background: f.color,
                                filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%',
                            }} />

                            <div style={{
                                width: 48, height: 48, borderRadius: 12,
                                background: `linear-gradient(135deg, var(--bg-elevated), var(--bg-card))`,
                                border: '1px solid var(--border-active)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 24
                            }}>
                                <Icon size={24} color={f.color} />
                            </div>

                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: 2, color: 'var(--text-primary)', marginBottom: 12 }}>
                                {f.label}
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 24 }}>
                                {f.desc}
                            </p>

                            <button style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'transparent', border: 'none',
                                color: f.color, fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1,
                                cursor: 'pointer', marginTop: 'auto', padding: 0
                            }}>
                                ENTER DOMAIN <ArrowRight size={14} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default LandingPage;
