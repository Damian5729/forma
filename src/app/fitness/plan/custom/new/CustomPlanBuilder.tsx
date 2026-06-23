"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExercisePicker, PickedExercise } from "../ExercisePicker";

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

const EMPTY_DAY = (idx: number): Day => ({ name: `Tag ${idx + 1}`, focus: "", exercises: [] });

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", background: "var(--bg-hover)",
  border: "1px solid var(--border)", borderRadius: "10px",
  color: "var(--text-primary)", fontSize: "14px", outline: "none", boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

export function CustomPlanBuilder() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Anfänger");
  const [goal, setGoal] = useState("Allgemein");
  const [location, setLocation] = useState("Gym");
  const [duration, setDuration] = useState("45–60 Min");
  const [days, setDays] = useState<Day[]>([EMPTY_DAY(0)]);
  const [pickerDay, setPickerDay] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addDay = () => setDays((d) => [...d, EMPTY_DAY(d.length)]);
  const removeDay = (i: number) => setDays((d) => d.filter((_, idx) => idx !== i));

  const updateDay = (i: number, field: keyof Day, value: string) =>
    setDays((d) => d.map((day, idx) => idx === i ? { ...day, [field]: value } : day));

  const addPickedExercise = (dayIdx: number, picked: PickedExercise) =>
    setDays((d) => d.map((day, i) => i === dayIdx
      ? { ...day, exercises: [...day.exercises, { exerciseId: picked.exerciseId, name: picked.name, sets: 3, reps: "8–12", rest: "60 Sek", notes: "" }] }
      : day));

  const removeExercise = (dayIdx: number, exIdx: number) =>
    setDays((d) => d.map((day, i) => i === dayIdx
      ? { ...day, exercises: day.exercises.filter((_, j) => j !== exIdx) }
      : day));

  const updateExercise = (dayIdx: number, exIdx: number, field: keyof Exercise, value: string | number) =>
    setDays((d) => d.map((day, i) => i === dayIdx
      ? {
          ...day,
          exercises: day.exercises.map((ex, j) => j === exIdx ? { ...ex, [field]: value } : ex),
        }
      : day));

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) { setError("Planname fehlt."); return; }
    for (const day of days) {
      if (!day.focus.trim()) { setError(`Fokus bei "${day.name}" fehlt.`); return; }
      if (day.exercises.length === 0) { setError(`"${day.name}" hat keine Übungen.`); return; }
    }
    setLoading(true);
    const res = await fetch("/api/custom-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, level, goal, location, duration, days_per_week: days.length, days }),
    });
    if (!res.ok) {
      const j = await res.json();
      setError(j.error ?? "Fehler beim Speichern.");
      setLoading(false);
      return;
    }
    const plan = await res.json();
    router.push(`/fitness/plan/${plan.id}`);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Plan metadata */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "18px" }}>Plan-Info</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>PLANNAME *</label>
            <input style={inputStyle} placeholder="z. B. Mein Push-Pull Plan" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>BESCHREIBUNG</label>
            <input style={inputStyle} placeholder="Kurze Beschreibung" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>ZIEL</label>
              <select style={selectStyle} value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option>Allgemein</option>
                <option>Muskelaufbau</option>
                <option>Fettabbau</option>
                <option>Kraft</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>LEVEL</label>
              <select style={selectStyle} value={level} onChange={(e) => setLevel(e.target.value)}>
                <option>Anfänger</option>
                <option>Mittel</option>
                <option>Fortgeschritten</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>ORT</label>
              <select style={selectStyle} value={location} onChange={(e) => setLocation(e.target.value)}>
                <option>Gym</option>
                <option>Zuhause</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>DAUER</label>
              <input style={inputStyle} placeholder="45–60 Min" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Days */}
      {days.map((day, dayIdx) => (
        <div key={dayIdx} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", marginBottom: "16px", overflow: "hidden" }}>
          {/* Day header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent-light)", minWidth: "52px" }}>TAG {dayIdx + 1}</span>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Tagname (z. B. Tag A)"
              value={day.name}
              onChange={(e) => updateDay(dayIdx, "name", e.target.value)}
            />
            <input
              style={{ ...inputStyle, flex: 2 }}
              placeholder="Fokus (z. B. Brust & Trizeps)"
              value={day.focus}
              onChange={(e) => updateDay(dayIdx, "focus", e.target.value)}
            />
            {days.length > 1 && (
              <button
                onClick={() => removeDay(dayIdx)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer", padding: "4px", lineHeight: 1 }}
              >×</button>
            )}
          </div>

          {/* Exercises */}
          <div style={{ padding: "12px 20px" }}>
            {day.exercises.length === 0 && (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", padding: "8px 0" }}>Noch keine Übungen.</p>
            )}
            {day.exercises.map((ex, exIdx) => (
              <div key={exIdx} style={{ padding: "12px 0", borderBottom: exIdx < day.exercises.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{ex.name}</span>
                  <button
                    onClick={() => removeExercise(dayIdx, exIdx)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer", padding: "4px" }}
                  >×</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "70px 90px 90px", gap: "8px", alignItems: "center" }}>
                  <div>
                    <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>SÄTZE</label>
                    <input
                      style={{ ...inputStyle, textAlign: "center", padding: "8px 6px" }}
                      type="number" min={1}
                      value={ex.sets}
                      onChange={(e) => updateExercise(dayIdx, exIdx, "sets", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>WDH.</label>
                    <input
                      style={{ ...inputStyle, padding: "8px" }}
                      value={ex.reps}
                      onChange={(e) => updateExercise(dayIdx, exIdx, "reps", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>PAUSE</label>
                    <input
                      style={{ ...inputStyle, padding: "8px" }}
                      value={ex.rest}
                      onChange={(e) => updateExercise(dayIdx, exIdx, "rest", e.target.value)}
                    />
                  </div>
                </div>
                <input
                  style={{ ...inputStyle, marginTop: "8px", fontSize: "12px" }}
                  placeholder="Notizen (optional)"
                  value={ex.notes}
                  onChange={(e) => updateExercise(dayIdx, exIdx, "notes", e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={() => setPickerDay(dayIdx)}
              style={{ marginTop: "12px", background: "none", border: "1px dashed var(--accent)", borderRadius: "8px", color: "var(--accent-light)", fontSize: "13px", fontWeight: 500, cursor: "pointer", width: "100%", padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              + Übung auswählen
            </button>
          </div>
        </div>
      ))}

      {/* Add day */}
      <button
        onClick={addDay}
        style={{ width: "100%", padding: "14px", background: "none", border: "1px dashed var(--border)", borderRadius: "12px", color: "var(--accent-light)", fontSize: "14px", cursor: "pointer", marginBottom: "24px" }}
      >
        + Trainingstag hinzufügen
      </button>

      {error && (
        <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "12px" }}>{error}</p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
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
        {loading ? "Wird gespeichert..." : "Plan speichern"}
      </button>

      {pickerDay !== null && (
        <ExercisePicker
          onPick={(ex) => addPickedExercise(pickerDay, ex)}
          onClose={() => setPickerDay(null)}
        />
      )}
    </div>
  );
}
