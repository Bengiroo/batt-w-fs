import React from "react";
import "./WinOverlay.css";

export default function WinOverlay({ visible, balanceChange, multiplier, gridBounds, fading, isLoss }) {
    if (!visible || !gridBounds) return null;

    const isWin = !isLoss;

    const style = {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: gridBounds.width * 0.30,
        height: gridBounds.height * 0.28,
        zIndex: 9999,
    };

    return (
        <div className={`win-overlay ${fading ? "fade" : ""}`} style={style}>
            <div className="win-content">
                {isWin ? (
                    <>
                        <div className="win-title">WIN</div>
                        <div className="win-amount">${balanceChange.toFixed(2)}</div>
                        <div className="win-multiplier">{multiplier.toFixed(2)}x</div>
                    </>
                ) : (
                    <div className="loss-x">❌</div>
                )}
            </div>
        </div>
    );
}
