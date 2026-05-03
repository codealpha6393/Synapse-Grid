import React from "react";

import LoadingOrb from "./LoadingOrb";

export default function SimulateButton({ disabled, loading, error, onClick }) {
  return (
    <div className="panel" style={{ padding: 20 }}>
      <div className="eyebrow">Simulation</div>
      {loading ? (
        <LoadingOrb />
      ) : (
        <>
          <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "14px 18px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, var(--cyan), var(--violet))",
              color: "#03050a",
              fontFamily: "var(--font-display)",
            }}
          >
            Run Simulation
          </button>
          {error ? <p style={{ color: "var(--orange)", marginTop: 12 }}>{error}</p> : null}
        </>
      )}
    </div>
  );
}
