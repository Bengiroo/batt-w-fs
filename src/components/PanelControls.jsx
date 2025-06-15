import React from "react";

export default function PanelControls({
  onReset, onFire, onAnchor, balance, bet, setBet, mode, isPortrait
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isPortrait ? "row" : "column",
        justifyContent: "center",
        alignItems: "center",
        gap: isPortrait ? 12 : 20,
        marginTop: isPortrait ? 16 : 0,
        width: isPortrait ? "100vw" : "100%",
        flexWrap: isPortrait ? "wrap" : "nowrap",
        fontSize: 15,
        textAlign: "center",
      }}
    >
      {/* Reset */}
      <button
        style={{
          background: "#ff3860",
          color: "#fff",
          border: "2px solid #ff5e7a",
          borderRadius: 7,
          padding: "7px 16px",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: 15,
          boxShadow: "0 0 8px #ff5e7a88",
        }}
        onClick={onReset}
      >
        Reset
      </button>

      {/* Anchor */}
      <button
        style={{
          background: "#003344",
          color: "#00ffee",
          border: "2px solid #00ffee",
          borderRadius: 7,
          padding: "7px 16px",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: 15,
          boxShadow: "0 0 8px #00ffee55",
        }}
        onClick={onAnchor}
      >
        Anchor
      </button>

      {/* Fire */}
      <button
        style={{
          background: "#2196f3",
          color: "#fff",
          border: "2px solid #33bbff",
          borderRadius: 7,
          padding: "7px 16px",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: 15,
          boxShadow: "0 0 8px #33bbff88",
        }}
        onClick={onFire}
      >
        Fire
      </button>

      {/* Balance */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#00ffff" }}>Balance</span>
        <span
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: mode === "offense" ? "#ff3860" : "#33bbff",
            textShadow: "0 0 5px currentColor",
          }}
        >
          {balance} 💰
        </span>
      </div>

      {/* Bet */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Bet</span>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          min={0}
          max={balance}
          style={{
            width: 70,
            border: "1px solid #00ccff",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 15,
            textAlign: "center",
            backgroundColor: "#121624",
            color: "#00ffff",
            boxShadow: "0 0 6px #00ccff44",
          }}
        />
      </div>
    </div>
  );
}
