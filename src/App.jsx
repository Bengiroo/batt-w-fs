// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
const winSound = new Audio("/win.mp3");
winSound.volume = 0.5;

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandomEnemyTiles(indices, maxTiles = 5, cluster = true) {
  const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(false));
  indices.forEach(i => {
    const r = Math.floor(i / GRID_SIZE);
    const c = i % GRID_SIZE;
    grid[r][c] = true;
  });

  const used = new Set();
  const result = [];
  function tryAdd(block) {
    if (block.every(i => !used.has(i))) {
      block.forEach(i => used.add(i));
      result.push(...block);
    }
  }

  const horizontal = [], vertical = [], pairs = [];
  if (cluster) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c <= GRID_SIZE - 3; c++) {
        const i = r * GRID_SIZE + c;
        const block = [i, i + 1, i + 2];
        if (block.every(idx => indices.includes(idx))) horizontal.push(block);
      }
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r <= GRID_SIZE - 3; r++) {
        const i = r * GRID_SIZE + c;
        const block = [i, i + GRID_SIZE, i + 2 * GRID_SIZE];
        if (block.every(idx => indices.includes(idx))) vertical.push(block);
      }
    }
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c <= GRID_SIZE - 2; c++) {
        const i = r * GRID_SIZE + c;
        const block = [i, i + 1];
        if (block.every(idx => indices.includes(idx))) pairs.push(block);
      }
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r <= GRID_SIZE - 2; r++) {
        const i = r * GRID_SIZE + c;
        const block = [i, i + GRID_SIZE];
        if (block.every(idx => indices.includes(idx))) pairs.push(block);
      }
    }
    shuffle(horizontal).forEach(b => { if (result.length < maxTiles) tryAdd(b); });
    shuffle(vertical).forEach(b => { if (result.length < maxTiles) tryAdd(b); });
    shuffle(pairs).forEach(b => { if (result.length < maxTiles) tryAdd(b); });
  }
  const remaining = shuffle(indices.filter(i => !used.has(i)));
  for (let i = 0; i < remaining.length && result.length < maxTiles; i++) {
    result.push(remaining[i]);
    used.add(remaining[i]);
  }
  return result.slice(0, maxTiles);
}

