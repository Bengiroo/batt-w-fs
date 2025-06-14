import React from "react";

export default function SizeSlider({ sizeOptions, value, setValue, isOffense }) {
  return (
    <div style={{ width: "100%", margin: "8px 0 4px 0" }}>
      <input
        type="range"
        min={0}
        max={sizeOptions.length - 1}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        step={1}
        style={{
          width: "100%",
          accentColor: isOffense ? "#f44336" : "#2196f3"
        }}
      />
      <div style={{
        textAlign: "center",
        fontSize: 15,
        marginTop: 2,
        minHeight: 20,
        fontWeight: 600,
        letterSpacing: 0.5
      }}>
        {sizeOptions[value].label || sizeOptions[value].name}
      </div>
    </div>
  );
}