import React from "react";

export default function ModeSelectScreen({ isPortrait, onSelectMode }) {
  const imgSrc = isPortrait ? "/modeselect.png" : "/modeselectlandscape.png";
  return (
    <div className="mode-select-bg">
      <img
        src={imgSrc}
        alt="Mode Select"
        className="mode-select-img"
        draggable={false}
      />
      <div className="mode-select-buttons">
        <button
          className="mode-select-btn offense"
          onClick={() => onSelectMode("offense")}
        >
          Offense
        </button>
        <button
          className="mode-select-btn defense"
          onClick={() => onSelectMode("defense")}
        >
          Defense
        </button>
      </div>
    </div>
  );
}