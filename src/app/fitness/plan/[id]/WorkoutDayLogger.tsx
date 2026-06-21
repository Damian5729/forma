"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface PlanExercise {
  name: string;
  sets: number;
  reps: string;
}

interface SetEntry {
  reps: number;
  weight: number;
}

interface Props {
  dayName: string;
  exercises: PlanExercise[];
  userId: string;
}

export function WorkoutDayLogger({ dayName, exercises, userId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [logs, setLogs] = useState<Record<string, SetEntry[]>>(
    Object.fromEntries(
      exercises.map((ex) => [
        ex.name,
        Array.from({ length: ex.sets }, () => ({ reps: 10, weight: 0 })),
      ])
    )
  );

  const updateSet = (exName: string, setIdx: number, field: keyof SetEntry, val: number) => {
    setLogs((prev) => ({
      ...prev,
      [exName]: prev[exName].map((s, i) => i === setIdx ? { ...s, [field]: val } : s),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await Promise.all(
      exercises.map((ex) =>
        supabase.from("workout_logs").insert({
          user_id: userId,
          exercise_name: ex.name,
          sets: logs[ex.name],
        })
      )
    );
    setSaving(false);
    setDone(true);
    setOpen(false);
    setTimeout(() => { setDone(false); router.refresh(); }, 2000);
  };

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "8px", color: "var(--accent-light)", fontSize: "14px" }}>
        ✓ Workout gespeichert!
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "12px", background: open ? "var(--bg-hover)" : "var(--accent)", border: "none", borderRadius: "10px", color: open ? "var(--text-secondary)" : "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
      >
        {open ? "▲ Schließen" : "▶ Workout starten & loggen"}
      </button>

      {open && (
        <div style={{ marginTop: "16px" }}>
          {exercises.map((ex) => (
            <div key={ex.name} style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px" }}>
                {ex.name} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({ex.sets} × {ex.reps})</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {logs[ex.name].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", width: "40px" }}>Set {i + 1}</span>
                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) => updateSet(ex.name, i, "reps", Number(e.target.value))}
                      style={{ flex: 1, padding: "8px 10px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "14px", outline: "none" }}
                      placeholder="Wdh"
                    />
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>×</span>
                    <input
                      type="number"
                      value={s.weight}
                      onChange={(e) => updateSet(ex.name, i, "weight", Number(e.target.value))}
                      style={{ flex: 1, padding: "8px 10px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "14px", outline: "none" }}
                      placeholder="kg"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ width: "100%", padding: "13px", background: "var(--accent)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: saving ? "default" : "pointer", marginTop: "8px" }}
          >
            {saving ? "Wird gespeichert…" : `✓ ${dayName} abgeschlossen`}
          </button>
        </div>
      )}
    </>
  );
}
