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

// Randomly shuffle array in-place
function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Try to find random lines (horizontal or vertical, length 2 or 3), then fill singles if needed.
 * Result is up to maxTiles indices from allowedIndices, as grouped as possible, randomly placed.
 */
function pickRandomLineBlocks(allowedIndices, maxTiles = 5) {
  allowedIndices = shuffle(allowedIndices);

  const used = new Set();
  const found = [];

  const grid = Array(GRID_SIZE)
    .fill(0)
    .map(() => Array(GRID_SIZE).fill(false));
  allowedIndices.forEach(i => {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    grid[row][col] = true;
  });

  // Helper to record a block and mark as used
  function addBlock(indices) {
    for (let idx of indices) used.add(idx);
    found.push(...indices);
  }

  // Try to find horizontal lines of 3
  let lines = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col <= GRID_SIZE - 3; col++) {
      const idxs = [row * GRID_SIZE + col, row * GRID_SIZE + col + 1, row * GRID_SIZE + col + 2];
      if (idxs.every(i => grid[Math.floor(i / GRID_SIZE)][i % GRID_SIZE] && !used.has(i))) {
        lines.push(idxs);
      }
    }
  }
  lines = shuffle(lines);
  for (let block of lines) {
    if (found.length + 3 > maxTiles) break;
    addBlock(block);
  }

  // Try to find vertical lines of 3
  lines = [];
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row <= GRID_SIZE - 3; row++) {
      const idxs = [row * GRID_SIZE + col, (row + 1) * GRID_SIZE + col, (row + 2) * GRID_SIZE + col];
      if (idxs.every(i => grid[Math.floor(i / GRID_SIZE)][i % GRID_SIZE] && !used.has(i))) {
        lines.push(idxs);
      }
    }
  }
  lines = shuffle(lines);
  for (let block of lines) {
    if (found.length + 3 > maxTiles) break;
    addBlock(block);
  }

  // Try to find horizontal lines of 2
  lines = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col <= GRID_SIZE - 2; col++) {
      const idxs = [row * GRID_SIZE + col, row * GRID_SIZE + col + 1];
      if (idxs.every(i => grid[Math.floor(i / GRID_SIZE)][i % GRID_SIZE] && !used.has(i))) {
        lines.push(idxs);
      }
    }
  }
  lines = shuffle(lines);
  for (let block of lines) {
    if (found.length + 2 > maxTiles) break;
    addBlock(block);
  }

  // Try to find vertical lines of 2
  lines = [];
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row <= GRID_SIZE - 2; row++) {
      const idxs = [row * GRID_SIZE + col, (row + 1) * GRID_SIZE + col];
      if (idxs.every(i => grid[Math.floor(i / GRID_SIZE)][i % GRID_SIZE] && !used.has(i))) {
        lines.push(idxs);
      }
    }
  }
  lines = shuffle(lines);
  for (let block of lines) {
    if (found.length + 2 > maxTiles) break;
    addBlock(block);
  }

  // Fill singles if needed
  const singles = shuffle(allowedIndices.filter(i => !used.has(i)));
  for (let i = 0; i < singles.length && found.length < maxTiles; ++i) {
    used.add(singles[i]);
    found.push(singles[i]);
  }

  return found.slice(0, maxTiles);
}

export default function App() {
  const isPortrait = useOrientation();
  const initialBalance = 500;
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
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(() => Math.floor(initialBalance / 10));
  const [winAmount, setWinAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [winVisible, setWinVisible] = useState(false);
  const [isLoss, setIsLoss] = useState(false);
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
    setEnemyShipTiles([]);
    setHitTiles([]);
    setEnemyMissiles([]);
    setEnemyHits([]);
    setIsLoss(false);
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
      setWinVisible(true);
      setIsLoss(!win);

      if (mode === "offense") {
        const selectedIndices = offenseSelected.map((v, i) => v ? i : null).filter(i => i !== null);
        const unselectedIndices = offenseSelected.map((v, i) => !v ? i : null).filter(i => i !== null);

        if (win) {
          // 1.png in one selected space
          let hitTiles = [];
          if (selectedIndices.length > 0) {
            hitTiles = [selectedIndices[Math.floor(Math.random() * selectedIndices.length)]];
          }
          setHitTiles(hitTiles);

          // 2.png in up to 5 unselected spaces, grouped randomly in lines if possible
          let enemyShipTiles = [];
          if (selectedCount === GRID_SIZE * GRID_SIZE - 1) {
            enemyShipTiles = unselectedIndices.slice(0, 1);
          } else if (unselectedIndices.length > 0) {
            enemyShipTiles = pickRandomLineBlocks(unselectedIndices, Math.min(5, unselectedIndices.length));
          }
          setEnemyShipTiles(enemyShipTiles);
        } else {
          // Loss: 1.png never, 2.png in up to 5 unselected spaces, grouped randomly
          setHitTiles([]);
          let enemyShipTiles = [];
          if (unselectedIndices.length > 0) {
            enemyShipTiles = pickRandomLineBlocks(unselectedIndices, Math.min(5, unselectedIndices.length));
          }
          setEnemyShipTiles(enemyShipTiles);
        }
      } else if (mode === "defense") {
        const selectedIndices = defenseSelected.map((v, i) => v ? i : null).filter(i => i !== null);
        const unselectedIndices = defenseSelected.map((v, i) => !v ? i : null).filter(i => i !== null);

        if (win) {
          // 4.png never, 3.png in up to 5 unselected, grouped randomly
          let enemyMissiles = [];
          if (unselectedIndices.length > 0) {
            enemyMissiles = pickRandomLineBlocks(unselectedIndices, Math.min(5, unselectedIndices.length));
          }
          setEnemyMissiles(enemyMissiles);
          setEnemyHits([]);
        } else {
          // 4.png in 1–5 selected, 3.png in up to 5 unselected, grouped randomly
          let enemyHits = [];
          if (selectedIndices.length > 0) {
            const hitCount = Math.min(Math.max(1, Math.floor(Math.random() * 5) + 1), selectedIndices.length);
            enemyHits = shuffle(selectedIndices).slice(0, hitCount);
          }
          setEnemyHits(enemyHits);

          let enemyMissiles = [];
          if (unselectedIndices.length > 0) {
            enemyMissiles = pickRandomLineBlocks(unselectedIndices, Math.min(5, unselectedIndices.length));
          }
          setEnemyMissiles(enemyMissiles);
        }
      }
      // No auto-fade, no auto-hide
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
          win={winVisible && !isLoss}
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
          win={winVisible && !isLoss}
        />

        {gridBounds && (
          <WinOverlay
            visible={winVisible}
            balanceChange={winAmount}
            multiplier={multiplier}
            gridBounds={gridBounds}
            isLoss={isLoss}
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