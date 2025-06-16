// --- App.jsx ---
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

function getRandomIndices(exclude = [], count = 1) {
  const all = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i).filter(i => !exclude.includes(i));
  const shuffled = all.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function App() {
  const isPortrait = useOrientation();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [validated, setValidated] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [orientation, setOrientation] = useState("horizontal");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [defenseSelected, setDefenseSelected] = useState(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [offenseSelected, setOffenseSelected] = useState(Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [enemyShipTiles, setEnemyShipTiles] = useState([]);
  const [hitTiles, setHitTiles] = useState([]);
  const [enemyMissiles, setEnemyMissiles] = useState([]);
  const [enemyHits, setEnemyHits] = useState([]);
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
    setEnemyShipTiles([]);
    setHitTiles([]);
    setEnemyMissiles([]);
    setEnemyHits([]);
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

      const { win, profit = 0, payoutMultiplier = 0 } = res.data;

      setBalance((b) => +(b + profit).toFixed(2));
      setWinAmount(profit);
      setMultiplier(payoutMultiplier);
      setWinVisible(win);
      setIsFading(false);

      if (mode === "offense") {
        if (!win) {
          setEnemyShipTiles(getRandomIndices(offenseSelected, 7));
          setHitTiles([]);
        } else {
          const hits = getRandomIndices(offenseSelected, 2);
          setHitTiles(hits);
          setEnemyShipTiles((prev) => prev.filter((i) => !hits.includes(i)));
        }
      } else if (mode === "defense") {
        if (!win) {
          const missiles = getRandomIndices([], Math.floor(Math.random() * 2) + 2);
          setEnemyMissiles(missiles);
          setEnemyHits(missiles.filter((i) => defenseSelected[i]));
        } else {
          setEnemyMissiles(getRandomIndices(defenseSelected, 2));
          setEnemyHits([]);
        }
      }

      setTimeout(() => setIsFading(true), 5000);
      setTimeout(() => setWinVisible(false), 8000);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };

  const handleAnchor = () => alert("Anchor set!");

  if (!token || !validated) return <LoginScreen onLogin={setToken} />;
  if (!selectedMode) return <ModeSelectScreen isPortrait={isPortrait} onSelectMode={setSelectedMode} />;

  return (
    <div className="app-wrapper">
      <div ref={gridWrapperRef} className="grid-wrapper" style={{ position: "relative", flex: "1 1 auto" }}>
        <div style={{ display: "none" }}>
          <FulfillmentSlider value={selectedCount} total={GRID_SIZE * GRID_SIZE} mode={mode} />
        </div>

        <TileGrid
          visible={mode === "defense"}
          mode="defense"
          brushSize={brushSize}
          orientation={orientation}
          selected={defenseSelected}
          setSelected={setDefenseSelected}
          imgSrc="/5.png"
          enemyMissiles={enemyMissiles}
          enemyHits={enemyHits}
          win={winVisible}
        />
        <TileGrid
          visible={mode === "offense"}
          mode="offense"
          brushSize={brushSize}
          orientation={orientation}
          selected={offenseSelected}
          setSelected={setOffenseSelected}
          imgSrc="/6.png"
          enemyTiles={enemyShipTiles}
          hitTiles={hitTiles}
          win={winVisible}
        />

        {winVisible && gridBounds && (
          <WinOverlay
            visible={true}
            balanceChange={winAmount}
            multiplier={multiplier}
            gridBounds={gridBounds}
            fading={isFading}
          />
        )}
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

        <div
          style={{
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
          }}
        >
          <div>🎯 <strong>Chance to Win:</strong> {winPercentage}%</div>
          <div>💥 <strong>Multiplier:</strong> {predictedMultiplier}x</div>
        </div>

        <PanelControls
          onReset={handleReset}
          onFire={handleFire}
          onAnchor={handleAnchor}
          balance={balance}
          bet={bet}
          setBet={setBet}
          mode={mode}
          isPortrait={isPortrait}
          canFire={canFire}
        />
      </div>
    </div>
  );
}
