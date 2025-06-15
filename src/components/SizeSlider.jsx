import React from "react";

export default function SizeSlider({ sizeOptions, value, setValue, isOffense }) {
  const accent = isOffense ? "#ff3860" : "#33bbff";
  const label = sizeOptions[value]?.label || sizeOptions[value]?.name;

  return (
    <div style={{ width: "100%", padding: "12px 0", textAlign: "center" }}>
      <input
        type="range"
        min={0}
        max={sizeOptions.length - 1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        step={1}
        style={{
          width: "80%",
          margin: "0 auto",
          display: "block",
          WebkitAppearance: "none",
          height: 8,
          borderRadius: 6,
          background: "#1c1e2e",
          outline: "none",
          boxShadow: `0 0 5px ${accent}88`,
          accentColor: accent,
        }}
      />
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: accent,
          marginTop: 8,
          textShadow: `0 0 4px ${accent}`,
        }}
      >
        {label}
      </div>

      {/* Chrome/Edge/Firefox slider glow */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          background: ${accent};
          border: 2px solid #000;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 8px ${accent};
        }
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          background: ${accent};
          border: 2px solid #000;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 8px ${accent};
        }
        input[type="range"]::-webkit-slider-runnable-track {
          background: #1c1e2e;
        }
        input[type="range"]::-moz-range-track {
          background: #1c1e2e;
        }
      `}</style>
    </div>
  );
}
