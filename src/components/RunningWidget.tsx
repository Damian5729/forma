"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Workout {
  name: string;
  type: string;
  duration: number;
  distance?: string;
  description: string;
  structure: string;
  effort: string;
}

interface Props {
  userId: string;
  planId: string;
  planName: string;
  weekNum: number;
  dayNum: number;
  weeksTotal: number;
  workout: Workout;
  alreadyDone: boolean;
}

const effortColor: Record<string, string> = {
  Leicht: "#1D9E75",
  Mittel: "#EF9F27",
  Hart: "#E24B4A",
};

export function RunningWidget({ userId, planId, planName, weekNum, dayNum, weeksTotal, workout, alreadyDone }: Props) {
  const [done, setDone] = useState(alreadyDone);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const markDone = async () => {
    if (done || loading) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("running_completions").insert({
      user_id: userId,
      plan_id: planId,
      week_num: weekNum,
      day_num: dayNum,
    });
    setDone(true);
    setLoading(false);
    router.refresh();
  };

  return (
    <div style={{ background: "linear-gradient(135deg,#1a1208 0%,#141418 60%)", border: `1px solid ${done ? "rgba(29,158,117,0.4)" : "rgba(239,159,39,0.3)"}`, borderRadius: "20px", padding: "18px 20px", marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <p style={{ fontSize: "10px", color: "#EF9F27", letterSpacing: "0.8px", fontWeight: 600, marginBottom: "3px" }}>
            🏃 LAUFPLAN · WOCHE {weekNum}/{weeksTotal}
          </p>
          <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
            {workout.name}
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{planName}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <span style={{ fontSize: "10px", color: effortColor[workout.effort], background: `${effortColor[workout.effort]}18`, padding: "3px 8px", borderRadius: "99px" }}>
            {workout.effort}
          </span>
          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{workout.type}</span>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "10px" }}>
        {workout.description}
      </p>

      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "8px 10px", fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace", lineHeight: 1.6, marginBottom: "12px" }}>
        {workout.structure}
      </div>

      <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>⏱ {workout.duration} Min</span>
        {workout.distance && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>📍 {workout.distance}</span>}
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        {done ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "12px", flex: 1 }}>
            <span style={{ fontSize: "16px" }}>✓</span>
            <span style={{ fontSize: "13px", color: "#5DCAA5", fontWeight: 500 }}>Lauf geschafft!</span>
          </div>
        ) : (
          <button
            onClick={markDone}
            disabled={loading}
            style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg,#EF9F27,#d4861a)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer", opacity: loading ? 0.7 : 1, textAlign: "center" }}>
            {loading ? "…" : "Lauf geschafft ✓"}
          </button>
        )}
        <Link href="/fitness/running/log" style={{ padding: "11px 16px", background: "rgba(239,159,39,0.1)", border: "1px solid rgba(239,159,39,0.25)", borderRadius: "12px", color: "#EF9F27", fontSize: "13px", textDecoration: "none", whiteSpace: "nowrap" }}>
          Lauf loggen
        </Link>
      </div>
    </div>
  );
}
