"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  planId: string;
  userId: string;
  isActive: boolean;
}

export function RunStartButton({ planId, userId, isActive }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("user_profiles").update({
      active_running_plan_id: planId,
      active_running_plan_started_at: new Date().toISOString().split("T")[0],
    }).eq("id", userId);
    setLoading(false);
    router.refresh();
  };

  const handleStop = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("user_profiles").update({
      active_running_plan_id: null,
      active_running_plan_started_at: null,
    }).eq("id", userId);
    setLoading(false);
    router.refresh();
  };

  if (isActive) {
    return (
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(29,158,117,0.12)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "12px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1D9E75", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "13px", color: "#5DCAA5", fontWeight: 500 }}>Aktiver Plan</span>
        </div>
        <button
          onClick={handleStop}
          disabled={loading}
          style={{ padding: "10px 18px", background: "transparent", border: "1px solid rgba(226,75,74,0.4)", borderRadius: "12px", color: "#E24B4A", fontSize: "13px", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "…" : "Plan beenden"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      style={{ padding: "12px 28px", background: "#EF9F27", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
      {loading ? "Starte…" : "▶ Plan starten"}
    </button>
  );
}
