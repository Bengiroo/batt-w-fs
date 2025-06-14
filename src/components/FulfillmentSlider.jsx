import React from "react";

export default function FulfillmentSlider({ value, total, mode }) {
  const percent = total === 0 ? 0 : value / total;
  return (
    <div style={{
      width: "100%",
      height: 16,
      borderRadius: 9,
      background: `linear-gradient(90deg, #2196f3 0%, #2196f3 ${100 - percent * 100}%, #f44336 ${100 - percent * 100}%, #f44336 100%)`,
      position: "relative",
      zIndex: 41,
      boxShadow: "0 2px 12px #0007"
    }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          textAlign: "center",
          color: "#fff",
          fontWeight: 700,
          lineHeight: "16px",
          fontSize: 13,
          letterSpacing: 0.5,
          textShadow: "0 1px 2px #0007",
          position: "relative",
          zIndex: 42,
          pointerEvents: "none"
        }}
      >
        {value} / {total}
      </div>
    </div>
  );
}