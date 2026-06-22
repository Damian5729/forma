"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const ACTIVITIES = [
  { id: "running",    name: "Laufen",       emoji: "🏃", calPerMin: 10,  stepsPerMin: 155 },
  { id: "walking",    name: "Walken",        emoji: "🚶", calPerMin: 5,   stepsPerMin: 100 },
  { id: "hiking",     name: "Wandern",       emoji: "🥾", calPerMin: 6,   stepsPerMin: 90  },
  { id: "cycling",    name: "Radfahren",     emoji: "🚴", calPerMin: 8,   stepsPerMin: 0   },
  { id: "swimming",   name: "Schwimmen",     emoji: "🏊", calPerMin: 7.5, stepsPerMin: 0   },
  { id: "hiit",       name: "HIIT",          emoji: "⚡", calPerMin: 12,  stepsPerMin: 50  },
  { id: "strength",   name: "Krafttraining", emoji: "🏋️", calPerMin: 6,   stepsPerMin: 0   },
  { id: "yoga",       name: "Yoga",          emoji: "🧘", calPerMin: 3,   stepsPerMin: 0   },
  { id: "football",   name: "Fußball",       emoji: "⚽", calPerMin: 9,   stepsPerMin: 120 },
  { id: "tennis",     name: "Tennis",        emoji: "🎾", calPerMin: 7.5, stepsPerMin: 70  },
  { id: "climbing",   name: "Klettern",      emoji: "🧗", calPerMin: 8,   stepsPerMin: 0   },
  { id: "dancing",    name: "Tanzen",        emoji: "💃", calPerMin: 5,   stepsPerMin: 60  },
  { id: "basketball", name: "Basketball",    emoji: "🏀", calPerMin: 8.5, stepsPerMin: 110 },
  { id: "boxing",     name: "Boxen",         emoji: "🥊", calPerMin: 11,  stepsPerMin: 0   },
  { id: "rowing",     name: "Rudern",        emoji: "🚣", calPerMin: 8,   stepsPerMin: 0   },
  { id: "other",      name: "Sonstiges",     emoji: "🔥", calPerMin: 6,   stepsPerMin: 0   },
];

const DURATION_PRESETS = [15, 30, 45, 60, 90];

interface Props {
  userId: string;
  onClose: () => void;
  onAdded: () => void;
}

export function AddActivityModal({ userId, onClose, onAdded }: Props) {
  const [activity, setActivity] = useState(ACTIVITIES[0]);
  const [duration, setDuration] = useState(30);
  const [customCal, setCustomCal] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const estimated = Math.round(activity.calPerMin * duration);
  const calories = customCal !== null ? customCal : estimated;
  const estimatedSteps = Math.round(activity.stepsPerMin * duration);

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    await supabase.from("activity_logs").insert({
      user_id: userId,
      activity_type: activity.name,
      duration_minutes: duration,
      calories_burned: calories,
    });

    // Auto-log steps for walking/running activities
    if (estimatedSteps > 0) {
      const { data: existing } = await supabase
        .from("step_logs")
        .select("steps")
        .eq("user_id", userId)
        .eq("logged_at", today)
        .maybeSingle();

      await supabase.from("step_logs").upsert(
        { user_id: userId, steps: (existing?.steps ?? 0) + estimatedSteps, logged_at: today },
        { onConflict: "user_id,logged_at" }
      );
    }

    setSaving(false);
    onAdded();
    onClose();
    router.refresh();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", width: "100%", background: "var(--bg-card)", borderRadius: "24px 24px 0 0", padding: "24px 20px 40px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}>
        {/* Handle */}
        <div style={{ width: "36px", height: "4px", background: "var(--border)", borderRadius: "99px", margin: "0 auto 20px" }} />

        <h2 style={{ fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "20px" }}>
          🔥 Aktivität hinzufügen
        </h2>

        {/* Activity grid */}
        <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "10px" }}>AKTIVITÄT</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "20px" }}>
          {ACTIVITIES.map((a) => (
            <button key={a.id} onClick={() => { setActivity(a); setCustomCal(null); }}
              style={{ background: activity.id === a.id ? "rgba(255,59,48,0.12)" : "var(--bg-hover)", border: activity.id === a.id ? "1px solid rgba(255,59,48,0.4)" : "1px solid var(--border)", borderRadius: "12px", padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "22px" }}>{a.emoji}</span>
              <span style={{ fontSize: "9px", color: activity.id === a.id ? "#FF6B6B" : "var(--text-muted)", fontWeight: activity.id === a.id ? 500 : 400, lineHeight: 1.2, textAlign: "center" }}>{a.name}</span>
            </button>
          ))}
        </div>

        {/* Duration */}
        <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "10px" }}>DAUER (MINUTEN)</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          {DURATION_PRESETS.map((d) => (
            <button key={d} onClick={() => setDuration(d)}
              style={{ flex: 1, padding: "8px 0", background: duration === d ? "rgba(255,59,48,0.12)" : "var(--bg-hover)", border: duration === d ? "1px solid rgba(255,59,48,0.4)" : "1px solid var(--border)", borderRadius: "10px", color: duration === d ? "#FF6B6B" : "var(--text-secondary)", fontSize: "12px", fontWeight: duration === d ? 500 : 400, cursor: "pointer" }}>
              {d}′
            </button>
          ))}
        </div>
        <input type="number" value={duration} min={1} max={480}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={{ width: "100%", padding: "10px 14px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none", marginBottom: "20px" }} />

        {/* Calories */}
        <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "8px" }}>VERBRANNTE KALORIEN</p>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <input type="number" value={customCal !== null ? customCal : estimated} min={0}
            onChange={(e) => setCustomCal(Number(e.target.value))}
            style={{ flex: 1, padding: "12px 14px", background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.25)", borderRadius: "10px", color: "#FF6B6B", fontSize: "18px", fontWeight: 500, outline: "none" }} />
          <button onClick={() => setCustomCal(null)}
            style={{ padding: "12px 14px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" }}>
            ↺ Reset
          </button>
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", flex: 1 }}>
            Schätzwert für {duration} Min {activity.name} — anpassbar
          </p>
          {estimatedSteps > 0 && (
            <span style={{ fontSize: "11px", color: "#5AC8FA", background: "rgba(90,200,250,0.1)", padding: "3px 8px", borderRadius: "6px", whiteSpace: "nowrap" }}>
              🔵 ~{estimatedSteps.toLocaleString("de-DE")} Schritte
            </span>
          )}
        </div>

        <button onClick={save} disabled={saving}
          style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#FF6B6B,#FF3B30)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: saving ? "default" : "pointer" }}>
          {saving ? "Wird gespeichert…" : `✓ ${calories} kcal geloggt`}
        </button>
      </div>
    </div>
  );
}
