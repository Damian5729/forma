"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ExSet { reps: number; weight: number; }
interface LastSession { sets: ExSet[]; date: string; }

const BODYWEIGHT_IDS = new Set([
  "push-up", "pull-up", "dips-chest", "dips-tricep", "plank", "side-plank",
  "crunch", "russian-twist", "leg-raise", "glute-bridge", "lunge", "step-up",
  "mountain-climber", "dead-bug", "v-sit", "ab-wheel", "donkey-kick",
  "calf-raise", "running", "burpee", "jump-rope", "box-jump",
  "incline-push-up", "chin-up", "inverted-row", "bench-dip", "diamond-push-up",
  "walking-lunge", "sissy-squat", "nordic-curl", "curtsy-lunge",
  "hanging-leg-raise", "bicycle-crunch", "hollow-hold", "jumping-jack", "high-knees",
]);

interface Props {
  exerciseId: string;
  exerciseName: string;
  userId: string;
  userWeight: number | null;
  lastSession: LastSession | null;
}

type Phase = "setup" | "exercise" | "rest" | "done";

const REST_SECS = 90;

function Stepper({ label, val, unit, step, onChange, min = 0 }: {
  label: string; val: number; unit: string; step: number; min?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
      <p style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", margin: "0 0 10px" }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <button onClick={() => onChange(Math.max(min, +(val - step).toFixed(2)))}
          style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "18px", cursor: "pointer" }}>
          −
        </button>
        <div style={{ minWidth: "72px", textAlign: "center" }}>
          <input
            type="number"
            value={val}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            onFocus={(e) => e.target.select()}
            style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", background: "transparent", border: "none", outline: "none", width: "72px", textAlign: "center", padding: 0 }}
          />
          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "-2px" }}>{unit}</span>
        </div>
        <button onClick={() => onChange(+(val + step).toFixed(2))}
          style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "18px", cursor: "pointer" }}>
          +
        </button>
      </div>
    </div>
  );
}

