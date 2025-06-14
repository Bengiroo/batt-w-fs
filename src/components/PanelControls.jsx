import React from "react";

export default function PanelControls({
  onReset, onFire, onAnchor, balance, bet, setBet, mode, isPortrait
}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: isPortrait ? "row" : "column",
      justifyContent: "center",
      alignItems: "center",
      gap: isPortrait ? 12 : 24,
      margin: isPortrait ? "16px 0 0 0" : "0 0 0 24px",
      width: isPortrait ? "100vw" : 170,
      minHeight: 120,
      fontSize: 15
    }}>
      <button
        style={{
          background: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: 7,
          padding: "7px 14px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 16
        }}
        onClick={onReset}
      >
        Reset
      </button>
      <button
        style={{
          background: "#fff",
          color: "#222",
          border: "1px solid #bbb",
          borderRadius: 7,
          padding: "7px 14px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 16
        }}
        onClick={onAnchor}
      >
        Anchor
      </button>
      <button
        style={{
          background: "#2196f3",
          color: "#fff",
          border: "none",
          borderRadius: 7,
          padding: "7px 14px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 16
        }}
        onClick={onFire}
      >
        Fire
      </button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Balance</span>
        <span style={{
          fontWeight: 700,
          fontSize: 18,
          color: mode === "offense" ? "#f44336" : "#2196f3"
        }}>
          {balance} 💰
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontWeight: 600 }}>Bet</span>
        <input
          type="number"
          value={bet}
          onChange={e => setBet(Number(e.target.value))}
          min={0}
          max={balance}
          style={{
            width: 60,
            border: "1px solid #bbb",
            borderRadius: 6,
            padding: "2px 8px",
            fontSize: 15,
            textAlign: "center"
          }}
        />
      </div>
    </div>
  );
}