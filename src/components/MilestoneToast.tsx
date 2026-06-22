"use client";

import { useState } from "react";

interface Milestone {
  id: string;
  emoji: string;
  title: string;
  desc: string;
}

export function MilestoneToast({ milestones, onClose }: { milestones: Milestone[]; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const m = milestones[idx];
  if (!m) return null;

  const next = () => {
    if (idx < milestones.length - 1) setIdx(idx + 1);
    else onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "24px", pointerEvents: "none" }}>
      <div
        className="milestone-toast"
        style={{ background: "var(--g-green-dark)", border: "1px solid rgba(29,158,117,0.4)", borderRadius: "20px", padding: "24px 28px", maxWidth: "380px", width: "100%", pointerEvents: "all", boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(29,158,117,0.1)" }}
      >
        {/* Confetti dots */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, overflow: "hidden", height: "60px", borderRadius: "20px 20px 0 0", pointerEvents: "none" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", width: "6px", height: "6px", borderRadius: "50%", left: `${10 + i * 12}%`, top: "-8px", background: ["#1D9E75","#5DCAA5","#EF9F27","#5B8DD9","#E24B4A"][i % 5], animation: `confettiFall ${0.6 + i * 0.1}s ${i * 0.08}s ease-out both` }} />
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>{m.emoji}</div>
          <p style={{ fontSize: "11px", color: "var(--accent-light)", letterSpacing: "2px", marginBottom: "6px" }}>MEILENSTEIN ERREICHT</p>
          <h3 style={{ fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.3px" }}>{m.title}</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>{m.desc}</p>
          <button onClick={next}
            style={{ width: "100%", padding: "12px", background: "var(--accent)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
            {idx < milestones.length - 1 ? "Weiter →" : "Super! 🎉"}
          </button>
        </div>

        {milestones.length > 1 && (
          <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginTop: "14px" }}>
            {milestones.map((_, i) => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === idx ? "var(--accent)" : "var(--bg-hover)" }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
