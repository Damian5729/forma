"use client";

import { useState, useMemo } from "react";
import { EXERCISES } from "@/lib/exercises";

const MUSCLE_GROUPS = ["Alle", "Brust", "Rücken", "Beine", "Schultern", "Bizeps", "Trizeps", "Core", "Gesäß", "Kardio"] as const;

export interface PickedExercise {
  exerciseId: string;
  name: string;
}

export function ExercisePicker({
  onPick,
  onClose,
}: {
  onPick: (ex: PickedExercise) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("Alle");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((ex) => {
      if (group !== "Alle" && ex.muscle_group !== group) return false;
      if (q && !ex.name.toLowerCase().includes(q) && !ex.muscle_group.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, group]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "560px", maxHeight: "85vh",
          background: "var(--bg-primary)", border: "1px solid var(--border)",
          borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 20px 12px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Übung auswählen</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "22px", cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>×</button>
          </div>
          <input
            autoFocus
            placeholder="Übung suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%", padding: "11px 14px", background: "var(--bg-hover)",
              border: "1px solid var(--border)", borderRadius: "10px",
              color: "var(--text-primary)", fontSize: "14px", outline: "none", boxSizing: "border-box",
            }}
          />
          {/* Group chips */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginTop: "12px", paddingBottom: "2px" }}>
            {MUSCLE_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                style={{
                  flexShrink: 0, padding: "6px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
                  background: group === g ? "var(--accent)" : "var(--bg-card)",
                  border: group === g ? "1px solid var(--accent)" : "1px solid var(--border)",
                  color: group === g ? "#fff" : "var(--text-secondary)",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", padding: "8px 20px 24px" }}>
          {filtered.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "32px 0" }}>Keine Übung gefunden.</p>
          ) : (
            filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => { onPick({ exerciseId: ex.id, name: ex.name }); onClose(); }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
                  padding: "13px 0", borderBottom: "1px solid var(--border)",
                  background: "none", border: "none", borderBottomStyle: "solid", cursor: "pointer", textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{ex.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{ex.muscle_group} · {ex.equipment}</div>
                </div>
                <span style={{ fontSize: "18px", color: "var(--accent-light)" }}>+</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
