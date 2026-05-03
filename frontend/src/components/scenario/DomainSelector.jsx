import React from "react";

import useStore from "../../store/useStore";

const domains = [
  { id: "climate", label: "Climate", status: "active" },
  { id: "finance", label: "Finance Coming Soon", status: "locked" },
  { id: "healthcare", label: "Healthcare Coming Soon", status: "locked" },
  { id: "urban", label: "Urban Coming Soon", status: "locked" },
];

export default function DomainSelector() {
  const scenarioDomain = useStore((state) => state.scenario.domain);

  return (
    <div className="grid-two" style={{ marginTop: 22 }}>
      {domains.map((domain) => {
        const active = scenarioDomain === domain.id;
        return (
          <button
            key={domain.id}
            type="button"
            disabled={domain.status === "locked"}
            aria-pressed={active}
            style={{
              padding: 18,
              textAlign: "left",
              borderRadius: 16,
              border: `1px solid ${active ? "var(--border-active)" : "var(--border-subtle)"}`,
              background: active ? "var(--cyan-glow)" : "rgba(10, 12, 22, 0.75)",
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>{domain.label}</div>
            <div style={{ marginTop: 8, fontSize: 12 }}>
              {domain.status === "active" ? "Live simulation available" : "Locked for roadmap preview"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
