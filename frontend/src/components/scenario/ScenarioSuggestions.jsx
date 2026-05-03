import React, { useEffect, useState } from "react";

import useStore from "../../store/useStore";
import { fetchScenarioSuggestions } from "../../utils/api";

export default function ScenarioSuggestions() {
  const setScenario = useStore((state) => state.setScenario);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchScenarioSuggestions()
      .then((payload) => {
        if (!cancelled) setSuggestions(payload.scenarios || []);
      })
      .catch(() => {
        if (!cancelled) setError("Suggestions are unavailable right now.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const primary = suggestions[0];

  return (
    <div className="panel" style={{ padding: 20 }}>
      <div className="eyebrow">Guided Start</div>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        Load a seeded summit scenario or draft one from scratch in plain language.
      </p>
      {primary ? (
        <>
          <div style={{ marginBottom: 14, color: "var(--text-primary)" }}>{primary.title}</div>
          <button
            type="button"
            onClick={() => setScenario(primary)}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid var(--border-active)",
              background: "var(--cyan-glow)",
              color: "var(--text-primary)",
            }}
          >
            Load Suggestion
          </button>
        </>
      ) : (
        <div style={{ color: "var(--text-muted)" }}>{error || "Loading suggestions..."}</div>
      )}
    </div>
  );
}
