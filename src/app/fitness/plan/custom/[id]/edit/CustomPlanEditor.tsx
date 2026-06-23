"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Exercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

interface Day {
  name: string;
  focus: string;
  exercises: Exercise[];
}

interface PlanData {
  name: string;
  description: string;
  level: string;
  days_per_week: number;
  goal: string;
  duration: string;
  location: string;
  days: Day[];
}

const EMPTY_EXERCISE = (): Exercise => ({ exerciseId: "", name: "", sets: 3, reps: "8–12", rest: "60 Sek", notes: "" });
const EMPTY_DAY = (idx: number): Day => ({ name: `Tag ${idx + 1}`, focus: "", exercises: [EMPTY_EXERCISE()] });

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", background: "var(--bg-hover)",
  border: "1px solid var(--border)", borderRadius: "10px",
  color: "var(--text-primary)", fontSize: "14px", outline: "none", boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

export function CustomPlanEditor({ planId, initial }: { planId: string; initial: PlanData }) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description ?? "");
  const [level, setLevel] = useState(initial.level ?? "Anfänger");
  const [goal, setGoal] = useState(initial.goal ?? "Allgemein");
  const [location, setLocation] = useState(initial.location ?? "Gym");
  const [duration, setDuration] = useState(initial.duration ?? "45–60 Min");
  const [days, setDays] = useState<Day[]>(
    (initial.days as Day[]).map((d) => ({
      ...d,
      exercises: d.exercises.map((e) => ({ ...e, notes: e.notes ?? "" })),
    }))
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addDay = () => setDays((d) => [...d, EMPTY_DAY(d.length)]);
  const removeDay = (i: number) => setDays((d) => d.filter((_, idx) => idx !== i));
  const updateDay = (i: number, field: keyof Day, value: string) =>
    setDays((d) => d.map((day, idx) => idx === i ? { ...day, [field]: value } : day));
  const addExercise = (dayIdx: number) =>
    setDays((d) => d.map((day, i) => i === dayIdx ? { ...day, exercises: [...day.exercises, EMPTY_EXERCISE()] } : day));
  const removeExercise = (dayIdx: number, exIdx: number) =>
    setDays((d) => d.map((day, i) => i === dayIdx ? { ...day, exercises: day.exercises.filter((_, j) => j !== exIdx) } : day));
  const updateExercise = (dayIdx: number, exIdx: number, field: keyof Exercise, value: string | number) =>
    setDays((d) => d.map((day, i) => i === dayIdx
      ? { ...day, exercises: day.exercises.map((ex, j) => j === exIdx ? { ...ex, [field]: value } : ex) }
      : day));

  const handleSave = async () => {
    setError("");
    if (!name.trim()) { setError("Planname fehlt."); return; }
    for (const day of days) {
      if (!day.focus.trim()) { setError(`Fokus bei "${day.name}" fehlt.`); return; }
      for (const ex of day.exercises) {
        if (!ex.name.trim()) { setError(`Übungsname in "${day.name}" fehlt.`); return; }
      }
    }
    setLoading(true);
    const res = await fetch(`/api/custom-plans/${planId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, level, goal, location, duration, days_per_week: days.length, days }),
    });
    if (!res.ok) {
      const j = await res.json();
      setError(j.error ?? "Fehler beim Speichern.");
      setLoading(false);
      return;
    }
    router.push(`/fitness/plan/${planId}`);
    router.refresh();
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "18px" }}>Plan-Info</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>PLANNAME *</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>BESCHREIBUNG</label>
            <input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>ZIEL</label>
              <select style={selectStyle} value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option>Allgemein</option><option>Muskelaufbau</option><option>Fettabbau</option><option>Kraft</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>LEVEL</label>
              <select style={selectStyle} value={level} onChange={(e) => setLevel(e.target.value)}>
                <option>Anfänger</option><option>Mittel</option><option>Fortgeschritten</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>ORT</label>
              <select style={selectStyle} value={location} onChange={(e) => setLocation(e.target.value)}>
                <option>Gym</option><option>Zuhause</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>DAUER</label>
              <input style={inputStyle} value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {days.map((day, dayIdx) => (
        <div key={dayIdx} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", marginBottom: "16px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent-light)", minWidth: "52px" }}>TAG {dayIdx + 1}</span>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Tagname" value={day.name} onChange={(e) => updateDay(dayIdx, "name", e.target.value)} />
            <input style={{ ...inputStyle, flex: 2 }} placeholder="Fokus" value={day.focus} onChange={(e) => updateDay(dayIdx, "focus", e.target.value)} />
            {days.length > 1 && (
              <button onClick={() => removeDay(dayIdx)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer", padding: "4px" }}>×</button>
            )}
          </div>
          <div style={{ padding: "12px 20px" }}>
            {day.exercises.map((ex, exIdx) => (
              <div key={exIdx} style={{ padding: "12px 0", borderBottom: exIdx < day.exercises.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 60px 80px 80px auto", gap: "8px", alignItems: "center" }}>
                  <input style={inputStyle} placeholder="Übungsname *" value={ex.name} onChange={(e) => updateExercise(dayIdx, exIdx, "name", e.target.value)} />
                  <input style={{ ...inputStyle, textAlign: "center", padding: "10px 6px" }} type="number" min={1} value={ex.sets} onChange={(e) => updateExercise(dayIdx, exIdx, "sets", parseInt(e.target.value) || 1)} />
                  <input style={{ ...inputStyle, padding: "10px 8px" }} placeholder="Wdh." value={ex.reps} onChange={(e) => updateExercise(dayIdx, exIdx, "reps", e.target.value)} />
                  <input style={{ ...inputStyle, padding: "10px 8px" }} placeholder="Pause" value={ex.rest} onChange={(e) => updateExercise(dayIdx, exIdx, "rest", e.target.value)} />
                  {day.exercises.length > 1
                    ? <button onClick={() => removeExercise(dayIdx, exIdx)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer", padding: "4px" }}>×</button>
                    : <div style={{ width: "24px" }} />}
                </div>
                <input style={{ ...inputStyle, marginTop: "6px", fontSize: "12px" }} placeholder="Notizen (optional)" value={ex.notes} onChange={(e) => updateExercise(dayIdx, exIdx, "notes", e.target.value)} />
              </div>
            ))}
            <button onClick={() => addExercise(dayIdx)} style={{ marginTop: "12px", background: "none", border: "1px dashed var(--border)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer", width: "100%", padding: "10px" }}>
              + Übung hinzufügen
            </button>
          </div>
        </div>
      ))}

      <button onClick={addDay} style={{ width: "100%", padding: "14px", background: "none", border: "1px dashed var(--border)", borderRadius: "12px", color: "var(--accent-light)", fontSize: "14px", cursor: "pointer", marginBottom: "24px" }}>
        + Trainingstag hinzufügen
      </button>

      {error && <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "12px" }}>{error}</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          width: "100%", padding: "14px",
          background: loading ? "var(--bg-hover)" : "linear-gradient(135deg,#1D9E75,#16835f)",
          border: "none", borderRadius: "12px",
          color: loading ? "var(--text-muted)" : "#fff",
          fontSize: "15px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 3px 12px rgba(29,158,117,0.3)",
        }}
      >
        {loading ? "Wird gespeichert..." : "Änderungen speichern"}
      </button>
    </div>
  );
}
