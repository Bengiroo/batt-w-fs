import React, { useState, useRef } from "react";

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
  imgSrc
}) {
  const [hoveredIndices, setHoveredIndices] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const gridRef = useRef();

  // Responsive sizing
  const [size, setSize] = useState(300);
  React.useEffect(() => {
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
    setSelected(prev => {
      const next = [...prev];
      indices.forEach(idx => next[idx] = true);
      return next;
    });
  };

  const handleMouseMove = e => {
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
        marginTop: 0,
        zIndex: 2,

        width: 'min(100vw, 100vh)',
        height: 'min(100vw, 100vh)',
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
        const baseColor = mode === "offense" ? "#f44336" : "#2196f3";
        const illumColor = mode === "offense" ? "#ff7961" : "#64b5f6";
        const tileColor = isSelected
          ? illumColor
          : isHovered
            ? "#fff5"
            : baseColor;
        const showPng = isHovered || isSelected;
        return (
          <div
            key={i}
            style={{

              background: tileColor,
              border: "1px solid #fff6",
              borderRadius: 5,
              position: "relative",
              cursor: "pointer",
              transition: "background 0.12s"
            }}
            onMouseOver={() => handleMouseOver(row, col)}
            onMouseOut={handleMouseOut}
            onMouseDown={() => handleMouseDown(row, col)}
          >
            {showPng &&
              <img
                src={imgSrc}
                alt=""
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  opacity: isSelected ? 1 : 0.7,
                  userSelect: "none"
                }}
                draggable={false}
              />
            }
          </div>
        );
      })}
    </div>
  );
}