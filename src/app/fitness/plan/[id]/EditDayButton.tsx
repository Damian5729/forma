"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EXERCISES } from "@/lib/exercises";

interface PlanExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface Props {
  planId: string;
  dayIdx: number;
  exercises: PlanExercise[];
  userId: string;
}

export function EditDayButton({ planId, dayIdx, exercises: initialExercises, userId }: Props) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<PlanExercise[]>(initialExercises);
  const [swappingIdx, setSwappingIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const muscleGroups = Array.from(new Set(EXERCISES.map((e) => e.muscle_group))).sort();
  const [filterMuscle, setFilterMuscle] = useState("");

  const removeExercise = (idx: number) => {
    setList((prev) => prev.filter((_, i) => i !== idx));
    if (swappingIdx === idx) setSwappingIdx(null);
  };

  const swapExercise = (idx: number, newEx: (typeof EXERCISES)[0]) => {
    setList((prev) => prev.map((ex, i) =>
      i === idx
        ? { ...ex, exerciseId: newEx.id, name: newEx.name }
        : ex
    ));
    setSwappingIdx(null);
  };

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("user_plan_overrides").upsert({
      user_id: userId,
      plan_id: planId,
      day_idx: dayIdx,
      exercises: list,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,plan_id,day_idx" });
    setSaving(false);
    setOpen(false);
    router.refresh();
  };

  const reset = async () => {
    const supabase = createClient();
    await supabase.from("user_plan_overrides")
      .delete()
      .eq("user_id", userId)
      .eq("plan_id", planId)
      .eq("day_idx", dayIdx);
    setList(initialExercises);
    setOpen(false);
    router.refresh();
  };

  const swapCandidates = EXERCISES.filter((e) =>
    !filterMuscle || e.muscle_group === filterMuscle
  );

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ padding: "6px 12px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer" }}>
        ✏️ Bearbeiten
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "flex-end" }}>
          {/* Backdrop */}
          <div onClick={() => { setOpen(false); setSwappingIdx(null); }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />

          {/* Sheet */}
          <div style={{
            position: "relative", zIndex: 1, width: "100%", maxWidth: "600px", margin: "0 auto",
            background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "20px 20px 0 0",
            maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
                {swappingIdx !== null ? `Ersetzen: ${list[swappingIdx]?.name}` : "Übungen bearbeiten"}
              </p>
              <button onClick={() => { setOpen(false); setSwappingIdx(null); }}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {swappingIdx !== null ? (
                // ── SWAP VIEW ──
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <button onClick={() => setFilterMuscle("")}
                      style={{ padding: "5px 12px", background: !filterMuscle ? "var(--accent-bg)" : "var(--bg-card)", border: !filterMuscle ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: !filterMuscle ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "11px", cursor: "pointer" }}>
                      Alle
                    </button>
                    {muscleGroups.map((mg) => (
                      <button key={mg} onClick={() => setFilterMuscle(mg === filterMuscle ? "" : mg)}
                        style={{ padding: "5px 12px", background: filterMuscle === mg ? "var(--accent-bg)" : "var(--bg-card)", border: filterMuscle === mg ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: filterMuscle === mg ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "11px", cursor: "pointer" }}>
                        {mg}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {swapCandidates.map((e) => (
                      <button key={e.id} onClick={() => swapExercise(swappingIdx, e)}
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px", textAlign: "left", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{e.name}</span>
                          <span style={{ fontSize: "10px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "2px 8px", borderRadius: "99px" }}>{e.muscle_group}</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{e.equipment}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // ── EXERCISE LIST VIEW ──
                <div style={{ padding: "16px" }}>
                  {list.length === 0 && (
                    <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", padding: "20px 0" }}>
                      Keine Übungen — Plan zurücksetzen um Standard wiederherzustellen.
                    </p>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                    {list.map((ex, i) => (
                      <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.name}</p>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{ex.sets} × {ex.reps} · {ex.rest}</p>
                        </div>
                        <button onClick={() => setSwappingIdx(i)}
                          style={{ padding: "5px 10px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text-secondary)", fontSize: "11px", cursor: "pointer", flexShrink: 0 }}>
                          Tauschen
                        </button>
                        <button onClick={() => removeExercise(i)}
                          style={{ width: "28px", height: "28px", background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.25)", borderRadius: "7px", color: "#E24B4A", fontSize: "16px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={reset}
                      style={{ flex: 1, padding: "11px", background: "transparent", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}>
                      ↺ Standard
                    </button>
                    <button onClick={save} disabled={saving}
                      style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: saving ? "default" : "pointer" }}>
                      {saving ? "Speichern…" : "✓ Speichern"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {swappingIdx !== null && (
              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
                <button onClick={() => setSwappingIdx(null)}
                  style={{ width: "100%", padding: "10px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>
                  ← Zurück
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
