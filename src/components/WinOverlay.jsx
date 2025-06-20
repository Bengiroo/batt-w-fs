import React from "react";
import "./WinOverlay.css";

export default function WinOverlay({
    visible,
    balanceChange,
    multiplier,
    isLoss,
    winPercentage,
    predictedMultiplier,
}) {
    const isWin = !isLoss;

    return (
        <div className="win-overlay-panel">
            <div className="win-content">
                {visible ? (
                    isWin ? (
                        <>
                            <div className="win-title">WIN</div>
                            <div className="win-amount">${balanceChange.toFixed(2)}</div>
                            <div className="win-multiplier">{multiplier.toFixed(2)}x</div>
                        </>
                    ) : (
                        <div className="loss-x">❌</div>
                    )
                ) : (
                    <>
                        <div className="win-title">&nbsp;</div>
                        <div className="win-amount">$000.00</div>
                        <div className="win-multiplier">0.00x</div>
                    </>
                )}

                <div className="stats-line">
                    <span>🎯 {winPercentage}% chance</span>
                    <span>💥 {predictedMultiplier}x</span>
                </div>
            </div>
        </div>
    );
}
