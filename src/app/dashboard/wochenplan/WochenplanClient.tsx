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

interface DaySlot {
  type: "breakfast" | "lunch" | "dinner" | "snack";
  label: string;
  emoji: string;
  pct: number;
  tags: string[];
  recipe: Recipe | null;
}

interface WeekDay {
  label: string;
  date: string;
  slots: DaySlot[];
}

const SLOT_DEFS: Array<{ type: DaySlot["type"]; label: string; emoji: string; pct: number; tags: string[] }> = [
  { type: "breakfast", label: "Frühstück", emoji: "🌅", pct: 0.25, tags: ["Frühstück", "Snack", "Schnell"] },
  { type: "lunch", label: "Mittagessen", emoji: "☀️", pct: 0.35, tags: ["Mittagessen", "High-Protein", "Meal-Prep"] },
  { type: "dinner", label: "Abendessen", emoji: "🌙", pct: 0.30, tags: ["Abendessen", "Low-Carb", "High-Protein"] },
  { type: "snack", label: "Snack", emoji: "⚡", pct: 0.10, tags: ["Snack", "Schnell", "Frühstück"] },
];

const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function pickRandom(recipes: Recipe[], tags: string[], targetCal: number, exclude: Set<string>): Recipe | null {
  const candidates = recipes.filter((r) => !exclude.has(r.id) && r.tags.some((t) => tags.includes(t)));
  if (!candidates.length) return null;
  const sorted = [...candidates].sort((a, b) => Math.abs(a.calories - targetCal) - Math.abs(b.calories - targetCal));
  const pool = sorted.slice(0, Math.min(6, sorted.length));
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildWeek(recipes: Recipe[], dailyGoal: number): WeekDay[] {
  const today = new Date();
  const monday = new Date(today);
  const dow = today.getDay();
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const date = d.toISOString().split("T")[0];
    const used = new Set<string>();
    const slots: DaySlot[] = SLOT_DEFS.map((def) => {
      const recipe = pickRandom(recipes, def.tags, Math.round(dailyGoal * def.pct), used);
      if (recipe) used.add(recipe.id);
      return { ...def, recipe };
    });
    return { label: DAY_LABELS[i], date, slots };
  });
}

function alternativesFor(recipes: Recipe[], slot: DaySlot, excluded: Set<string>): Recipe[] {
  return recipes
    .filter((r) => !excluded.has(r.id) && r.tags.some((t) => slot.tags.includes(t)))
    .sort((a, b) => Math.abs(a.calories - Math.round(500 * slot.pct * 4)) - Math.abs(b.calories - Math.round(500 * slot.pct * 4)))
    .slice(0, 8);
}

