import React from "react";

export default function PanelControls({
  onReset, onFire, onAnchor,
  balance, bet, setBet, mode, isPortrait,
  winPercentage, predictedMultiplier,
  onModeToggle
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
      {/* Top Buttons Row */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {[
          { label: "Reset", icon: "🔁", onClick: onReset, style: { backgroundColor: "#444", border: "2px solid #999" } },
          { label: "Mode", icon: mode === "offense" ? "🛡" : "🔥", onClick: onModeToggle, style: { backgroundColor: "#1f2333", border: "2px solid #00ccff" } },
          { label: "Anchor", icon: <img src="/anchor.png" alt="anchor" style={{ width: 28, height: 28 }} />, onClick: onAnchor, style: { backgroundColor: "#00cc66", border: "2px solid #00ffee" } },
          { label: "Fire", icon: <img src="/fire.png" alt="fire" style={{ width: 28, height: 28 }} />, onClick: onFire, style: { backgroundColor: "#ff0033", border: "2px solid #ff5e7a" } },
        ].map(({ label, icon, onClick, style }, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 0 6px #ffffffaa",
              marginBottom: 4
            }}>{label}</div>
            <button onClick={onClick} style={{ ...iconBtnStyle, ...style }}>
              {icon}
            </button>
          </div>
        ))}
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
          height: 40,
          width: "100%",
        }}>
          {/* Dollar icon */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 6px",
            color: "#a084f6",
            fontSize: 16,
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
              padding: "0 8px",
              textAlign: "left",
              MozAppearance: "textfield",
              WebkitAppearance: "none",
              appearance: "none",
            }}
          />

          {/* Right-side buttons */}
          <div style={{
            display: "flex", height: "80%", gap: 3,
            marginTop: 4,
            marginBottom: 4,
            marginright: 8,
          }}> <button onClick={() => setBet(bet * 2)} style={betBtn}>2X</button>
            <button onClick={() => setBet(Math.floor(bet / 2))} style={betBtn}>1/2</button>
            <button onClick={() => setBet(Math.floor(balance / 10))} style={betBtn}>Max</button>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div style={{ textAlign: "center", marginTop: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#00ffff" }}>Balance</div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 20,
            color: mode === "offense" ? "#ff3860" : "#33bbff",
            textShadow: "0 0 4px currentColor",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {balance.toFixed(2)} <img src="/coin.png" alt="coin" style={{ height: 18 }} />
        </div>
      </div>

      {/* Stats at Bottom */}
      <div
        style={{
          marginTop: "auto",
          width: "90%",
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
  fontSize: 13,
  padding: "0 10px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderLeft: "1px solid #5c3cfc",
};

const iconBtnStyle = {
  width: 60,
  height: 60,
  borderRadius: 7,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  fontWeight: "bold",
  color: "#fff",
  cursor: "pointer",
};
