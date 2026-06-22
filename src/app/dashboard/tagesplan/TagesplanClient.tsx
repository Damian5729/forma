"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Recipe {
  id: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  duration: number;
  tags: string[];
  ingredients?: { name: string; amount: string }[];
}

interface Slot {
  type: "breakfast" | "lunch" | "dinner" | "snack";
  label: string;
  emoji: string;
  targetPct: number;
  tags: string[];
  recipe: Recipe | null;
}

const DEFINITIONS: Array<{ type: Slot["type"]; label: string; emoji: string; pct: number; tags: string[] }> = [
  { type: "breakfast", label: "Frühstück", emoji: "🌅", pct: 0.25, tags: ["Frühstück", "Snack", "Schnell"] },
  { type: "lunch", label: "Mittagessen", emoji: "☀️", pct: 0.35, tags: ["Mittagessen", "High-Protein", "Meal-Prep"] },
  { type: "dinner", label: "Abendessen", emoji: "🌙", pct: 0.30, tags: ["Abendessen", "Low-Carb", "High-Protein"] },
  { type: "snack", label: "Snack", emoji: "⚡", pct: 0.10, tags: ["Snack", "Schnell", "Frühstück"] },
];

function bestPick(recipes: Recipe[], tags: string[], targetCal: number, exclude: Set<string>, random = false): Recipe | null {
  const candidates = recipes.filter((r) => !exclude.has(r.id) && r.tags.some((t) => tags.includes(t)));
  if (!candidates.length) return null;
  const sorted = [...candidates].sort((a, b) => Math.abs(a.calories - targetCal) - Math.abs(b.calories - targetCal));
  const pool = sorted.slice(0, Math.min(5, sorted.length));
  return random ? pool[Math.floor(Math.random() * pool.length)] : pool[0];
}

function buildSlots(recipes: Recipe[], remaining: number, random = false): Slot[] {
  const used = new Set<string>();
  return DEFINITIONS.map((d) => {
    const recipe = bestPick(recipes, d.tags, Math.round(remaining * d.pct), used, random);
    if (recipe) used.add(recipe.id);
    return { ...d, targetPct: d.pct, recipe };
  });
}

function alternativesFor(recipes: Recipe[], slot: Slot, exclude: Set<string>): Recipe[] {
  return recipes
    .filter((r) => r.id !== slot.recipe?.id && !exclude.has(r.id) && r.tags.some((t) => slot.tags.includes(t)))
    .sort((a, b) => Math.abs(a.calories - Math.round(200 * slot.targetPct * 5)) - Math.abs(b.calories - Math.round(200 * slot.targetPct * 5)))
    .slice(0, 8);
}

