import React, { useEffect, useState } from "react";
import "./WinOverlay.css";

export default function WinOverlay({ visible, balanceChange, multiplier, gridBounds, isLoss }) {
    const [fading, setFading] = useState(false);

    useEffect(() => {
        if (visible) {
            setFading(false);
            const timer = setTimeout(() => setFading(true), 10000); // 10 seconds then fade
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible || !gridBounds) return null;

    const isWin = balanceChange > 0;

    const style = {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: gridBounds.width * 0.30,
        height: gridBounds.height * 0.28,
        pointerEvents: "none",
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
