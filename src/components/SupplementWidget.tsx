"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Supplement {
  id: string;
  name: string;
  dose: string | null;
  time_of_day: string;
  emoji: string;
}

interface Props {
  userId: string;
  supplements: Supplement[];
  doneIds: string[];
  today: string;
}

const TIME_ORDER = ["morning", "afternoon", "evening", "night"];
const TIME_LABEL: Record<string, string> = {
  morning: "Morgens",
  afternoon: "Mittags",
  evening: "Abends",
  night: "Nachts",
};

export function SupplementWidget({ userId, supplements, doneIds, today }: Props) {
  const [done, setDone] = useState<Set<string>>(new Set(doneIds));
  const router = useRouter();
  const supabase = createClient();

  const toggle = async (id: string) => {
    const isNowDone = !done.has(id);
    setDone((prev) => { const n = new Set(prev); isNowDone ? n.add(id) : n.delete(id); return n; });
    if (isNowDone) {
      await supabase.from("supplement_logs").insert({ user_id: userId, supplement_id: id, logged_date: today });
    } else {
      await supabase.from("supplement_logs").delete().eq("user_id", userId).eq("supplement_id", id).eq("logged_date", today);
    }
    router.refresh();
  };

  const totalDone = done.size;
  const totalCount = supplements.length;

  if (supplements.length === 0) {
    return (
      <Link href="/supplements/plan" style={{ display: "block", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px 18px", marginBottom: "10px", textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>💊</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Supplement Plan</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0" }}>Plan einrichten →</p>
          </div>
        </div>
      </Link>
    );
  }

  const grouped = TIME_ORDER.reduce((acc, t) => {
    const items = supplements.filter((s) => s.time_of_day === t);
    if (items.length) acc[t] = items;
    return acc;
  }, {} as Record<string, Supplement[]>);

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>💊</span>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>Supplement Plan</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: totalDone === totalCount ? "var(--accent-light)" : "var(--text-muted)" }}>
            {totalDone}/{totalCount} heute
          </span>
          <Link href="/supplements/plan" style={{ fontSize: "11px", color: "var(--text-muted)", textDecoration: "none" }}>verwalten →</Link>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "2px", background: "var(--bg-hover)", marginBottom: "4px" }}>
        <div style={{ height: "100%", width: `${totalCount > 0 ? (totalDone / totalCount) * 100 : 0}%`, background: "linear-gradient(90deg,#8B5CF6,#A78BFA)", transition: "width 0.5s ease" }} />
      </div>

      <div style={{ padding: "6px 14px 14px" }}>
        {Object.entries(grouped).map(([time, items]) => (
          <div key={time} style={{ marginTop: "10px" }}>
            <p style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.8px", marginBottom: "6px" }}>{TIME_LABEL[time]?.toUpperCase()}</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {items.map((s) => {
                const isDone = done.has(s.id);
                return (
                  <button key={s.id} onClick={() => toggle(s.id)}
                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", background: isDone ? "rgba(29,158,117,0.1)" : "var(--bg-hover)", border: `1px solid ${isDone ? "rgba(29,158,117,0.3)" : "var(--border)"}`, borderRadius: "99px", cursor: "pointer", transition: "all 0.2s" }}>
                    <span style={{ fontSize: "13px" }}>{s.emoji}</span>
                    <span style={{ fontSize: "11px", color: isDone ? "var(--accent-light)" : "var(--text-secondary)", textDecoration: isDone ? "line-through" : "none" }}>{s.name}</span>
                    {isDone && <span style={{ fontSize: "10px", color: "var(--accent-light)" }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
