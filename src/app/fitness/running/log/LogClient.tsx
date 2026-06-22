"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function calcPace(distanceKm: number, durationMinutes: number): string {
  if (!distanceKm || !durationMinutes) return "";
  const paceDecimal = durationMinutes / distanceKm;
  const mins = Math.floor(paceDecimal);
  const secs = Math.round((paceDecimal - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")} min/km`;
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function LogClient({ userId }: { userId: string }) {
  const [distance, setDistance] = useState("");
  const [durationMins, setDurationMins] = useState("");
  const [durationSecs, setDurationSecs] = useState("");
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const distNum = parseFloat(distance);
  const totalMins = parseFloat(durationMins || "0") + parseFloat(durationSecs || "0") / 60;
  const pace = distNum > 0 && totalMins > 0 ? calcPace(distNum, totalMins) : "";

  async function handleSave() {
    if (!distance || !durationMins) {
      setError("Bitte Distanz und Zeit eingeben.");
      return;
    }
    if (distNum <= 0 || totalMins <= 0) {
      setError("Distanz und Zeit müssen größer als 0 sein.");
      return;
    }
    setError("");
    setSaving(true);

    const supabase = createClient();
    const { error: dbError } = await supabase.from("running_logs").insert({
      user_id: userId,
      date,
      distance_km: distNum,
      duration_minutes: totalMins,
      pace_per_km: pace || null,
      notes: notes.trim() || null,
    });

    setSaving(false);
    if (dbError) {
      setError("Fehler beim Speichern: " + dbError.message);
    } else {
      setSaved(true);
      setDistance("");
      setDurationMins("");
      setDurationSecs("");
      setNotes("");
      setDate(today());
      setTimeout(() => {
        setSaved(false);
        window.location.reload();
      }, 1200);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "var(--bg-hover)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: "11px",
    color: "var(--text-muted)",
    marginBottom: "6px",
    display: "block",
    letterSpacing: "0.5px",
  };

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "28px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "20px" }}>
        Lauf eintragen
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <label style={labelStyle}>DATUM</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>DISTANZ (KM)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="5.0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <label style={labelStyle}>MINUTEN</label>
          <input
            type="number"
            min="0"
            placeholder="25"
            value={durationMins}
            onChange={(e) => setDurationMins(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>SEKUNDEN</label>
          <input
            type="number"
            min="0"
            max="59"
            placeholder="30"
            value={durationSecs}
            onChange={(e) => setDurationSecs(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {pace && (
        <div style={{ background: "rgba(239,159,39,0.1)", border: "1px solid rgba(239,159,39,0.25)", borderRadius: "10px", padding: "10px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>⚡</span>
          <span style={{ fontSize: "13px", color: "#EF9F27", fontWeight: 500 }}>Pace: {pace}</span>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>NOTIZEN (OPTIONAL)</label>
        <textarea
          placeholder="Wie war der Lauf? Wetter, Gefühl, Strecke..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {error && (
        <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "12px" }}>{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving || saved}
        style={{
          width: "100%",
          padding: "12px",
          background: saved ? "#1D9E75" : "#EF9F27",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: saving || saved ? "default" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {saved ? "✓ Gespeichert!" : saving ? "Speichern..." : "Lauf speichern"}
      </button>
    </div>
  );
}
