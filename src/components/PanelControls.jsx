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
        <div style={{ fontWeight: 600, fontSize: 14, color: "#00ffff" }}>Bet Amount</div>

        <div style={{
          display: "flex",
          backgroundColor: "#0a0d1a",
          border: "2px solid #5c3cfc",
          borderRadius: 10,
          overflow: "hidden",
          height: 42,
          width: "100%",
        }}>
          {/* Dollar icon */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 12px",
            color: "#a084f6",
            fontSize: 18,
            fontWeight: 600,
            backgroundColor: "#0a0d1a",
          }}>
            $
          </div>

          {/* Input */}
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            min={0}
            max={balance}
            style={{
              flex: 1,
              backgroundColor: "#0a0d1a",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: 16,
              padding: "0 10px",
              textAlign: "left",
              MozAppearance: "textfield",
              WebkitAppearance: "none",
              appearance: "none",
            }}
          />

          {/* Right-side buttons */}
          <div style={{ display: "flex", height: "100%" }}>
            <button onClick={() => setBet(Math.floor(bet / 2))} style={betBtn}>½</button>
            <button onClick={() => setBet(bet * 2)} style={betBtn}>2X</button>
            <button onClick={() => setBet(Math.floor(balance / 10))} style={betBtn}>Max</button>
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

const betBtn = {
  backgroundColor: "#2e1f5e",
  border: "none",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 14,
  padding: "0 12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderLeft: "1px solid #5c3cfc",
};