export function TagesplanClient({
  recipes,
  userId,
  consumed,
  goal,
}: {
  recipes: Recipe[];
  userId: string;
  consumed: number;
  goal: number;
}) {
  const remaining = Math.max(goal - consumed, 200);
  const [slots, setSlots] = useState<Slot[]>(() => buildSlots(recipes, remaining));
  const [logging, setLogging] = useState(false);
  const [logged, setLogged] = useState(false);
  const [tab, setTab] = useState<"plan" | "shopping">("plan");
  const [swappingSlot, setSwappingSlot] = useState<Slot["type"] | null>(null);
  const router = useRouter();

  const regenerate = () => { setSlots(buildSlots(recipes, remaining, true)); setSwappingSlot(null); };

  const swapRecipe = (slotType: Slot["type"], recipe: Recipe) => {
    setSlots((prev) => prev.map((s) => s.type === slotType ? { ...s, recipe } : s));
    setSwappingSlot(null);
  };

  const logAll = async () => {
    setLogging(true);
    const supabase = createClient();
    const rows = slots.filter((s) => s.recipe).map((s) => ({
      user_id: userId,
      name: s.recipe!.title,
      calories: s.recipe!.calories,
      protein: s.recipe!.protein,
      carbs: s.recipe!.carbs,
      fat: s.recipe!.fat,
      meal_type: s.type,
    }));
    await supabase.from("meal_logs").insert(rows);
    setLogging(false);
    setLogged(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  const planTotal = slots.reduce((s, sl) => s + (sl.recipe?.calories ?? 0), 0);
  const planProtein = slots.reduce((s, sl) => s + (sl.recipe?.protein ?? 0), 0);

  // Aggregate ingredients for shopping list
  const shoppingMap = new Map<string, { amounts: string[]; from: string[] }>();
  slots.forEach((sl) => {
    if (!sl.recipe?.ingredients) return;
    sl.recipe.ingredients.forEach((ing) => {
      const key = ing.name.toLowerCase();
      if (shoppingMap.has(key)) {
        shoppingMap.get(key)!.amounts.push(ing.amount);
        shoppingMap.get(key)!.from.push(sl.recipe!.title);
      } else {
        shoppingMap.set(key, { amounts: [ing.amount], from: [sl.recipe!.title] });
      }
    });
  });
  const shoppingItems = [...shoppingMap.entries()].map(([name, v]) => ({ name, amounts: v.amounts, from: [...new Set(v.from)] }));

  const usedIds = new Set(slots.map((s) => s.recipe?.id).filter(Boolean) as string[]);

  return (
    <div>
      {/* Stats */}
      <div className="grid-3col" style={{ marginBottom: "16px" }}>
        {[
          { label: "Plan gesamt", val: `${planTotal} kcal`, color: "var(--text-primary)" },
          { label: "Protein", val: `${Math.round(planProtein)}g`, color: "#5DCAA5" },
          { label: "Noch übrig", val: `${remaining} kcal`, color: remaining > 0 ? "var(--accent-light)" : "#E24B4A" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 500, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button onClick={() => setTab("plan")}
          style={{ flex: 1, minWidth: "100px", padding: "10px", fontSize: "13px", fontWeight: 500, background: tab === "plan" ? "var(--accent-bg)" : "var(--bg-card)", border: tab === "plan" ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "10px", color: tab === "plan" ? "var(--accent-light)" : "var(--text-secondary)", cursor: "pointer" }}>
          📋 Tagesplan
        </button>
        <button onClick={() => setTab("shopping")}
          style={{ flex: 1, minWidth: "100px", padding: "10px", fontSize: "13px", fontWeight: 500, background: tab === "shopping" ? "var(--accent-bg)" : "var(--bg-card)", border: tab === "shopping" ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "10px", color: tab === "shopping" ? "var(--accent-light)" : "var(--text-secondary)", cursor: "pointer" }}>
          🛒 Einkaufsliste
        </button>
        <Link href="/dashboard/wochenplan"
          style={{ flex: "0 0 auto", padding: "10px 14px", fontSize: "13px", fontWeight: 500, background: "var(--g-purple)", border: "1px solid rgba(93,202,165,0.15)", borderRadius: "10px", color: "var(--text-secondary)", textDecoration: "none", whiteSpace: "nowrap" }}>
          📅 Wochenplan
        </Link>
      </div>

      {/* Plan view */}
      {tab === "plan" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {slots.map((sl) => (
            <div key={sl.type}>
              <div style={{ background: "var(--bg-card)", border: swappingSlot === sl.type ? "1px solid rgba(29,158,117,0.5)" : "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: "18px" }}>{sl.emoji}</span>
                  <span style={{ fontSize: "12px", color: "var(--accent-light)", fontWeight: 500, letterSpacing: "0.5px" }}>{sl.label.toUpperCase()}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "auto" }}>~{Math.round(remaining * sl.targetPct)} kcal</span>
                  <button
                    onClick={() => setSwappingSlot(swappingSlot === sl.type ? null : sl.type)}
                    style={{ padding: "4px 10px", background: swappingSlot === sl.type ? "var(--accent-bg)" : "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "8px", color: swappingSlot === sl.type ? "var(--accent-light)" : "var(--text-muted)", fontSize: "11px", cursor: "pointer" }}>
                    ↔ Tauschen
                  </button>
                </div>

                {sl.recipe ? (
                  <div style={{ padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/recipes/${sl.recipe.id}`} style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none", display: "block", marginBottom: "4px" }}>
                        {sl.recipe.title}
                      </Link>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "var(--accent-light)" }}>{sl.recipe.calories} kcal</span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>P: {sl.recipe.protein}g</span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>◷ {sl.recipe.duration} Min</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {sl.recipe.tags.slice(0, 2).map((t) => (
                        <span key={t} style={{ fontSize: "9px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "3px 7px", borderRadius: "99px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Kein passendes Rezept gefunden</p>
                  </div>
                )}
              </div>

              {/* Swap picker */}
              {swappingSlot === sl.type && (
                <div style={{ marginTop: "6px", background: "var(--bg-card)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "var(--accent-light)", fontWeight: 500 }}>Alternative wählen</span>
                    <button onClick={() => setSwappingSlot(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>×</button>
                  </div>
                  {alternativesFor(recipes, sl, usedIds).map((r) => (
                    <button key={r.id} onClick={() => swapRecipe(sl.type, r)}
                      style={{ width: "100%", padding: "12px 14px", background: "none", border: "none", borderTop: "1px solid var(--border)", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "2px" }}>{r.title}</div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{r.tags.slice(0, 2).join(" · ")}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "13px", color: "var(--accent-light)", fontWeight: 500 }}>{r.calories} kcal</div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>P: {r.protein}g</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Shopping list */}
      {tab === "shopping" && (
        <div style={{ marginBottom: "20px" }}>
          {shoppingItems.length === 0 ? (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "32px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Rezepte ohne Zutaten-Daten.</p>
            </div>
          ) : (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>🛒 {shoppingItems.length} Zutaten</span>
                <button
                  onClick={() => {
                    const text = shoppingItems.map((i) => `${i.name} – ${i.amounts.join(", ")}`).join("\n");
                    navigator.clipboard.writeText(text);
                  }}
                  style={{ fontSize: "11px", color: "var(--accent-light)", background: "none", border: "none", cursor: "pointer" }}>
                  Kopieren
                </button>
              </div>
              {shoppingItems.map((item, i) => (
                <div key={item.name} style={{ padding: "12px 16px", borderTop: i > 0 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", textTransform: "capitalize" }}>{item.name}</span>
                    {item.from.length > 1 && <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "6px" }}>({item.from.join(", ")})</span>}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--accent-light)", marginLeft: "12px", whiteSpace: "nowrap" }}>{item.amounts.join(" + ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={logAll} disabled={logging || logged} className="glow-green"
          style={{ flex: 1, padding: "14px", background: logged ? "#1D9E75" : "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: logging || logged ? "default" : "pointer" }}>
          {logged ? "✓ Geloggt! Weiter…" : logging ? "Wird geloggt…" : "✓ Alles in einem loggen"}
        </button>
        <button onClick={regenerate}
          style={{ padding: "14px 20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text-primary)", fontSize: "14px", cursor: "pointer" }}>
          ↺ Neu
        </button>
      </div>
    </div>
  );
}
