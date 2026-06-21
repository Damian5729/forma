"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const fields = [
  { key: "waist", label: "Taille (cm)" },
  { key: "hips", label: "Hüfte (cm)" },
  { key: "chest", label: "Brust (cm)" },
  { key: "arms", label: "Arme (cm)" },
  { key: "thighs", label: "Oberschenkel (cm)" },
];

export function MeasurementLogger({ userId }: { userId: string }) {
  const router = useRouter();
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setVals((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const payload = Object.fromEntries(
      fields.filter((f) => vals[f.key]).map((f) => [f.key, Number(vals[f.key])])
    );
    if (!Object.keys(payload).length) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("body_measurements").insert({ user_id: userId, ...payload });
    setSaving(false);
    setDone(true);
    setVals({});
    setTimeout(() => { setDone(false); router.refresh(); }, 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    background: "var(--bg-hover)", border: "1px solid var(--border)",
    borderRadius: "8px", color: "var(--text-primary)", fontSize: "14px", outline: "none",
  };

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
      <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "16px" }}>
        Neue Messung eintragen
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>{f.label}</label>
            <input
              style={inputStyle}
              type="number"
              step="0.1"
              placeholder="z.B. 85"
              value={vals[f.key] ?? ""}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving || done}
        style={{ width: "100%", padding: "11px", background: done ? "var(--accent-bg)" : "var(--accent)", border: "none", borderRadius: "8px", color: done ? "var(--accent-light)" : "#fff", fontSize: "14px", fontWeight: 500, cursor: saving || done ? "default" : "pointer" }}
      >
        {done ? "✓ Gespeichert!" : saving ? "Wird gespeichert…" : "Messung speichern"}
      </button>
    </div>
  );
}
