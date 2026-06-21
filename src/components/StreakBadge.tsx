"use client";

interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  if (streak === 0) return null;

  const emoji = streak >= 30 ? "🔥" : streak >= 7 ? "⚡" : "✦";
  const label = streak >= 30 ? "Monats-Streak!" : streak >= 7 ? "Wochen-Streak!" : `${streak} Tage`;

  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "5px 12px",
        background: streak >= 7 ? "rgba(239,159,39,0.15)" : "var(--accent-bg)",
        border: `1px solid ${streak >= 7 ? "rgba(239,159,39,0.3)" : "rgba(29,158,117,0.25)"}`,
        borderRadius: "99px",
        fontSize: "12px",
        color: streak >= 7 ? "#EF9F27" : "var(--accent-light)",
        fontWeight: 500,
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}
