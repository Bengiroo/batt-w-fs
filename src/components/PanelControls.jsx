import React from "react";

export default function PanelControls({
  onReset, onFire, onAnchor,
  balance, bet, setBet, mode, isPortrait,
  winPercentage, predictedMultiplier
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isPortrait ? "column" : "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        padding: 10,
        gap: 16,
        height: "100%",
      }}
    >
      {/* Fire + Anchor Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onFire}
          style={{
            width: 60,
            height: 60,
            borderRadius: 7,
            backgroundColor: "#ff0033",
            border: "2px solid #ff5e7a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 8px #ff5e7a88",
            cursor: "pointer",
          }}
        >
          <img src="/fire.png" alt="fire" style={{ width: 28, height: 28 }} />
        </button>

        <button
          onClick={onAnchor}
          style={{
            width: 60,
            height: 60,
            borderRadius: 7,
            backgroundColor: "#00cc66",
            border: "2px solid #00ffee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 8px #00ffee55",
            cursor: "pointer",
          }}
        >
          <img src="/anchor.png" alt="anchor" style={{ width: 28, height: 28 }} />
        </button>
      </div>

      {/* Bet Input Area */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 14, textAlign: "center", color: "#00ffff" }}>Bet Amount</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            min={0}
            max={balance}
            style={{
              flex: 1,
              border: "3px solid #00ccff",
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 16,
              textAlign: "center",
              backgroundColor: "#121624",
              color: "#00ffff",
              boxShadow: "0 0 6px #00ccff44",
            }}
          />
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setBet(bet / 2)} style={miniBtn}>1/2</button>
            <button onClick={() => setBet(bet * 2)} style={miniBtn}>2x</button>
            <button onClick={() => setBet(balance)} style={miniBtn}>Max</button>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: "#00ffff" }}>Balance</div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: mode === "offense" ? "#ff3860" : "#33bbff",
            textShadow: "0 0 5px currentColor",
          }}
        >
          {balance.toFixed(2)} 💰
        </div>
      </div>

      {/* Stats at Bottom */}
      <div
        style={{
          marginTop: "auto",
          width: "100%",
          background: "#001122",
          border: "2px solid cyan",
          borderRadius: 10,
          padding: "10px 14px",
          color: "#0ff",
          fontFamily: "monospace",
          fontSize: 14,
          textAlign: "center",
          boxShadow: "0 0 8px #0ff",
        }}
      >
        <div>🎯 <strong>Chance to Win:</strong> {winPercentage}%</div>
        <div>💥 <strong>Multiplier:</strong> {predictedMultiplier}x</div>
      </div>
    </div>
  );
}

const miniBtn = {
  backgroundColor: "#1f2333",
  border: "2px solid #00ccff",
  color: "#00ffff",
  fontWeight: 700,
  fontSize: 13,
  borderRadius: 5,
  padding: "4px 8px",
  cursor: "pointer",
  boxShadow: "0 0 6px #00ccff44",
};
