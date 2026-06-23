"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ExSet { reps: number; weight: number; }
interface PlanExercise { exerciseId: string; name: string; sets: number; reps: string; rest: string; notes?: string; }
interface LastSession { sets: ExSet[]; date: string; }

// Exercise IDs that use bodyweight — weight field shows "Körpergewicht"
const BODYWEIGHT_IDS = new Set([
  "push-up", "pull-up", "dips-chest", "dips-tricep", "plank", "side-plank",
  "crunch", "russian-twist", "leg-raise", "glute-bridge", "lunge", "step-up",
  "mountain-climber", "dead-bug", "v-sit", "ab-wheel", "donkey-kick",
  "calf-raise", "running", "burpee", "jump-rope", "box-jump",
]);

interface Props {
  planId: string;
  dayIdx: number;
  dayName: string;
  dayFocus: string;
  exercises: PlanExercise[];
  lastSessions: Record<string, LastSession>;
  userId: string;
  userWeight: number | null;
}

type Phase = "exercise" | "rest" | "done";

function parseRestSecs(rest: string): number {
  const m = rest.match(/(\d+)/);
  return m ? parseInt(m[1]) : 90;
}

export function WorkoutPlayer({ planId, dayIdx, dayName, dayFocus, exercises, lastSessions, userId, userWeight }: Props) {
  const router = useRouter();

  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("exercise");
  const [restTotal, setRestTotal] = useState(90);
  const [restLeft, setRestLeft] = useState(90);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [logs, setLogs] = useState<Record<string, ExSet[]>>(() =>
    Object.fromEntries(
      exercises.map((ex) => {
        const isBodyweight = BODYWEIGHT_IDS.has(ex.exerciseId);
        const last = lastSessions[ex.name];
        // Default weight: last session → bodyweight → 0
        const defaultWeight = last?.sets[0]?.weight != null
          ? last.sets[0].weight
          : isBodyweight ? (userWeight ?? 0) : 0;
        return [
          ex.name,
          Array.from({ length: ex.sets }, (_, i) => ({
            reps: last?.sets[i]?.reps ?? 10,
            weight: last?.sets[i]?.weight ?? defaultWeight,
          })),
        ];
      })
    )
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ex = exercises[exIdx];

  const advanceToNext = useCallback(() => {
    const nextSet = setIdx + 1;
    if (nextSet < ex.sets) {
      setSetIdx(nextSet);
      setPhase("exercise");
    } else {
      const nextEx = exIdx + 1;
      if (nextEx < exercises.length) {
        setExIdx(nextEx);
        setSetIdx(0);
        setPhase("exercise");
      } else {
        setPhase("done");
      }
    }
  }, [setIdx, exIdx, ex?.sets, exercises.length]);

  // Rest timer
  useEffect(() => {
    if (phase !== "rest") return;
    timerRef.current = setInterval(() => {
      setRestLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          advanceToNext();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, advanceToNext]);

  const updateSet = (field: "reps" | "weight", val: number) => {
    if (!ex) return;
    setLogs((prev) => ({
      ...prev,
      [ex.name]: prev[ex.name].map((s, i) => {
        if (i === setIdx) return { ...s, [field]: val };
        // Propagate new weight to future sets that are still at the same default
        if (field === "weight" && i > setIdx && s.weight === prev[ex.name][setIdx].weight) {
          return { ...s, weight: val };
        }
        return s;
      }),
    }));
  };

  const completeSet = () => {
    if (!ex) return;
    const isLastSet = setIdx === ex.sets - 1;
    const isLastEx = exIdx === exercises.length - 1;
    if (isLastSet && isLastEx) { setPhase("done"); return; }
    const secs = parseRestSecs(ex.rest);
    setRestTotal(secs);
    setRestLeft(secs);
    setPhase("rest");
  };

  const skipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    advanceToNext();
  };

  const saveWorkout = async () => {
    setSaving(true);
    const supabase = createClient();
    const sessionId = crypto.randomUUID();
    await Promise.all(
      exercises.map((e) =>
        supabase.from("workout_logs").insert({
          user_id: userId,
          exercise_name: e.name,
          sets: logs[e.name],
          plan_id: planId,
          day_name: dayName,
          day_idx: dayIdx,
          session_id: sessionId,
        })
      )
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push(`/fitness/plan/${planId}`), 1600);
  };

  const last = ex ? lastSessions[ex.name] : null;
  const currentSet = ex ? logs[ex.name]?.[setIdx] : null;
  const restPct = restTotal > 0 ? (restLeft / restTotal) * 100 : 0;
  const maxLastWeight = last ? Math.max(...last.sets.map((s) => s.weight)) : 0;
  const isBodyweightEx = ex ? BODYWEIGHT_IDS.has(ex.exerciseId) : false;
  const isPR = !!(currentSet && currentSet.weight > 0 && currentSet.weight > maxLastWeight && !isBodyweightEx);

  // ── DONE SCREEN ──
  if (phase === "done") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 20px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>🎉</div>
            <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 6px" }}>
              {dayFocus} abgeschlossen!
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{exercises.length} Übungen · {exercises.reduce((s, e) => s + e.sets, 0)} Sätze</p>
          </div>

          {/* Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {exercises.map((e) => (
              <div key={e.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px" }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--accent-light)", margin: "0 0 8px" }}>{e.name}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {logs[e.name]?.map((s, i) => (
                    <span key={i} style={{ fontSize: "12px", color: "var(--text-primary)", background: "var(--bg-hover)", padding: "4px 10px", borderRadius: "8px" }}>
                      S{i + 1}: {s.reps}×{s.weight > 0 ? `${s.weight}kg` : "KG"}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={saveWorkout} disabled={saving || saved}
            style={{ width: "100%", padding: "16px", background: saved ? "var(--accent)" : "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "16px", fontWeight: 500, cursor: saving || saved ? "default" : "pointer", boxShadow: "0 4px 20px rgba(29,158,117,0.35)" }}>
            {saved ? "✓ Gespeichert! Zurück…" : saving ? "Wird gespeichert…" : "💾 Workout speichern"}
          </button>
        </div>
      </div>
    );
  }

  // ── REST SCREEN ──
  if (phase === "rest") {
    const nextIsNewEx = setIdx === ex.sets - 1;
    const nextEx = nextIsNewEx ? exercises[exIdx + 1] : ex;
    const nextSetNum = nextIsNewEx ? 1 : setIdx + 2;

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "24px" }}>PAUSE</p>

        {/* Countdown ring */}
        <div style={{ position: "relative", width: "140px", height: "140px", marginBottom: "24px" }}>
          <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="70" cy="70" r="60" fill="none" stroke="var(--bg-hover)" strokeWidth="8" />
            <circle cx="70" cy="70" r="60" fill="none" stroke="#1D9E75" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - restPct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: 500, color: "var(--text-primary)" }}>{restLeft}s</span>
          </div>
        </div>

        {nextEx && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 20px", textAlign: "center", marginBottom: "24px", minWidth: "260px" }}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 4px" }}>NÄCHSTER SATZ</p>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
              {nextEx.name} — Satz {nextSetNum}/{nextIsNewEx ? nextEx.sets : ex.sets}
            </p>
          </div>
        )}

        <button onClick={skipRest}
          style={{ padding: "12px 28px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "14px", cursor: "pointer" }}>
          Überspringen →
        </button>
      </div>
    );
  }

  // ── EXERCISE SCREEN ──
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>←</button>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "var(--accent-light)", letterSpacing: "0.5px", margin: "0 0 2px" }}>{dayFocus.toUpperCase()}</p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
            Übung {exIdx + 1}/{exercises.length} · Satz {setIdx + 1}/{ex.sets}
          </p>
        </div>
        <div style={{ width: "32px" }} />
      </div>

      {/* Progress bar */}
      <div style={{ height: "3px", background: "var(--bg-hover)" }}>
        <div style={{
          height: "100%",
          width: `${((exIdx * 100 + (setIdx + 1) / ex.sets * 100) / exercises.length)}%`,
          background: "linear-gradient(90deg,#1D9E75,#5DCAA5)",
          transition: "width 0.4s ease",
        }} />
      </div>

      <div style={{ flex: 1, maxWidth: "500px", margin: "0 auto", padding: "28px 20px", width: "100%", display: "flex", flexDirection: "column" }}>
        {/* Exercise name */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 8px", lineHeight: 1.2 }}>
            {ex.name}
          </h1>
          {ex.notes && <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>{ex.notes}</p>}
        </div>

        {/* Letztes Mal */}
        {last && (
          <div style={{ background: "var(--g-green-dark)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "12px", padding: "12px 16px", marginBottom: "24px" }}>
            <p style={{ fontSize: "10px", color: "var(--accent-light)", letterSpacing: "1px", margin: "0 0 6px" }}>LETZTES TRAINING</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {last.sets.map((s, i) => (
                <span key={i} style={{ fontSize: "13px", color: "var(--text-primary)", background: "rgba(29,158,117,0.1)", padding: "4px 10px", borderRadius: "8px" }}>
                  {s.reps}×{s.weight > 0 ? `${s.weight}kg` : isBodyweightEx ? "KG" : "–"}
                </span>
              ))}
            </div>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: "6px 0 0" }}>
              {new Date(last.date).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        )}

        {/* Satz indicator */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {Array.from({ length: ex.sets }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: "4px", borderRadius: "99px", background: i < setIdx ? "var(--accent)" : i === setIdx ? "var(--accent-light)" : "var(--bg-hover)", transition: "background 0.3s" }} />
          ))}
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", marginBottom: "20px" }}>
          Satz {setIdx + 1} von {ex.sets} · Ziel: {ex.reps} Wdh
        </p>

        {/* Inputs */}
        {currentSet && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
            {[
              { label: "WIEDERHOLUNGEN", field: "reps" as const, val: currentSet.reps, unit: "Wdh" },
              {
                label: isBodyweightEx ? "KÖRPERGEWICHT" : "GEWICHT",
                field: "weight" as const,
                val: currentSet.weight,
                unit: isBodyweightEx ? "kg KG" : "kg",
              },
            ].map(({ label, field, val, unit }) => (
              <div key={field} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
                <p style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", margin: "0 0 10px" }}>{label}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <button onClick={() => updateSet(field, Math.max(0, val - (field === "weight" ? 2.5 : 1)))}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    −
                  </button>
                  <div style={{ minWidth: "72px", textAlign: "center" }}>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => updateSet(field, parseFloat(e.target.value) || 0)}
                      onFocus={(e) => e.target.select()}
                      style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", background: "transparent", border: "none", outline: "none", width: "72px", textAlign: "center", padding: 0 }}
                    />
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "-2px" }}>{unit}</span>
                  </div>
                  <button onClick={() => updateSet(field, val + (field === "weight" ? 2.5 : 1))}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    +
                  </button>
                </div>
                {field === "weight" && isPR && (
                  <div style={{ marginTop: "8px", display: "inline-block", background: "linear-gradient(135deg,#f5c518,#e6a800)", borderRadius: "8px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: "#1a1000", letterSpacing: "0.5px", boxShadow: "0 2px 8px rgba(245,197,24,0.45)" }}>
                    🏆 PR!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Complete set button */}
        <button onClick={completeSet}
          className="glow-green"
          style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "16px", fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 20px rgba(29,158,117,0.35)" }}>
          {setIdx === ex.sets - 1 && exIdx === exercises.length - 1
            ? "🏁 Letzter Satz — fertig!"
            : setIdx === ex.sets - 1
              ? `Weiter → ${exercises[exIdx + 1]?.name}`
              : `Satz ${setIdx + 1} ✓ — Pause`}
        </button>

        {/* Next sets preview */}
        {ex.sets > setIdx + 1 && (
          <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)", marginTop: "14px" }}>
            Noch {ex.sets - setIdx - 1} Satz{ex.sets - setIdx - 1 > 1 ? "sätze" : ""} · Pause: {ex.rest}
          </p>
        )}
      </div>
    </div>
  );
}
