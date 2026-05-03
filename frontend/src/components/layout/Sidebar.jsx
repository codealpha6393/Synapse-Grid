import React from 'react';
import useStore from '../../store/useStore';
import { Wind, Landmark, Activity, Building2 } from 'lucide-react';

const domains = [
  { id: 'climate', icon: Wind, label: 'CLIMATE INFRASTRUCTURE', color: 'var(--cyan)' },
  { id: 'finance', icon: Landmark, label: 'MACRO-ECONOMIC POLICY', color: 'var(--emerald)' },
  { id: 'healthcare', icon: Activity, label: 'HEALTHCARE SYSTEMS', color: 'var(--red)' },
  { id: 'urban', icon: Building2, label: 'URBAN PLANNING', color: 'var(--violet)' },
];

const Sidebar = () => {
  const { activeDomain, setActiveDomain } = useStore();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: 'calc(100vh - 64px)',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      padding: '24px 16px',
      display: 'flex', flexDirection: 'column', gap: 12
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 12, paddingLeft: 8, fontFamily: 'var(--font-display)' }}>
        DOMAIN SELECTOR
      </div>

      {domains.map(d => {
        const Icon = d.icon;
        const isActive = activeDomain === d.id;

        return (
          <button
            key={d.id}
            aria-pressed={isActive}
            onClick={() => setActiveDomain(d.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px', width: '100%',
              background: isActive ? `${d.color}20` : 'transparent',
              border: `1px solid ${isActive ? d.color : 'transparent'}`,
              borderRadius: 8, cursor: 'pointer',
              transition: 'all 0.2s', textAlign: 'left',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: isActive ? d.color : 'var(--bg-card)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: isActive ? 'none' : '1px solid var(--border-subtle)'
            }}>
              <Icon size={16} color={isActive ? '#000' : 'var(--text-secondary)'} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1,
                color: isActive ? d.color : 'var(--text-secondary)',
                marginBottom: 4, fontWeight: isActive ? 600 : 400
              }}>
                {d.label}
              </div>
            </div>
          </button>
        );
      })}

      <div style={{ marginTop: 'auto', padding: 16, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>
          SYNAPSE ENTERPRISE
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
          Need custom domain logic for your organization?
        </div>
        <button style={{
          width: '100%', padding: '8px', background: 'transparent',
          border: '1px solid var(--cyan-dim)', borderRadius: 4,
          color: 'var(--cyan)', fontSize: 11, fontFamily: 'var(--font-display)',
          cursor: 'pointer'
        }}>
          REQUEST ACCESS
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
