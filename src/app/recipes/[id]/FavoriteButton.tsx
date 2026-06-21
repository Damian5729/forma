"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  recipeId: string;
  userId: string;
  initialFav: boolean;
}

export function FavoriteButton({ recipeId, userId, initialFav }: Props) {
  const [fav, setFav] = useState(initialFav);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    if (fav) {
      await supabase.from("recipe_favorites").delete().eq("user_id", userId).eq("recipe_id", recipeId);
    } else {
      await supabase.from("recipe_favorites").insert({ user_id: userId, recipe_id: recipeId });
    }
    setFav(!fav);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={fav ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
      style={{
        padding: "12px 18px",
        background: fav ? "rgba(226,75,74,0.15)" : "var(--bg-hover)",
        border: fav ? "1px solid rgba(226,75,74,0.3)" : "1px solid var(--border)",
        borderRadius: "10px",
        color: fav ? "#E24B4A" : "var(--text-secondary)",
        fontSize: "18px",
        cursor: loading ? "default" : "pointer",
        transition: "all 0.15s",
        lineHeight: 1,
      }}
    >
      {fav ? "♥" : "♡"}
    </button>
  );
}
