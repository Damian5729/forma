"use client";

interface DayData {
  date: string;
  label: string;
  calories: number;
  protein: number;
}

interface Props {
  dayData: DayData[];
  goal: number;
  mode?: "calories" | "protein";
}

export function WeeklyChart({ dayData, goal, mode = "calories" }: Props) {
  const values = dayData.map((d) => (mode === "calories" ? d.calories : d.protein));
  const max = Math.max(...values, goal, 100);
  const goalPct = Math.min((goal / max) * 100, 100);

  return (
    <div style={{ position: "relative" }}>
      {/* Goal line */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: `calc(${goalPct}% + 28px)`, borderTop: "1px dashed rgba(29,158,117,0.4)", pointerEvents: "none", zIndex: 1 }}>
        <span style={{ position: "absolute", right: 0, top: "-16px", fontSize: "10px", color: "var(--accent-light)" }}>Ziel</span>
      </div>

      {/* Bars */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "160px" }}>
        {dayData.map((d, i) => {
          const val = values[i];
          const pct = val > 0 ? Math.min((val / max) * 100, 100) : 0;
          const isToday = i === dayData.length - 1;
          const overGoal = val > goal && goal > 0;

          return (
            <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "10px", color: val > 0 ? (overGoal ? "#E24B4A" : "var(--accent-light)") : "var(--text-muted)" }}>
                {val > 0 ? val : ""}
              </span>
              <div style={{ width: "100%", height: `${Math.max(pct, 2)}%`, background: val === 0 ? "var(--bg-hover)" : overGoal ? "rgba(226,75,74,0.7)" : isToday ? "var(--accent)" : "rgba(29,158,117,0.45)", borderRadius: "6px 6px 0 0", minHeight: "4px", transition: "height 0.4s ease" }} />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        {dayData.map((d, i) => (
          <div key={d.date} style={{ flex: 1, textAlign: "center", fontSize: "11px", color: i === dayData.length - 1 ? "var(--accent-light)" : "var(--text-muted)", fontWeight: i === dayData.length - 1 ? 500 : 400 }}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
