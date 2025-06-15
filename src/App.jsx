import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;

      try {
        await axios.get("http://localhost:4000/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setValidated(true);
      } catch (err) {
        console.warn("Server unreachable or invalid token. Logging out.");
        localStorage.removeItem("token");
        setToken("");
        setValidated(false);
      }
    };

    validateToken();
  }, [token]);

  if (!token || !validated) {
    return <LoginScreen onLogin={setToken} />;
  }

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
  const totalTiles = GRID_SIZE * GRID_SIZE;

  const handleReset = () => {
    console.log("🧼 Resetting grid selection");
    setSelected(Array(GRID_SIZE * GRID_SIZE).fill(false));
  };

  const handleFire = async () => {
    if (selectedCount <= 0 || selectedCount >= totalTiles) return;

    if (bet > 0 && bet <= balance) {
      const targetNumber = selectedCount;
      const gameMode = mode === "defense" ? "over" : "under";

      const payload = {
        mode: gameMode,
        amount: bet,
        targetNumber,
      };

      console.log("📡 Sending to API:", payload);

      try {
        const res = await axios.post("http://localhost:4000/dice/roll", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBalance((b) => b - bet);
        console.log("✅ API response:", res.data);
      } catch (err) {
        console.error("❌ API error:", err.response?.data || err.message);
      }
    } else {
      console.warn("⚠️ Invalid bet amount");
    }
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
          setSelected={mode === "defense" ? setDefenseSelected : () => { }}
          imgSrc="/ship.png"
        />
        <TileGrid
          visible={mode === "offense"}
          mode="offense"
          brushSize={brushSize}
          orientation={orientation}
          selected={offenseSelected}
          setSelected={mode === "offense" ? setOffenseSelected : () => { }}
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
          onClick={() =>
            setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")
          }
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
          canFire={selectedCount > 0 && selectedCount < totalTiles}
        />
      </div>
    </div>
  );
}