export default function App() {
  const isPortrait = useOrientation();
  const location = useLocation();
  const initialBalance = 500;

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [validated, setValidated] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [orientation, setOrientation] = useState("horizontal");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [defenseSelected, setDefenseSelected] = useState(Array(100).fill(false));
  const [offenseSelected, setOffenseSelected] = useState(Array(100).fill(false));
  const [enemyShipTiles, setEnemyShipTiles] = useState([]);
  const [hitTiles, setHitTiles] = useState([]);
  const [enemyMissiles, setEnemyMissiles] = useState([]);
  const [enemyHits, setEnemyHits] = useState([]);
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(() => Math.floor(initialBalance / 10));
  const [winAmount, setWinAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [winVisible, setWinVisible] = useState(false);
  const [isLoss, setIsLoss] = useState(false);
  const gridWrapperRef = useRef(null);
  const [gridBounds, setGridBounds] = useState(null);
  const animationRef = useRef(null);
  const pendingBalanceRef = useRef(initialBalance);

  useEffect(() => () => cancelAnimationFrame(animationRef.current), []);
  useEffect(() => { if (token) localStorage.setItem("token", token); }, [token]);
  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:4000/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setValidated(true)).catch(() => {
      localStorage.removeItem("token");
      setToken("");
      setValidated(false);
    });
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
  const selected = mode === "offense" ? offenseSelected : defenseSelected;
  const setSelected = mode === "offense" ? setOffenseSelected : setDefenseSelected;
  const sizeOptions = mode === "offense" ? missileSizeOptions : shipSizeOptions;
  const brushSize = sizeOptions[sizeIdx];
  const selectedCount = selected.filter(Boolean).length;
  const canFire = selectedCount > 0 && selectedCount < 100;
  const winChance = mode === "offense" ? selectedCount / 100 : 1 - selectedCount / 100;
  const predictedMultiplier = winChance > 0 ? +(0.99 / winChance).toFixed(2) : 0;
  const winPercentage = (winChance * 100).toFixed(1);

  const handleReset = () => {
    setSelected(Array(100).fill(false));
    setWinVisible(false);
    setWinAmount(0);
    setMultiplier(0);
    setEnemyShipTiles([]);
    setHitTiles([]);
    setEnemyMissiles([]);
    setEnemyHits([]);
    setIsLoss(false);
  };

  const handleFire = async () => {
    if (!canFire || bet <= 0 || bet > pendingBalanceRef.current) return;
    const targetNumber = selectedCount;
    const gameMode = mode === "offense" ? "under" : "over";
    try {
      const res = await axios.post("http://localhost:4000/dice/roll", {
        mode: gameMode,
        amount: bet,
        targetNumber,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const { win, profit = 0, payoutMultiplier = 0 } = res.data;
      const start = pendingBalanceRef.current;
      const end = +(start + profit).toFixed(2);
      pendingBalanceRef.current = end;
      const startTime = performance.now();
      const duration = 800;
      document.body.classList.add("balance-flash");
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      const animate = currentTime => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        setBalance(+current.toFixed(2));
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          document.body.classList.remove("balance-flash");
        }
      };
      animationRef.current = requestAnimationFrame(animate);

      setWinAmount(profit);
      setMultiplier(payoutMultiplier);
      setWinVisible(true);
      setIsLoss(!win);
      if (win) {
        winSound.pause();
        winSound.currentTime = 0;
        winSound.play();
      }

      const selectedIdx = selected.map((v, i) => v ? i : null).filter(Boolean);
      const unselected = selected.map((v, i) => !v ? i : null).filter(Boolean);
      if (mode === "offense") {
        setHitTiles(win ? [selectedIdx[Math.floor(Math.random() * selectedIdx.length)]] : []);
        setEnemyShipTiles(pickRandomEnemyTiles(unselected, 5, true));
      } else {
        setEnemyMissiles(pickRandomEnemyTiles(unselected, 5, false));
        setEnemyHits(win ? [] : shuffle(selectedIdx).slice(0, Math.min(selectedIdx.length, Math.floor(Math.random() * 5) + 1)));
      }
    } catch (err) {
      console.error("\u274C API Error:", err.response?.data || err.message);
    }
  };

  const handleAnchor = () => alert("Anchor set!");
  if (!token || !validated) return <LoginScreen onLogin={setToken} />;
  if (!selectedMode) return <ModeSelectScreen isPortrait={isPortrait} onSelectMode={setSelectedMode} />;

  return (
    <div className="app-wrapper">
      {location.pathname !== "/dashboard" && (
        <Link to="/dashboard" style={floatingLinkStyle}>Dashboard</Link>
      )}
      {location.pathname === "/dashboard" && (
        <Link to="/" style={{ ...floatingLinkStyle, backgroundColor: "#1a1a1a" }}>🔙 Back to Game</Link>
      )}

      <div ref={gridWrapperRef} className="grid-wrapper" style={{ position: "relative", flex: "1 1 auto" }}>
        <div style={{ display: "none" }}>
          <FulfillmentSlider value={selectedCount} total={100} mode={mode} />
        </div>
        <TileGrid visible={mode === "defense"} mode="defense" brushSize={brushSize} orientation={orientation} selected={defenseSelected} setSelected={setDefenseSelected} imgSrc="/5.png" enemyMissiles={enemyMissiles} enemyHits={enemyHits} win={winVisible && !isLoss} />
        <TileGrid visible={mode === "offense"} mode="offense" brushSize={brushSize} orientation={orientation} selected={offenseSelected} setSelected={setOffenseSelected} imgSrc="/6.png" enemyTiles={enemyShipTiles} hitTiles={hitTiles} win={winVisible && !isLoss} />
      </div>

      <div className="panel-wrapper">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <WinOverlay
            visible={winVisible}
            balanceChange={winAmount}
            multiplier={multiplier}
            isLoss={isLoss}
            winPercentage={winPercentage}
            predictedMultiplier={predictedMultiplier}
          />
        </div>

        <div className="rotate-size-row">
          <div className="size-slider-container">
            <SizeSlider sizeOptions={sizeOptions} value={sizeIdx} setValue={setSizeIdx} isOffense={mode === "offense"} />
          </div>
          <button
            onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
            className="rotate-button"
            title="Rotate"
          >
            <span className="rotate-icon" />
            <span className="rotate-arrow">{orientation === "horizontal" ? "↔" : "↕"}</span>
          </button>
        </div>

        <PanelControls
          onReset={handleReset}
          onFire={handleFire}
          onAnchor={handleAnchor}
          onModeToggle={() => setSelectedMode(mode === "offense" ? "defense" : "offense")}
          balance={balance}
          bet={bet}
          setBet={setBet}
          mode={mode}
          isPortrait={isPortrait}
          canFire={canFire}
          winPercentage={winPercentage}
          predictedMultiplier={predictedMultiplier}
        />
      </div>
    </div>
  );
}

const floatingLinkStyle = {
  position: "fixed",
  top: 12,
  right: 12,
  padding: "10px 16px",
  backgroundColor: "#0b1e3c",
  color: "#00ffff",
  fontWeight: "bold",
  fontSize: "14px",
  borderRadius: "8px",
  border: "2px solid #00ffff",
  textDecoration: "none",
  boxShadow: "0 0 12px #00ffff, inset 0 0 4px #00ffff",
  zIndex: 9999,
};
