"use client";

import { useState } from "react";

interface ActivityRingProps {
  burned: number;
  burnGoal: number;
  steps?: number;
  stepsGoal?: number;
  size?: number;
  onAddActivity?: () => void;
}

export function ActivityRing({ burned, burnGoal, steps = 0, stepsGoal = 10000, size = 130, onAddActivity }: ActivityRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = Math.round(size * 0.105);
  const gap = 5;

  const r1 = cx - strokeW / 2 - 2;
  const r2 = r1 - strokeW - gap;

  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;

  const p1 = Math.min(burned / burnGoal, 1.02);
  const p2 = Math.min(steps / stepsGoal, 1.02);

  const offset1 = c1 * (1 - p1);
  const offset2 = c2 * (1 - p2);

  const pctBurn = Math.round((burned / burnGoal) * 100);
  const pctSteps = Math.round((steps / stepsGoal) * 100);

  return (
    <div>
      {/* Ring + legend row */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        {/* SVG Ring */}
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <defs>
              <linearGradient id="ag-burn" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#FF3B30" />
              </linearGradient>
              <linearGradient id="ag-steps" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5AC8FA" />
                <stop offset="100%" stopColor="#007AFF" />
              </linearGradient>
            </defs>
            {/* Burn track */}
            <circle cx={cx} cy={cy} r={r1} fill="none" stroke="rgba(255,59,48,0.12)" strokeWidth={strokeW} />
            {/* Burn progress */}
            <circle cx={cx} cy={cy} r={r1} fill="none" stroke="url(#ag-burn)" strokeWidth={strokeW}
              strokeDasharray={c1} strokeDashoffset={offset1} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)", filter: burned > 0 ? "drop-shadow(0 0 4px rgba(255,59,48,0.5))" : "none" }} />
            {/* Steps track */}
            <circle cx={cx} cy={cy} r={r2} fill="none" stroke="rgba(90,200,250,0.12)" strokeWidth={strokeW} />
            {/* Steps progress */}
            <circle cx={cx} cy={cy} r={r2} fill="none" stroke="url(#ag-steps)" strokeWidth={strokeW}
              strokeDasharray={c2} strokeDashoffset={offset2} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)", filter: steps > 0 ? "drop-shadow(0 0 3px rgba(90,200,250,0.5))" : "none" }} />
          </svg>
          {/* Center */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: Math.round(size * 0.155), fontWeight: 600, color: "#FF6B6B", lineHeight: 1, letterSpacing: "-1px" }}>{burned}</span>
            <span style={{ fontSize: Math.round(size * 0.085), color: "var(--text-muted)", marginTop: "1px" }}>kcal</span>
          </div>
        </div>

        {/* Stats + button */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "12px" }}>AKTIVITÄT HEUTE</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#FF6B6B", display: "flex", alignItems: "center", gap: "5px" }}>
                  🔴 Kalorien
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{burned} / {burnGoal}</span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,59,48,0.15)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(pctBurn, 100)}%`, background: "linear-gradient(90deg,#FF6B6B,#FF3B30)", borderRadius: "99px", transition: "width 1s ease" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#5AC8FA", display: "flex", alignItems: "center", gap: "5px" }}>
                  🔵 Schritte
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{steps.toLocaleString("de-DE")} / {stepsGoal.toLocaleString("de-DE")}</span>
              </div>
              <div style={{ height: "4px", background: "rgba(90,200,250,0.15)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(pctSteps, 100)}%`, background: "linear-gradient(90deg,#5AC8FA,#007AFF)", borderRadius: "99px", transition: "width 1.2s ease" }} />
              </div>
            </div>
          </div>

          <button onClick={onAddActivity}
            style={{ width: "100%", padding: "9px 0", background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.2)", borderRadius: "10px", color: "#FF6B6B", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
            + Aktivität hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}
