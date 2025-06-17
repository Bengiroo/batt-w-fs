import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter"; // 🔁 Use the router instead of App
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter /> {/* 🔁 This handles all routes: / and /dashboard */}
  </React.StrictMode>
);
