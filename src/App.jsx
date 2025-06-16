// All imports remain the same...
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import { shipSizeOptions, missileSizeOptions } from "./sizeOptions";
import useOrientation from "./components/useOrientation";
import ModeSelectScreen from "./components/ModeSelectScreen";
import SizeSlider from "./components/SizeSlider";
import TileGrid from "./components/TileGrid";
import FulfillmentSlider from "./components/FulfillmentSlider";
import PanelControls from "./components/PanelControls";
import LoginScreen from "./components/LoginScreen";
import WinOverlay from "./components/WinOverlay";

const GRID_SIZE = 10;

export default function App() {
  const isPortrait = useOrientation();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [validated, setValidated] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [orientation, setOrientation] = useState("horizontal");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [defenseSelected, setDefenseSelected] = useState(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [offenseSelected, setOffenseSelected] = useState(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [balance, setBalance] = useState(500);
  const [bet, setBet] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [winVisible, setWinVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const gridWrapperRef = useRef(null);
  const [gridBounds, setGridBounds] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;
      try {
        await axios.get("http://localhost:4000/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setValidated(true);
      } catch {
        localStorage.removeItem("token");
        setToken("");
        setValidated(false);
      }
    };
    validateToken();
  }, [token]);

  useEffect(() => {
    setTimeout(() => {
      if (gridWrapperRef.current) {
        const bounds = gridWrapperRef.current.getBoundingClientRect();
        setGridBounds(bounds);
      }
    }, 100);
  }, [orientation, selectedMode]);

  const mode = selectedMode;
  const sizeOptions = mode === "offense" ? missileSizeOptions : shipSizeOptions;
  const brushSize = sizeOptions[sizeIdx];
  const selected = mode === "offense" ? offenseSelected : defenseSelected;
  const setSelected = mode === "offense" ? setOffenseSelected : setDefenseSelected;
  const selectedCount = selected.filter(Boolean).length;
  const canFire = selectedCount > 0 && selectedCount < GRID_SIZE * GRID_SIZE;

  const winChance = mode === "offense" ? selectedCount / 100 : 1 - selectedCount / 100;
  const predictedMultiplier = winChance > 0 ? +(0.99 / winChance).toFixed(2) : 0;
  const winPercentage = (winChance * 100).toFixed(1);

  const handleReset = () => {
    setSelected(Array(GRID_SIZE * GRID_SIZE).fill(false));
    setWinVisible(false);
    setWinAmount(0);
    setMultiplier(0);
    setIsFading(false);
  };

  const handleFire = async () => {
    if (!canFire || bet <= 0 || bet > balance) return;

    const targetNumber = selectedCount;
    const gameMode = mode === "defense" ? "over" : "under";
    const payload = { mode: gameMode, amount: bet, targetNumber };

    try {
      const res = await axios.post("http://localhost:4000/dice/roll", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { winAmount: result = 0, multiplier: multi = 0 } = res.data;
      setBalance((b) => b - bet + result);
      setWinAmount(result);
      setMultiplier(multi);
      setWinVisible(true);
      setIsFading(false);

      setTimeout(() => setIsFading(true), 3000);
      setTimeout(() => setWinVisible(false), 5000);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };

  const handleAnchor = () => alert("Anchor set!");

  if (!token || !validated) return <LoginScreen onLogin={setToken} />;
  if (!selectedMode) return <ModeSelectScreen isPortrait={isPortrait} onSelectMode={setSelectedMode} />;

  return (
    <div className="app-wrapper">
      <div ref={gridWrapperRef} className="grid-wrapper" style={{ position: "relative", flex: "1 1 auto", justifyContent: "center" }}>
        <div className="fulfillment-slider-wrapper">
          <FulfillmentSlider value={selectedCount} total={GRID_SIZE * GRID_SIZE} mode={mode} />
        </div>
        <TileGrid visible={mode === "defense"} mode="defense" brushSize={brushSize} orientation={orientation} selected={defenseSelected} setSelected={mode === "defense" ? setDefenseSelected : () => { }} imgSrc="/ship.png" />
        <TileGrid visible={mode === "offense"} mode="offense" brushSize={brushSize} orientation={orientation} selected={offenseSelected} setSelected={mode === "offense" ? setOffenseSelected : () => { }} imgSrc="/missile.png" />
        {winVisible && gridBounds && (
          <WinOverlay visible={true} amount={winAmount} multiplier={multiplier} gridBounds={gridBounds} fading={isFading} />
        )}
      </div>
      <div className="panel-wrapper">
        <SizeSlider sizeOptions={sizeOptions} value={sizeIdx} setValue={setSizeIdx} isOffense={mode === "offense"} />
        <button style={{ marginBottom: 12, padding: "7px 14px", fontSize: 15, background: "#ffd600", border: "1px solid #bbb", borderRadius: 7, cursor: "pointer", fontWeight: 600, width: 120, alignSelf: "center" }} onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}>
          Rotate: {orientation === "horizontal" ? "↔" : "↕"}
        </button>
        <div style={{
          background: "#001122",
          border: "2px solid cyan",
          borderRadius: 10,
          padding: "10px 14px",
          color: "#0ff",
          fontFamily: "monospace",
          fontSize: 14,
          marginBottom: 12,
          textAlign: "center",
          boxShadow: "0 0 8px #0ff",
        }}>
          <div>🎯 <strong>Chance to Win:</strong> {winPercentage}%</div>
          <div>💥 <strong>Multiplier:</strong> {predictedMultiplier}x</div>
        </div>
        <PanelControls onReset={handleReset} onFire={handleFire} onAnchor={handleAnchor} balance={balance} bet={bet} setBet={setBet} mode={mode} isPortrait={isPortrait} canFire={canFire} />
      </div>
    </div>
  );
}