export function SingleExercisePlayer({ exerciseId, exerciseName, userId, userWeight, lastSession }: Props) {
  const router = useRouter();
  const isBodyweight = BODYWEIGHT_IDS.has(exerciseId);
  const defaultWeight = lastSession?.sets[0]?.weight != null
    ? lastSession.sets[0].weight
    : isBodyweight ? (userWeight ?? 0) : 0;

  const [phase, setPhase] = useState<Phase>("setup");
  const [setCount, setSetCount] = useState(lastSession?.sets.length ?? 3);
  const [setIdx, setSetIdx] = useState(0);
  const [restLeft, setRestLeft] = useState(REST_SECS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logs, setLogs] = useState<ExSet[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startWorkout = () => {
    setLogs(Array.from({ length: setCount }, (_, i) => ({
      reps: lastSession?.sets[i]?.reps ?? 10,
      weight: lastSession?.sets[i]?.weight ?? defaultWeight,
    })));
    setSetIdx(0);
    setPhase("exercise");
  };

  const advanceToNext = useCallback(() => {
    setSetIdx((cur) => {
      const next = cur + 1;
      if (next < setCount) { setPhase("exercise"); return next; }
      setPhase("done");
      return cur;
    });
  }, [setCount]);

  useEffect(() => {
    if (phase !== "rest") return;
    timerRef.current = setInterval(() => {
      setRestLeft((s) => {
        if (s <= 1) { clearInterval(timerRef.current!); advanceToNext(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, advanceToNext]);

  const updateSet = (field: "reps" | "weight", val: number) => {
    setLogs((prev) => prev.map((s, i) => {
      if (i === setIdx) return { ...s, [field]: val };
      if (field === "weight" && i > setIdx && s.weight === prev[setIdx].weight) return { ...s, weight: val };
      return s;
    }));
  };

  const completeSet = () => {
    if (setIdx === setCount - 1) { setPhase("done"); return; }
    setRestLeft(REST_SECS);
    setPhase("rest");
  };

  const skipRest = () => { if (timerRef.current) clearInterval(timerRef.current); advanceToNext(); };

  const saveWorkout = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("workout_logs").insert({
      user_id: userId,
      exercise_name: exerciseName,
      sets: logs,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.refresh(), 1600);
  };

  const currentSet = logs[setIdx];
  const maxLastWeight = lastSession ? Math.max(...lastSession.sets.map((s) => s.weight)) : 0;
  const isPR = !!(currentSet && currentSet.weight > 0 && currentSet.weight > maxLastWeight && !isBodyweight);
  const restPct = (restLeft / REST_SECS) * 100;

  // ── SETUP ──
  if (phase === "setup") {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 16px", letterSpacing: "0.3px" }}>WORKOUT STARTEN</p>
        <div style={{ marginBottom: "16px" }}>
          <Stepper label="ANZAHL SÄTZE" val={setCount} unit="Sätze" step={1} min={1}
            onChange={(v) => setSetCount(Math.round(v))} />
        </div>
        {lastSession && (
          <div style={{ background: "var(--g-green-dark)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "12px", padding: "10px 14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "10px", color: "var(--accent-light)", letterSpacing: "1px", margin: "0 0 6px" }}>LETZTES TRAINING</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {lastSession.sets.map((s, i) => (
                <span key={i} style={{ fontSize: "12px", color: "var(--text-primary)", background: "rgba(29,158,117,0.1)", padding: "3px 8px", borderRadius: "6px" }}>
                  {s.reps}×{s.weight > 0 ? `${s.weight}kg` : "KG"}
                </span>
              ))}
            </div>
          </div>
        )}
        <button onClick={startWorkout}
          className="glow-green"
          style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 20px rgba(29,158,117,0.35)" }}>
          ▶ {setCount} Sätze starten
        </button>
      </div>
    );
  }

  // ── DONE ──
  if (phase === "done") {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎉</div>
        <h2 style={{ fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 14px" }}>{exerciseName} fertig!</h2>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginBottom: "18px" }}>
          {logs.map((s, i) => (
            <span key={i} style={{ fontSize: "12px", color: "var(--text-primary)", background: "var(--bg-hover)", padding: "4px 10px", borderRadius: "8px" }}>
              S{i + 1}: {s.reps}×{s.weight > 0 ? `${s.weight}kg` : "KG"}
            </span>
          ))}
        </div>
        <button onClick={saveWorkout} disabled={saving || saved}
          style={{ width: "100%", padding: "14px", background: saved ? "var(--accent)" : "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: saving || saved ? "default" : "pointer", boxShadow: "0 4px 20px rgba(29,158,117,0.35)" }}>
          {saved ? "✓ Gespeichert!" : saving ? "Wird gespeichert…" : "💾 Speichern"}
        </button>
      </div>
    );
  }

  // ── REST ──
  if (phase === "rest") {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "16px" }}>PAUSE</p>
        <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "18px" }}>
          <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg-hover)" strokeWidth="8" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#1D9E75" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - restPct / 100)}`}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "28px", fontWeight: 500, color: "var(--text-primary)" }}>{restLeft}s</span>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>Nächster: Satz {setIdx + 2}/{setCount}</p>
        <button onClick={skipRest}
          style={{ padding: "10px 24px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-secondary)", fontSize: "14px", cursor: "pointer" }}>
          Überspringen →
        </button>
      </div>
    );
  }

  // ── EXERCISE ──
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
      {/* Set indicator */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
        {Array.from({ length: setCount }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: "4px", borderRadius: "99px", background: i < setIdx ? "var(--accent)" : i === setIdx ? "var(--accent-light)" : "var(--bg-hover)", transition: "background 0.3s" }} />
        ))}
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", marginBottom: "18px" }}>
        Satz {setIdx + 1} von {setCount}
      </p>

      {currentSet && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <Stepper label="WIEDERHOLUNGEN" val={currentSet.reps} unit="Wdh" step={1} min={0}
            onChange={(v) => updateSet("reps", Math.round(v))} />
          <div>
            <Stepper label={isBodyweight ? "KÖRPERGEWICHT" : "GEWICHT"} val={currentSet.weight} unit={isBodyweight ? "kg KG" : "kg"} step={2.5} min={0}
              onChange={(v) => updateSet("weight", v)} />
            {isPR && (
              <div style={{ marginTop: "8px", textAlign: "center" }}>
                <span style={{ display: "inline-block", background: "linear-gradient(135deg,#f5c518,#e6a800)", borderRadius: "8px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: "#1a1000", letterSpacing: "0.5px", boxShadow: "0 2px 8px rgba(245,197,24,0.45)" }}>
                  🏆 PR!
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={completeSet}
        className="glow-green"
        style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 20px rgba(29,158,117,0.35)" }}>
        {setIdx === setCount - 1 ? "🏁 Letzter Satz — fertig!" : `Satz ${setIdx + 1} ✓ — Pause`}
      </button>
    </div>
  );
}
