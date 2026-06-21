"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface FoodResult {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Ingredient {
  food: FoodResult;
  grams: number;
}

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

const mealTypes = [
  { val: "breakfast", label: "Frühstück" },
  { val: "lunch", label: "Mittagessen" },
  { val: "dinner", label: "Abendessen" },
  { val: "snack", label: "Snack" },
];

function scaled(food: FoodResult, grams: number) {
  const s = grams / 100;
  return {
    calories: Math.round(food.calories * s),
    protein: Math.round(food.protein * s * 10) / 10,
    carbs: Math.round(food.carbs * s * 10) / 10,
    fat: Math.round(food.fat * s * 10) / 10,
  };
}

export function AddMealModal({ onClose, onAdded }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [mealType, setMealType] = useState("lunch");
  const [mealName, setMealName] = useState("");
  const [saving, setSaving] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setSearching(true);
      const res = await fetch(`/api/food-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.products ?? []);
      setSearching(false);
    }, 350);
  }, [query]);

  // Auto-generate meal name from ingredients
  useEffect(() => {
    if (ingredients.length === 0) { setMealName(""); return; }
    const names = ingredients.map((i) => i.food.name);
    if (names.length === 1) setMealName(names[0]);
    else if (names.length === 2) setMealName(`${names[0]} mit ${names[1]}`);
    else setMealName(`${names[0]} mit ${names.slice(1).join(", ")}`);
  }, [ingredients]);

  const addIngredient = (food: FoodResult) => {
    setIngredients((prev) => {
      const exists = prev.findIndex((i) => i.food.name === food.name);
      if (exists >= 0) return prev;
      return [...prev, { food, grams: 100 }];
    });
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const updateGrams = (idx: number, grams: number) => {
    setIngredients((prev) => prev.map((i, n) => n === idx ? { ...i, grams } : i));
  };

  const removeIngredient = (idx: number) => {
    setIngredients((prev) => prev.filter((_, n) => n !== idx));
  };

  const totals = ingredients.reduce(
    (acc, ing) => {
      const s = scaled(ing.food, ing.grams);
      return {
        calories: acc.calories + s.calories,
        protein: Math.round((acc.protein + s.protein) * 10) / 10,
        carbs: Math.round((acc.carbs + s.carbs) * 10) / 10,
        fat: Math.round((acc.fat + s.fat) * 10) / 10,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleSave = async () => {
    if (ingredients.length === 0) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("meal_logs").insert({
      user_id: user.id,
      name: mealName || "Mahlzeit",
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      meal_type: mealType,
    });

    setSaving(false);
    onAdded();
    onClose();
  };

  const s: Record<string, React.CSSProperties> = {
    input: {
      width: "100%", padding: "11px 14px",
      background: "var(--bg-hover)",
      border: "1px solid var(--border)",
      borderRadius: "10px",
      color: "var(--text-primary)", fontSize: "14px", outline: "none",
    },
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "100%", maxWidth: "520px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          display: "flex", flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>
              Mahlzeit zusammenstellen
            </h2>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "20px", cursor: "pointer" }}>×</button>
          </div>

          {/* Meal type */}
          <div style={{ display: "flex", gap: "6px" }}>
            {mealTypes.map((t) => (
              <button key={t.val} onClick={() => setMealType(t.val)} style={{
                flex: 1, padding: "6px 4px", fontSize: "11px",
                background: mealType === t.val ? "var(--accent-bg)" : "var(--bg-hover)",
                border: mealType === t.val ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)",
                borderRadius: "8px",
                color: mealType === t.val ? "var(--accent-light)" : "var(--text-secondary)",
                cursor: "pointer",
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px" }}>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <input
              ref={inputRef}
              style={s.input}
              placeholder="Zutat suchen… Hähnchen, Reis, Brokkoli…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {searching && (
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "var(--text-muted)" }}>
                Suche…
              </span>
            )}
          </div>

          {/* Search results */}
          {results.length > 0 && (
            <div style={{ marginBottom: "16px", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => addIngredient(r)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: i % 2 === 0 ? "var(--bg-hover)" : "var(--bg-card)",
                    border: "none",
                    borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none",
                    textAlign: "left", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{r.name}</span>
                    {r.brand && <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "6px" }}>{r.brand}</span>}
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                    <span style={{ fontSize: "11px", color: "var(--accent-light)" }}>{r.protein}g P</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{r.calories} kcal</span>
                    <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 500 }}>+</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searching && query.length >= 2 && results.length === 0 && (
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
              Nichts gefunden — anderen Begriff versuchen
            </p>
          )}

          {/* Ingredient list */}
          {ingredients.length > 0 && (
            <div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 8px", letterSpacing: "0.5px" }}>
                ZUTATEN ({ingredients.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {ingredients.map((ing, idx) => {
                  const s2 = scaled(ing.food, ing.grams);
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-hover)", border: "1px solid var(--border)",
                        borderRadius: "10px", padding: "12px 14px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{ing.food.name}</span>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", color: "var(--accent-light)" }}>{s2.calories} kcal</span>
                          <button
                            onClick={() => removeIngredient(idx)}
                            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer", lineHeight: 1, padding: "0 2px" }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="range" min={10} max={500} step={5}
                          value={ing.grams}
                          onChange={(e) => updateGrams(idx, Number(e.target.value))}
                          style={{ flex: 1 }}
                        />
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", minWidth: "50px", textAlign: "right" }}>
                          {ing.grams} g
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                        {[
                          { label: "P", val: `${s2.protein}g`, color: "var(--accent-light)" },
                          { label: "K", val: `${s2.carbs}g`, color: "var(--text-secondary)" },
                          { label: "F", val: `${s2.fat}g`, color: "var(--text-secondary)" },
                        ].map((m) => (
                          <span key={m.label} style={{ fontSize: "11px", color: m.color }}>
                            {m.label} {m.val}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div
                style={{
                  background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)",
                  borderRadius: "10px", padding: "14px 16px", marginBottom: "14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", letterSpacing: "0.3px" }}>GESAMT</span>
                  <span style={{ fontSize: "20px", fontWeight: 500, color: "var(--accent-light)" }}>{totals.calories} kcal</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {[
                    { label: "Protein", val: `${totals.protein}g`, color: "var(--accent-light)" },
                    { label: "Carbs", val: `${totals.carbs}g`, color: "var(--text-primary)" },
                    { label: "Fett", val: `${totals.fat}g`, color: "var(--text-primary)" },
                  ].map((m) => (
                    <div key={m.label} style={{ background: "var(--bg-card)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "2px" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal name */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                  Name der Mahlzeit
                </label>
                <input
                  style={{ ...s.input, fontSize: "14px" }}
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="z.B. Hähnchen mit Reis und Brokkoli"
                />
              </div>
            </div>
          )}

          {ingredients.length === 0 && query.length < 2 && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "32px", color: "var(--text-muted)", marginBottom: "10px" }}>⬡</div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                Suche nach Zutaten und füge sie hinzu
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {ingredients.length > 0 && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: "100%", padding: "13px",
                background: saving ? "var(--bg-hover)" : "var(--accent)",
                border: "none", borderRadius: "10px",
                color: saving ? "var(--text-muted)" : "#fff",
                fontSize: "15px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Wird gespeichert…" : `${totals.calories} kcal speichern`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
