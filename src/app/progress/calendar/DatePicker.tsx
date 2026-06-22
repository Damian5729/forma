"use client";

import { useRouter } from "next/navigation";

export function DatePicker({ value, max }: { value: string; max: string }) {
  const router = useRouter();
  return (
    <input
      type="date"
      value={value}
      max={max}
      onChange={(e) => {
        if (e.target.value) router.push(`/progress/calendar?date=${e.target.value}`);
      }}
      style={{
        padding: "8px 10px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        color: "var(--text-primary)",
        fontSize: "13px",
        cursor: "pointer",
      }}
    />
  );
}
