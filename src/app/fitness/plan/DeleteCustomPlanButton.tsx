"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteCustomPlanButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    await fetch(`/api/custom-plans/${planId}`, { method: "DELETE" });
    router.refresh();
  };

  if (confirming) {
    return (
      <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "4px" }}>
        <button
          onClick={handleDelete}
          style={{ fontSize: "11px", padding: "3px 8px", background: "#E24B4A", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Löschen
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{ fontSize: "11px", padding: "3px 8px", background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer" }}
        >
          Nein
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); setConfirming(true); }}
      style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer", lineHeight: 1, padding: "2px 6px" }}
      title="Plan löschen"
    >
      ···
    </button>
  );
}
