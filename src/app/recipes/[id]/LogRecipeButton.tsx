"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  recipe: { id: string; title: string; calories: number; protein: number; carbs: number; fat: number };
  userId: string;
}

const mealTypes = [
  { val: "breakfast", label: "Frühstück" },
  { val: "lunch", label: "Mittagessen" },
  { val: "dinner", label: "Abendessen" },
  { val: "snack", label: "Snack" },
];

export function LogRecipeButton({ recipe, userId }: Props) {
  const router = useRouter();
  const [mealType, setMealType] = useState("lunch");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleLog = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("meal_logs").insert({
      user_id: userId,
      name: recipe.title,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      meal_type: mealType,
    });
    setLoading(false);
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px" }}>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 10px", letterSpacing: "0.3px" }}>
        ALS MAHLZEIT LOGGEN
      </p>
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
        {mealTypes.map((t) => (
          <button key={t.val} onClick={() => setMealType(t.val)} style={{ padding: "5px 10px", fontSize: "11px", background: mealType === t.val ? "var(--accent-bg)" : "var(--bg-hover)", border: mealType === t.val ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "6px", color: mealType === t.val ? "var(--accent-light)" : "var(--text-secondary)", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleLog}
        disabled={loading || done}
        style={{ width: "100%", padding: "11px", background: done ? "var(--accent-bg)" : "var(--accent)", border: "none", borderRadius: "8px", color: done ? "var(--accent-light)" : "#fff", fontSize: "14px", fontWeight: 500, cursor: loading || done ? "default" : "pointer" }}
      >
        {done ? "✓ Geloggt! Weiterleitung…" : loading ? "Wird gespeichert…" : `+ ${recipe.calories} kcal eintragen`}
      </button>
    </div>
  );
}
