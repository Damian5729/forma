"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function MonthCalendar({ mealDays, workoutDays }: { mealDays: string[]; workoutDays: string[] }) {
  const router = useRouter();
  const todayStr = fmt(new Date());
  const [view, setView] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const meals = new Set(mealDays);
  const workouts = new Set(workoutDays);

  const firstDay = new Date(view.year, view.month, 1);
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  // Monday = 0 offset
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 });
  const nextMonth = () => setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 });

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", marginBottom: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <button onClick={prevMonth} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "15px", cursor: "pointer" }}>‹</button>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{MONTHS[view.month]} {view.year}</span>
        <button onClick={nextMonth} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "15px", cursor: "pointer" }}>›</button>
      </div>

      {/* Weekday labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "6px" }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: "center", fontSize: "10px", color: "var(--text-muted)", fontWeight: 500 }}>{w}</div>
        ))}
      </div>

      {/* Days */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px" }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const dateStr = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const isFuture = dateStr > todayStr;
          const hasMeal = meals.has(dateStr);
          const hasWorkout = workouts.has(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => { if (!isFuture) router.push(`/progress/calendar?date=${dateStr}`); }}
              disabled={isFuture}
              style={{
                position: "relative", aspectRatio: "1", borderRadius: "9px",
                background: isToday ? "var(--accent)" : hasMeal || hasWorkout ? "var(--g-green-dark)" : "transparent",
                border: isToday ? "none" : hasMeal || hasWorkout ? "1px solid rgba(29,158,117,0.25)" : "1px solid transparent",
                color: isToday ? "#fff" : isFuture ? "var(--text-muted)" : "var(--text-primary)",
                fontSize: "12px", fontWeight: isToday ? 600 : 400,
                cursor: isFuture ? "default" : "pointer",
                opacity: isFuture ? 0.4 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {day}
              {/* Activity dots */}
              {(hasMeal || hasWorkout) && (
                <div style={{ position: "absolute", bottom: "3px", display: "flex", gap: "2px" }}>
                  {hasMeal && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: isToday ? "#fff" : "#1D9E75" }} />}
                  {hasWorkout && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: isToday ? "#fff" : "#5B8DD9" }} />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "12px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "var(--text-muted)" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1D9E75" }} /> Mahlzeiten
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "var(--text-muted)" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5B8DD9" }} /> Training
        </span>
      </div>
    </div>
  );
}
