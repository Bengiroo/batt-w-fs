import React, { useState } from "react";
import "./App.css";
import { shipSizeOptions, missileSizeOptions } from "./sizeOptions";
import useOrientation from "./components/useOrientation";
import ModeSelectScreen from "./components/ModeSelectScreen";
import SizeSlider from "./components/SizeSlider";
import TileGrid from "./components/TileGrid";
import FulfillmentSlider from "./components/FulfillmentSlider";
import PanelControls from "./components/PanelControls";

const GRID_SIZE = 10;

export default function App() {
  const isPortrait = useOrientation();
  const [selectedMode, setSelectedMode] = useState(null);
  const [orientation, setOrientation] = useState("horizontal");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [defenseSelected, setDefenseSelected] = useState(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [offenseSelected, setOffenseSelected] = useState(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [balance, setBalance] = useState(500);
  const [bet, setBet] = useState(0);

  if (!selectedMode) {
    return (
      <ModeSelectScreen
        isPortrait={isPortrait}
        onSelectMode={setSelectedMode}
      />
    );
  }

  const mode = selectedMode;
  const sizeOptions = mode === "offense" ? missileSizeOptions : shipSizeOptions;
  const brushSize = sizeOptions[sizeIdx];
  const selected = mode === "offense" ? offenseSelected : defenseSelected;
  const setSelected = mode === "offense" ? setOffenseSelected : setDefenseSelected;
  const selectedCount = selected.filter(Boolean).length;

  const handleReset = () => setSelected(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const handleFire = () => {
    if (bet > 0 && bet <= balance) setBalance(balance - bet);
  };
  const handleAnchor = () => {
    alert("Anchor set!");
  };

  return (
    <div className="app-wrapper">
      <div className="grid-wrapper" style={{ position: "relative", flex: "1 1 auto", justifyContent: "center" }}>
        <div className="fulfillment-slider-wrapper">
          <FulfillmentSlider
            value={selectedCount}
            total={GRID_SIZE * GRID_SIZE}
            mode={mode}
          />
        </div>
        <TileGrid
          visible={mode === "defense"}
          mode="defense"
          brushSize={brushSize}
          orientation={orientation}
          selected={defenseSelected}
          setSelected={mode === "defense" ? setDefenseSelected : () => {}}
          imgSrc="/ship.png"
        />
        <TileGrid
          visible={mode === "offense"}
          mode="offense"
          brushSize={brushSize}
          orientation={orientation}
          selected={offenseSelected}
          setSelected={mode === "offense" ? setOffenseSelected : () => {}}
          imgSrc="/missile.png"
        />
      </div>
      <div className="panel-wrapper">
        <SizeSlider
          sizeOptions={sizeOptions}
          value={sizeIdx}
          setValue={setSizeIdx}
          isOffense={mode === "offense"}
        />
        <button
          style={{
            marginBottom: 12,
            padding: "7px 14px",
            fontSize: 15,
            background: "#ffd600",
            border: "1px solid #bbb",
            borderRadius: 7,
            cursor: "pointer",
            fontWeight: 600,
            width: 120,
            alignSelf: "center",
          }}
          onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
        >
          Rotate: {orientation === "horizontal" ? "↔" : "↕"}
        </button>
        <PanelControls
          onReset={handleReset}
          onFire={handleFire}
          onAnchor={handleAnchor}
          balance={balance}
          bet={bet}
          setBet={setBet}
          mode={mode}
          isPortrait={isPortrait}
        />
      </div>
    </div>
  );
}