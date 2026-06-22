"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  recipeId: string;
  userId: string;
  initialRating: number | null;
  avgRating: number | null;
  totalRatings: number;
}

export function StarRating({ recipeId, userId, initialRating, avgRating, totalRatings }: Props) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(initialRating ?? 0);
  const [avg, setAvg] = useState(avgRating);
  const [count, setCount] = useState(totalRatings);
  const [saving, setSaving] = useState(false);

  const submit = async (val: number) => {
    if (saving) return;
    setSaving(true);
    setRating(val);
    const supabase = createClient();
    await supabase.from("recipe_ratings").upsert(
      { user_id: userId, recipe_id: recipeId, rating: val },
      { onConflict: "user_id,recipe_id" }
    );
    // Refetch avg
    const { data } = await supabase.from("recipe_ratings").select("rating").eq("recipe_id", recipeId);
    if (data?.length) {
      const a = data.reduce((s, r) => s + r.rating, 0) / data.length;
      setAvg(Math.round(a * 10) / 10);
      setCount(data.length);
    }
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 0" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => submit(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", fontSize: "24px", lineHeight: 1, transition: "transform 0.1s", transform: hover === star ? "scale(1.2)" : "scale(1)" }}
          >
            <span style={{ color: star <= (hover || rating) ? "#EF9F27" : "var(--text-muted)" }}>★</span>
          </button>
        ))}
      </div>
      {avg !== null && (
        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          <span style={{ color: "#EF9F27", fontWeight: 500 }}>{avg}</span> / 5 ({count} {count === 1 ? "Bewertung" : "Bewertungen"})
        </div>
      )}
      {rating === 0 && avg === null && (
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Noch keine Bewertungen</span>
      )}
    </div>
  );
}
