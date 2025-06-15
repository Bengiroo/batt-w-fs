import React from "react";
import "./WinOverlay.css";

export default function WinOverlay({ visible, amount, multiplier, gridBounds }) {
    if (!visible || !gridBounds) return null;

    const style = {
        position: "absolute",
        left: gridBounds.width / 2,
        top: gridBounds.height / 2,
        transform: "translate(-100%, -100%)", // pull up and left
        width: gridBounds.width * 0.30,     // smaller
        height: gridBounds.height * 0.28,
    };


    return (
        <div className="win-overlay" style={style}>
            <div className="win-content">
                <div className="win-title">WIN</div>
                <div className="win-amount">${amount.toFixed(2)}</div>
                <div className="win-multiplier">{multiplier.toFixed(2)}x</div>
            </div>
        </div>
    );
}
