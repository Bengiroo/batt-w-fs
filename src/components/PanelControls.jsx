import React from "react";

export default function PanelControls({
  onReset, onFire, onAnchor,
  balance, bet, setBet, mode, isPortrait,
  winPercentage, predictedMultiplier,
  onModeToggle,
  canFire
}) {
  const resetIcon = mode === "offense" ? "/oclear.png" : "/dclear.png";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        padding: 10,
        gap: 16,
        height: "100%",
      }}
    >
      {/* === Top Button Row === */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {[{
          label: "Clear",
          icon: (
            <img
              src={resetIcon}
              alt="clear"
              style={{ width: 60, height: 60, objectFit: "contain" }}
            />
          ),
          onClick: onReset,
          style: {
            backgroundColor: "transparent",
            border: "2px solid #00ccff",
          }
        },
        {
          label: "Mode",
          icon: (
            <img
              src={mode === "offense" ? "/5.png" : "/6.png"}
              alt="mode"
              style={{ width: 56, height: 56, objectFit: "contain" }}
            />
          ),
          onClick: onModeToggle,
          style: {
            backgroundColor: mode === "offense" ? "#0077ff" : "#ff0033",
            border: "2px solid #00ccff"
          }
        },
        {
          label: "Anchor",
          icon: <img src="/anchor.png" alt="anchor" style={{ width: 56, height: 56, objectFit: "contain" }} />,
          onClick: onAnchor,
          style: { backgroundColor: "#00cc66", border: "2px solid #00ffee" }
        },
        {
          label: "Fire",
          icon: <img src="/fire.png" alt="fire" style={{ width: 56, height: 56, objectFit: "contain" }} />,
          onClick: canFire ? () => {
            console.log("🔥 FIRE API PAYLOAD:", {
              bet,
              mode,
              winPercentage,
              predictedMultiplier
            });
            onFire();
          } : undefined,
          style: {
            backgroundColor: "#ff0033",
            border: "2px solid #ff5e7a",
            opacity: canFire ? 1 : 0.4,
            cursor: canFire ? "pointer" : "not-allowed"
          },
          disabled: !canFire
        }
        ].map(({ label, icon, onClick, style, disabled }, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 0 6px #ffffffaa",
              marginBottom: 4
            }}>{label}</div>
            <button
              onClick={onClick}
              style={{ ...iconBtnStyle, ...style }}
              disabled={disabled}
            >
              {icon}
            </button>
          </div>
        ))}
      </div>

      {/* === Bet Input & Balance Row === */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          fontSize: 14,
          fontWeight: 700,
          color: "#00ffff"
        }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Bet Amount</div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 16,
            fontWeight: 800,
            color: "#00ffcc",
            whiteSpace: "nowrap"
          }}>
            <span>Balance:</span>
            <span style={{
              color: mode === "offense" ? "#ff3860" : "#33bbff",
              textShadow: "0 0 4px currentColor",
              fontSize: 18
            }}>
              {balance.toFixed(2)}
            </span>
            <img src="/coin.png" alt="coin" style={{ height: 18 }} />
          </div>
        </div>

        {/* Bet Input + Buttons */}
        <div style={{
          display: "flex",
          backgroundColor: "#0a0d1a",
          border: "2px solid #5c3cfc",
          borderRadius: 10,
          overflow: "hidden",
          height: 40,
          width: "100%",
        }}>
          {/* Dollar Symbol */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 6px",
            color: "#a084f6",
            fontSize: 16,
            fontWeight: 600,
            backgroundColor: "#0a0d1a",
          }}>$</div>

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

          {/* Bet Action Buttons */}
          <div style={{
            display: "flex", height: "80%", gap: 3,
            marginTop: 4,
            marginBottom: 4,
            marginRight: 8,
          }}>
            <button onClick={() => setBet(bet * 2)} style={betBtn}>2X</button>
            <button onClick={() => setBet(Math.floor(bet / 2))} style={betBtn}>1/2</button>
            <button onClick={() => setBet(Math.floor(balance / 10))} style={betBtn}>Max</button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
