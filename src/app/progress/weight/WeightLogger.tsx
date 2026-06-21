"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function WeightLogger({ userId }: { userId: string }) {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSave = async () => {
    if (!weight || Number(weight) <= 0) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("weight_logs").insert({
      user_id: userId,
      weight: Number(weight),
    });
    setSaving(false);
    setDone(true);
    setWeight("");
    setTimeout(() => { setDone(false); router.refresh(); }, 1500);
  };

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
      <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "14px" }}>
        Gewicht eintragen
      </h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="number"
          step="0.1"
          placeholder="z.B. 78.5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ flex: 1, padding: "11px 14px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "15px", outline: "none" }}
        />
        <span style={{ display: "flex", alignItems: "center", color: "var(--text-secondary)", fontSize: "14px" }}>kg</span>
        <button
          onClick={handleSave}
          disabled={saving || done || !weight}
          style={{ padding: "11px 20px", background: done ? "var(--accent-bg)" : "var(--accent)", border: "none", borderRadius: "10px", color: done ? "var(--accent-light)" : "#fff", fontSize: "14px", fontWeight: 500, cursor: !weight || saving || done ? "default" : "pointer" }}
        >
          {done ? "✓" : saving ? "…" : "Speichern"}
        </button>
      </div>
    </div>
  );
}
