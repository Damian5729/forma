"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userId: string;
  initialGlasses: number;
  goal?: number;
}

export function WaterTracker({ userId, initialGlasses, goal = 8 }: Props) {
  const [glasses, setGlasses] = useState(initialGlasses);
  const [saving, setSaving] = useState(false);

  const update = async (val: number) => {
    const next = Math.max(0, Math.min(val, 12));
    setGlasses(next);
    setSaving(true);
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("water_logs").upsert(
      { user_id: userId, glasses: next, logged_at: today },
      { onConflict: "user_id,logged_at" }
    );
    setSaving(false);
  };

  const pct = Math.min((glasses / goal) * 100, 100);

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "2px" }}>WASSER</p>
          <p style={{ fontSize: "18px", fontWeight: 500, color: glasses >= goal ? "var(--accent-light)" : "var(--text-primary)" }}>
            {glasses} / {goal} Gläser
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => update(glasses - 1)}
            disabled={glasses === 0 || saving}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "18px", cursor: glasses === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            −
          </button>
          <button
            onClick={() => update(glasses + 1)}
            disabled={glasses >= 12 || saving}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent)", border: "none", color: "#fff", fontSize: "18px", cursor: glasses >= 12 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            +
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {Array.from({ length: goal }).map((_, i) => (
          <div
            key={i}
            onClick={() => update(i + 1)}
            style={{
              flex: 1, height: "6px", borderRadius: "99px",
              background: i < glasses ? "var(--accent)" : "var(--bg-hover)",
              cursor: "pointer", transition: "background 0.2s",
            }}
          />
        ))}
      </div>
      {glasses >= goal && (
        <p style={{ fontSize: "11px", color: "var(--accent-light)", marginTop: "6px" }}>✓ Tagesziel erreicht!</p>
      )}
    </div>
  );
}
