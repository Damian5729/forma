"use client";

import { useEffect, useState } from "react";

const LIGHT_CSS = `
  :root {
    --bg-primary: #f5f5f3 !important;
    --bg-surface: #ececea !important;
    --bg-card: #ffffff !important;
    --bg-hover: #e8e8e5 !important;
    --border: rgba(0,0,0,0.09) !important;
    --border-hover: rgba(0,0,0,0.16) !important;
    --text-primary: #0d0d0c !important;
    --text-secondary: #555550 !important;
    --text-muted: #9a9a90 !important;
    --accent: #1D9E75 !important;
    --accent-light: #157a5a !important;
    --accent-bg: #e6f4ef !important;
    --card-protein: linear-gradient(135deg,#e8f5ef,#f5f5f3) !important;
    --card-lowcarb: linear-gradient(135deg,#fff5ea,#f5f5f3) !important;
    --card-vegan: linear-gradient(135deg,#e8f5e8,#f5f5f3) !important;
    --card-omega: linear-gradient(135deg,#e8f0f5,#f5f5f3) !important;
    --card-breakfast: linear-gradient(135deg,#f0e8f5,#f5f5f3) !important;
    --overlay-xs: rgba(0,0,0,0.03) !important;
    --overlay-sm: rgba(0,0,0,0.04) !important;
    --overlay-md: rgba(0,0,0,0.06) !important;
    --overlay-lg: rgba(0,0,0,0.09) !important;
    --g-green-dark: linear-gradient(135deg,#d4ede0,#ffffff) !important;
    --g-green-main: linear-gradient(135deg,#e0f0e8,#ffffff) !important;
    --g-forest: linear-gradient(135deg,#d4ecd4,#ffffff) !important;
    --g-red: linear-gradient(135deg,#f5d4d4,#ffffff) !important;
    --g-red-soft: rgba(240,210,210,0.5) !important;
    --g-purple: linear-gradient(135deg,#e0d4f5,#ffffff) !important;
    --g-blue-soft: linear-gradient(135deg,#d4e5f5,#ffffff) !important;
    --g-blue-deep: linear-gradient(135deg,#d4e0f5,#ffffff) !important;
  }
  body {
    background-color: #f5f5f3 !important;
    color: #0d0d0c !important;
  }
`;

function applyTheme(light: boolean) {
  let el = document.getElementById("forma-theme") as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "forma-theme";
    document.head.appendChild(el);
  }
  el.textContent = light ? LIGHT_CSS : "";
}

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      applyTheme(true);
      setLight(true);
    }
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    applyTheme(next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      title={light ? "Dark Mode" : "Light Mode"}
      style={{
        width: "32px", height: "32px",
        borderRadius: "8px",
        background: light ? "#e8e8e5" : "#1a1a1f",
        border: light ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.1)",
        fontSize: "16px",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.2s, border 0.2s",
      }}
    >
      {light ? "🌙" : "☀️"}
    </button>
  );
}
