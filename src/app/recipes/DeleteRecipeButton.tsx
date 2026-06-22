"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("recipes").delete().eq("id", recipeId);
    router.push("/recipes?mine=1");
    router.refresh();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirm(false);
  };

  if (confirm) {
    return (
      <div style={{ display: "flex", gap: "5px" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleDelete} disabled={deleting}
          style={{ padding: "4px 10px", background: "#E24B4A", border: "none", borderRadius: "7px", color: "#fff", fontSize: "11px", fontWeight: 500, cursor: "pointer" }}>
          {deleting ? "…" : "Löschen"}
        </button>
        <button onClick={handleCancel}
          style={{ padding: "4px 8px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text-muted)", fontSize: "11px", cursor: "pointer" }}>
          Nein
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleDelete}
      title="Rezept löschen"
      style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(226,75,74,0.12)", border: "1px solid rgba(226,75,74,0.25)", color: "#E24B4A", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      ×
    </button>
  );
}
