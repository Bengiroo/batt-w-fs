// --- TileGrid.jsx (Persistent Hits) ---

import React, { useState, useRef, useEffect } from "react";

const GRID_SIZE = 10;

function getBrushIndices(centerRow, centerCol, width, height, orientation) {
  let w = width, h = height;
  if (orientation === "vertical") [w, h] = [h, w];
  const indices = [];
  const startRow = centerRow - Math.floor(h / 2);
  const startCol = centerCol - Math.floor(w / 2);
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const row = startRow + r;
      const col = startCol + c;
      if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        indices.push(row * GRID_SIZE + col);
      }
    }
  }
  return indices;
}

export default function TileGrid({
  visible,
  mode,
  brushSize,
  orientation,
  selected,
  setSelected,
  imgSrc,
  enemyTiles = [],
  hitTiles = [],
  enemyMissiles = [],
  enemyHits = [],
  win = false
}) {
  const [hoveredIndices, setHoveredIndices] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const gridRef = useRef();
  const [size, setSize] = useState(300);

  useEffect(() => {
    function updateSize() {
      const margin = 24;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w > h) {
        setSize(Math.min(h - 220, w * 0.48 - margin));
      } else {
        setSize(Math.min(w - margin, h * 0.45));
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!visible) return null;

  const cellSize = size / GRID_SIZE;

  const handleMouseOver = (row, col) => {
    setHoveredIndices(getBrushIndices(row, col, brushSize.width, brushSize.height, orientation));
    if (isMouseDown) handlePaint(row, col);
  };

  const handleMouseOut = () => setHoveredIndices([]);
  const handleMouseDown = (row, col) => {
    setIsMouseDown(true);
    handlePaint(row, col);
  };
  const handleMouseUp = () => setIsMouseDown(false);

  const handlePaint = (row, col) => {
    const indices = getBrushIndices(row, col, brushSize.width, brushSize.height, orientation);
    setSelected((prev) => {
      const next = [...prev];
      indices.forEach((idx) => (next[idx] = true));
      return next;
    });
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      handlePaint(row, col);
      setHoveredIndices(getBrushIndices(row, col, brushSize.width, brushSize.height, orientation));
    }
  };

  return (
    <div
      ref={gridRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        gap: 2,
        background: "#000",
        borderRadius: 10,
        touchAction: "none",
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        zIndex: 2,
        width: "min(100vw, 100vh)",
        height: "min(100vw, 100vh)",
        boxShadow: "0 0 15px rgba(0,255,255,0.05)",
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        const isHovered = hoveredIndices.includes(i);
        const isSelected = selected[i];
        const isHit = hitTiles.includes(i);
        const isEnemyTile = enemyTiles.includes(i);
        const isMissile = enemyMissiles.includes(i);
        const isEnemyHit = enemyHits.includes(i);

        const baseColor = mode === "offense" ? "#1c0b0b" : "#0b1c1f";
        const hoverColor = mode === "offense" ? "#ff5560" : "#33bbff";
        const activeColor = mode === "offense" ? "#ff1a40" : "#00ccff";

        const tileColor = isSelected
          ? activeColor
          : isHovered
            ? hoverColor
            : baseColor;

        const show1 = mode === "offense" && isSelected && isHit;
        const show2 = mode === "offense" && !isSelected && isEnemyTile;
        const show3 = mode === "defense" && !isSelected && isMissile;
        const show4 = mode === "defense" && !win && isSelected && isEnemyHit;

        return (
          <div
            key={i}
            style={{
              background: tileColor,
              border: `1px solid ${isSelected ? "#fff6" : "#00ffcc33"}`,
              borderRadius: 4,
              position: "relative",
              cursor: "pointer",
              transition: "background 0.1s",
              boxShadow: isSelected ? `0 0 6px ${activeColor}` : "none",
            }}
            onMouseOver={() => handleMouseOver(row, col)}
            onMouseOut={handleMouseOut}
            onMouseDown={() => handleMouseDown(row, col)}
          >
            {show1 && (
              <img src="/1.png" alt="hit" style={imgStyle("lime")} draggable={false} />
            )}
            {show4 && (
              <img src="/4.png" alt="sink" style={imgStyle("red")} draggable={false} />
            )}
            {show3 && (
              <img src="/3.png" alt="missile" style={imgStyle("orange", 0.95)} draggable={false} />
            )}
            {show2 && (
              <img src="/2.png" alt="enemy" style={imgStyle("red", 0.9)} draggable={false} />
            )}
            {!show1 && !show2 && !show3 && !show4 && (isHovered || isSelected) && (
              <img
                src={imgSrc}
                alt=""
                style={imgStyle("rgba(0,255,255,0.3)", isSelected ? 1 : 0.7)}
                draggable={false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function imgStyle(glowColor, opacity = 1) {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    opacity,
    filter: `drop-shadow(0 0 6px ${glowColor})`,
  };
}
