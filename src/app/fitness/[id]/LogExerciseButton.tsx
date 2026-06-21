"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Set {
  reps: number;
  weight: number;
}

interface Props {
  exerciseName: string;
  userId: string;
}

export function LogExerciseButton({ exerciseName, userId }: Props) {
  const router = useRouter();
  const [sets, setSets] = useState<Set[]>([{ reps: 10, weight: 0 }]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const updateSet = (i: number, field: keyof Set, val: number) => {
    setSets((prev) => prev.map((s, n) => n === i ? { ...s, [field]: val } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("workout_logs").insert({
      user_id: userId,
      exercise_name: exerciseName,
      sets,
    });
    setSaving(false);
    setDone(true);
    setTimeout(() => { setDone(false); router.refresh(); }, 2000);
  };

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px" }}>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 12px", letterSpacing: "0.3px" }}>
        WORKOUT LOGGEN
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
        {sets.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", minWidth: "30px" }}>Set {i + 1}</span>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                value={s.reps}
                onChange={(e) => updateSet(i, "reps", Number(e.target.value))}
                style={{ width: "100%", padding: "6px 8px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
                placeholder="Wdh"
              />
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>×</span>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                value={s.weight}
                onChange={(e) => updateSet(i, "weight", Number(e.target.value))}
                style={{ width: "100%", padding: "6px 8px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
                placeholder="kg"
              />
            </div>
            {sets.length > 1 && (
              <button onClick={() => setSets((p) => p.filter((_, n) => n !== i))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "16px" }}>×</button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setSets((p) => [...p, { reps: 10, weight: p[p.length - 1]?.weight ?? 0 }])}
        style={{ width: "100%", padding: "7px", background: "transparent", border: "1px dashed var(--border)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", marginBottom: "10px" }}
      >
        + Set hinzufügen
      </button>

      <button
        onClick={handleSave}
        disabled={saving || done}
        style={{ width: "100%", padding: "11px", background: done ? "var(--accent-bg)" : "var(--accent)", border: "none", borderRadius: "8px", color: done ? "var(--accent-light)" : "#fff", fontSize: "14px", fontWeight: 500, cursor: saving || done ? "default" : "pointer" }}
      >
        {done ? "✓ Gespeichert!" : saving ? "Wird gespeichert…" : "Workout speichern"}
      </button>
    </div>
  );
}
