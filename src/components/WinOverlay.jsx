import React from "react";
import "./WinOverlay.css";

export default function WinOverlay({ visible, balanceChange, multiplier, gridBounds, fading }) {
    if (!visible || !gridBounds) return null; // allow loss to show ❌

    const isWin = balanceChange > 0;

    const style = {
        position: "absolute",
        left: gridBounds.width / 2,
        top: gridBounds.height / 2,
        transform: "translate(-100%, -100%)",
        width: gridBounds.width * 0.30,
        height: gridBounds.height * 0.28,
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