export function WochenplanClient({
  recipes,
  userId,
  dailyGoal,
}: {
  recipes: Recipe[];
  userId: string;
  dailyGoal: number;
}) {
  const [week, setWeek] = useState<WeekDay[]>(() => buildWeek(recipes, dailyGoal));
  const [activeDay, setActiveDay] = useState(0);
  const [tab, setTab] = useState<"plan" | "shopping">("plan");
  const [swapping, setSwapping] = useState<{ day: number; slot: DaySlot["type"] } | null>(null);
  const [logging, setLogging] = useState(false);
  const [loggedDays, setLoggedDays] = useState<Set<number>>(new Set());
  const router = useRouter();

  const regenerateDay = (dayIdx: number) => {
    setWeek((prev) => prev.map((d, i) => i === dayIdx ? { ...d, slots: buildWeek(recipes, dailyGoal)[dayIdx].slots } : d));
    setSwapping(null);
  };

  const swapSlot = (dayIdx: number, slotType: DaySlot["type"], recipe: Recipe) => {
    setWeek((prev) => prev.map((d, i) => i === dayIdx
      ? { ...d, slots: d.slots.map((s) => s.type === slotType ? { ...s, recipe } : s) }
      : d));
    setSwapping(null);
  };

  const logDay = async (dayIdx: number) => {
    setLogging(true);
    const supabase = createClient();
    const day = week[dayIdx];
    const rows = day.slots.filter((s) => s.recipe).map((s) => ({
      user_id: userId,
      name: s.recipe!.title,
      calories: s.recipe!.calories,
      protein: s.recipe!.protein,
      carbs: s.recipe!.carbs,
      fat: s.recipe!.fat,
      meal_type: s.type,
      logged_at: new Date(`${day.date}T12:00:00`).toISOString(),
    }));
    await supabase.from("meal_logs").insert(rows);
    setLogging(false);
    setLoggedDays((prev) => new Set([...prev, dayIdx]));
  };

  const logAll = async () => {
    setLogging(true);
    const supabase = createClient();
    const rows = week.flatMap((day, i) =>
      day.slots.filter((s) => s.recipe && !loggedDays.has(i)).map((s) => ({
        user_id: userId,
        name: s.recipe!.title,
        calories: s.recipe!.calories,
        protein: s.recipe!.protein,
        carbs: s.recipe!.carbs,
        fat: s.recipe!.fat,
        meal_type: s.type,
        logged_at: new Date(`${day.date}T12:00:00`).toISOString(),
      }))
    );
    await supabase.from("meal_logs").insert(rows);
    setLogging(false);
    setLoggedDays(new Set([0, 1, 2, 3, 4, 5, 6]));
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  // Shopping list — aggregate across whole week
  const shoppingMap = new Map<string, { amounts: string[]; days: string[] }>();
  week.forEach((day) => {
    day.slots.forEach((sl) => {
      if (!sl.recipe?.ingredients) return;
      sl.recipe.ingredients.forEach((ing) => {
        const key = ing.name.toLowerCase();
        if (shoppingMap.has(key)) {
          shoppingMap.get(key)!.amounts.push(ing.amount);
          shoppingMap.get(key)!.days.push(day.label);
        } else {
          shoppingMap.set(key, { amounts: [ing.amount], days: [day.label] });
        }
      });
    });
  });
  const shoppingItems = [...shoppingMap.entries()].map(([name, v]) => ({
    name,
    amounts: v.amounts,
    days: [...new Set(v.days)],
  }));

  const currentDay = week[activeDay];
  const dayTotal = currentDay.slots.reduce((s, sl) => s + (sl.recipe?.calories ?? 0), 0);
  const dayProtein = currentDay.slots.reduce((s, sl) => s + (sl.recipe?.protein ?? 0), 0);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {[{ val: "plan" as const, label: "📅 Wochenplan" }, { val: "shopping" as const, label: "🛒 Einkaufsliste" }].map((t) => (
          <button key={t.val} onClick={() => setTab(t.val)}
            style={{ flex: 1, padding: "10px", fontSize: "13px", fontWeight: 500, background: tab === t.val ? "var(--accent-bg)" : "var(--bg-card)", border: tab === t.val ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "10px", color: tab === t.val ? "var(--accent-light)" : "var(--text-secondary)", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
        <button onClick={logAll} disabled={logging}
          className="glow-green"
          style={{ padding: "10px 14px", fontSize: "12px", fontWeight: 500, background: "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
          ✓ Alle 7 Tage
        </button>
      </div>

      {tab === "plan" && (
        <>
          {/* Day tabs */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px", overflowX: "auto", paddingBottom: "2px" }}>
            {week.map((d, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                style={{ flexShrink: 0, padding: "8px 14px", background: activeDay === i ? "var(--accent-bg)" : "var(--bg-card)", border: activeDay === i ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "10px", color: activeDay === i ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "12px", fontWeight: 500, cursor: "pointer", position: "relative" }}>
                {d.label}
                {loggedDays.has(i) && <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "8px", height: "8px", borderRadius: "50%", background: "#1D9E75" }} />}
                {d.date === today && !loggedDays.has(i) && <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "8px", height: "8px", borderRadius: "50%", background: "#EF9F27" }} />}
              </button>
            ))}
          </div>

          {/* Day stats */}
          <div className="grid-3col" style={{ marginBottom: "14px" }}>
            {[
              { label: "Kalorien", val: `${dayTotal}`, unit: "kcal" },
              { label: "Protein", val: `${Math.round(dayProtein)}`, unit: "g", color: "#5DCAA5" },
              { label: "Mahlzeiten", val: `${currentDay.slots.filter((s) => s.recipe).length}`, unit: "von 4" },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 500, color: (s as { color?: string }).color ?? "var(--text-primary)" }}>{s.val}<span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "2px" }}>{s.unit}</span></div>
                <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Slots */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {currentDay.slots.map((sl) => {
              const isSwapping = swapping?.day === activeDay && swapping.slot === sl.type;
              const usedIds = new Set(currentDay.slots.map((s) => s.recipe?.id).filter(Boolean) as string[]);
              return (
                <div key={sl.type}>
                  <div style={{ background: "var(--bg-card)", border: isSwapping ? "1px solid rgba(29,158,117,0.5)" : "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                    <div style={{ padding: "9px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.02)" }}>
                      <span>{sl.emoji}</span>
                      <span style={{ fontSize: "11px", color: "var(--accent-light)", fontWeight: 500 }}>{sl.label.toUpperCase()}</span>
                      <button onClick={() => setSwapping(isSwapping ? null : { day: activeDay, slot: sl.type })}
                        style={{ marginLeft: "auto", padding: "3px 9px", background: isSwapping ? "var(--accent-bg)" : "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "6px", color: isSwapping ? "var(--accent-light)" : "var(--text-muted)", fontSize: "10px", cursor: "pointer" }}>
                        ↔ Tauschen
                      </button>
                    </div>
                    {sl.recipe ? (
                      <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link href={`/recipes/${sl.recipe.id}`} style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none", display: "block", marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {sl.recipe.title}
                          </Link>
                          <span style={{ fontSize: "10px", color: "var(--accent-light)" }}>{sl.recipe.calories} kcal · P: {sl.recipe.protein}g</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "12px 14px" }}>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Kein Rezept verfügbar</p>
                      </div>
                    )}
                  </div>

                  {isSwapping && (
                    <div style={{ marginTop: "4px", background: "var(--bg-card)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "11px", color: "var(--accent-light)", fontWeight: 500 }}>Alternative wählen</span>
                        <button onClick={() => setSwapping(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer" }}>×</button>
                      </div>
                      {alternativesFor(recipes, sl, usedIds).map((r) => (
                        <button key={r.id} onClick={() => swapSlot(activeDay, sl.type, r)}
                          style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", borderTop: "1px solid var(--border)", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)" }}>{r.title}</span>
                          <span style={{ fontSize: "11px", color: "var(--accent-light)", flexShrink: 0, marginLeft: "8px" }}>{r.calories} kcal</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Log day */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => logDay(activeDay)} disabled={logging || loggedDays.has(activeDay)}
              style={{ flex: 1, padding: "12px", background: loggedDays.has(activeDay) ? "rgba(29,158,117,0.2)" : "var(--accent)", border: "none", borderRadius: "10px", color: loggedDays.has(activeDay) ? "var(--accent-light)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loggedDays.has(activeDay) ? "default" : "pointer" }}>
              {loggedDays.has(activeDay) ? "✓ Geloggt" : `${currentDay.label} loggen`}
            </button>
            <button onClick={() => regenerateDay(activeDay)}
              style={{ padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "13px", cursor: "pointer" }}>
              ↺
            </button>
          </div>
        </>
      )}

      {tab === "shopping" && (
        <div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Alle Zutaten für die gesamte Woche auf einen Blick.
          </p>
          {shoppingItems.length === 0 ? (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "32px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Rezepte ohne Zutaten-Daten.</p>
            </div>
          ) : (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>🛒 {shoppingItems.length} Zutaten</span>
                <button onClick={() => {
                  const text = shoppingItems.map((i) => `${i.name} — ${i.amounts.join(", ")}`).join("\n");
                  navigator.clipboard.writeText(text);
                }} style={{ fontSize: "11px", color: "var(--accent-light)", background: "none", border: "none", cursor: "pointer" }}>
                  Kopieren
                </button>
              </div>
              {shoppingItems.map((item, i) => (
                <div key={item.name} style={{ padding: "10px 16px", borderTop: i > 0 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)", textTransform: "capitalize" }}>{item.name}</span>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)", marginLeft: "6px" }}>{item.days.join(", ")}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--accent-light)", whiteSpace: "nowrap" }}>{item.amounts.join(" + ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
