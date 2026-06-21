"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { CalorieRing } from "@/components/CalorieRing";
import { AddMealModal } from "@/components/AddMealModal";

interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  logged_at: string;
}

interface Props {
  userName: string;
  initialMeals: MealLog[];
  goal: number;
}

const mealTypeLabel: Record<string, string> = {
  breakfast: "Frühstück",
  lunch: "Mittagessen",
  dinner: "Abendessen",
  snack: "Snack",
};

const suggestedRecipes = [
  { title: "Lachs mit Brokkoli", kcal: 380, protein: 42, duration: 20 },
  { title: "Hüttenkäse-Bowl", kcal: 290, protein: 38, duration: 5 },
  { title: "Omelette mit Spinat", kcal: 310, protein: 28, duration: 10 },
];

export function DashboardClient({ userName, initialMeals, goal }: Props) {
  const router = useRouter();
  const [meals, setMeals] = useState<MealLog[]>(initialMeals);
  const [showModal, setShowModal] = useState(false);

  const consumed = meals.reduce((s, m) => s + m.calories, 0);
  const proteinTotal = Math.round(meals.reduce((s, m) => s + (m.protein ?? 0), 0) * 10) / 10;
  const carbTotal = Math.round(meals.reduce((s, m) => s + (m.carbs ?? 0), 0) * 10) / 10;
  const fatTotal = Math.round(meals.reduce((s, m) => s + (m.fat ?? 0), 0) * 10) / 10;

  const handleAdded = useCallback(() => {
    router.refresh();
    setMeals([]);
  }, [router]);

  const dateStr = new Date().toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).toUpperCase();

  const remaining = Math.max(goal - consumed, 0);
  const coachMsg = remaining > 600
    ? "Du hast noch viel Spielraum. Denk an eine proteinreiche Mahlzeit!"
    : remaining > 200
    ? `Noch ${remaining} kcal übrig. Ideal für eine leichte Mahlzeit oder Snack.`
    : "Fast am Tagesziel — kleine proteinreiche Snacks sind jetzt perfekt.";

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/dashboard" userName={userName} />

      {showModal && (
        <AddMealModal
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
        />
      )}

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 4px", letterSpacing: "0.5px" }}>
            {dateStr}
          </p>
          <h1 style={{ fontSize: "24px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>
            Hallo, {userName.split(" ")[0]}
          </h1>
        </div>

        {/* Calorie ring */}
        <div
          style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "16px", padding: "24px",
            display: "flex", gap: "32px", alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <CalorieRing consumed={consumed} goal={goal} size={140} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              {[
                { label: "Protein", value: `${proteinTotal}g`, color: "var(--accent-light)" },
                { label: "Kohlenhydrate", value: `${carbTotal}g`, color: "var(--text-primary)" },
                { label: "Fett", value: `${fatTotal}g`, color: "var(--text-primary)" },
              ].map((m) => (
                <div key={m.label} style={{ background: "var(--bg-hover)", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "18px", fontWeight: 500, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ height: "6px", background: "var(--bg-hover)", borderRadius: "99px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min((consumed / goal) * 100, 100)}%`,
                  background: consumed > goal ? "#E24B4A" : "var(--accent)",
                  borderRadius: "99px",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{consumed} kcal gegessen</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Ziel: {goal} kcal</span>
            </div>
          </div>
        </div>

        {/* Coach tip */}
        <div
          style={{
            background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "24px",
            display: "flex", gap: "10px", alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "16px", color: "var(--accent)", marginTop: "1px" }}>◎</span>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            {coachMsg}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Meal log */}
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 12px" }}>
              Heute gegessen
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {meals.length === 0 && (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", padding: "12px 0" }}>
                  Noch nichts eingetragen.
                </p>
              )}
              {meals.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "10px", padding: "12px 14px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 2px" }}>
                      {m.name}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                      {formatTime(m.logged_at)} · {mealTypeLabel[m.meal_type] ?? m.meal_type}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{m.calories}</div>
                    <div style={{ fontSize: "10px", color: "var(--accent-light)" }}>{m.protein}g P</div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowModal(true)}
                style={{
                  width: "100%", padding: "10px",
                  background: "transparent",
                  border: "1px dashed var(--border)",
                  borderRadius: "10px",
                  color: "var(--accent-light)", fontSize: "13px", cursor: "pointer",
                }}
              >
                + Mahlzeit hinzufügen
              </button>
            </div>
          </div>

          {/* Recipe suggestions */}
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 12px" }}>
              Empfohlen für heute
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {suggestedRecipes.map((r) => (
                <div
                  key={r.title}
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "10px", padding: "12px 14px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 2px" }}>
                      {r.title}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                      {r.duration} Min · {r.protein}g Protein
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: "11px", color: "var(--accent-light)",
                      background: "var(--accent-bg)", padding: "4px 8px",
                      borderRadius: "6px", border: "1px solid rgba(93,202,165,0.2)",
                    }}
                  >
                    {r.kcal} kcal
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
