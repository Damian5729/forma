"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { CalorieRing } from "@/components/CalorieRing";
import { AddMealModal } from "@/components/AddMealModal";
import { WaterTracker } from "@/components/WaterTracker";
import { StreakBadge } from "@/components/StreakBadge";

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
  proteinGoal?: number;
  userGoal?: string;
  userId?: string;
  streak?: number;
  initialWater?: number;
}

const mealTypeLabel: Record<string, string> = {
  breakfast: "Frühstück",
  lunch: "Mittagessen",
  dinner: "Abendessen",
  snack: "Snack",
};

const suggestedRecipes = [
  { title: "Lachs mit Brokkoli", kcal: 380, protein: 42, duration: 20, href: "/recipes" },
  { title: "Hüttenkäse-Bowl", kcal: 290, protein: 38, duration: 5, href: "/recipes" },
  { title: "Omelette mit Spinat", kcal: 310, protein: 28, duration: 10, href: "/recipes" },
];

export function DashboardClient({ userName, initialMeals, goal, proteinGoal = 140, userGoal = "lose", userId = "", streak = 0, initialWater = 0 }: Props) {
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
    weekday: "long", day: "numeric", month: "long"
  });

  const remaining = Math.max(goal - consumed, 0);
  const coachMsg = remaining > 600
    ? "Noch viel Spielraum. Denk an eine proteinreiche Mahlzeit!"
    : remaining > 200
    ? `Noch ${remaining} kcal übrig — ideal für Snack oder leichte Mahlzeit.`
    : "Fast am Tagesziel — kleine proteinreiche Snacks jetzt perfekt.";

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

      <main className="main-pad" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px", letterSpacing: "0.5px" }}>
            {dateStr}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)" }}>
              Hallo, {userName.split(" ")[0]}
            </h1>
            {streak > 0 && <StreakBadge streak={streak} />}
          </div>
        </div>

        {/* Calorie ring card */}
        <div
          style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "16px", padding: "20px", marginBottom: "12px",
          }}
        >
          <div className="flex-stack">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CalorieRing consumed={consumed} goal={goal} size={130} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="grid-3col" style={{ marginBottom: "14px" }}>
                {[
                  { label: "Protein", value: `${proteinTotal}g`, color: "var(--accent-light)" },
                  { label: "Carbs", value: `${carbTotal}g`, color: "var(--text-primary)" },
                  { label: "Fett", value: `${fatTotal}g`, color: "var(--text-primary)" },
                ].map((m) => (
                  <div key={m.label} style={{ background: "var(--bg-hover)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: 500, color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: "5px", background: "var(--bg-hover)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min((consumed / goal) * 100, 100)}%`, background: consumed > goal ? "#E24B4A" : "var(--accent)", borderRadius: "99px", transition: "width 0.6s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{consumed} kcal</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>/ {goal} kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coach tip */}
        <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "12px", padding: "13px 16px", marginBottom: "20px", display: "flex", gap: "10px" }}>
          <span style={{ color: "var(--accent)", flexShrink: 0 }}>◎</span>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            {coachMsg}
          </p>
        </div>

        {/* Water tracker */}
        {userId && (
          <div style={{ marginBottom: "12px" }}>
            <WaterTracker userId={userId} initialGlasses={initialWater} goal={8} />
          </div>
        )}

        {/* Add meal button — prominent on mobile */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            width: "100%", padding: "14px",
            background: "var(--accent)", border: "none",
            borderRadius: "12px", color: "#fff",
            fontSize: "15px", fontWeight: 500, cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          + Mahlzeit eintragen
        </button>

        {/* Meals + Recipes grid */}
        <div className="grid-2col">
          {/* Meal log */}
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "10px" }}>
              Heute gegessen
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {meals.length === 0 && (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", padding: "8px 0" }}>Noch nichts eingetragen.</p>
              )}
              {meals.map((m) => (
                <div
                  key={m.id}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ minWidth: 0, flex: 1, marginRight: "8px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.name}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                      {formatTime(m.logged_at)} · {mealTypeLabel[m.meal_type] ?? m.meal_type}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{m.calories}</div>
                    <div style={{ fontSize: "10px", color: "var(--accent-light)" }}>{m.protein}g P</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipe suggestions */}
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "10px" }}>
              Empfohlen
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {suggestedRecipes.map((r) => (
                <Link
                  key={r.title}
                  href={r.href}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none" }}
                >
                  <div style={{ minWidth: 0, flex: 1, marginRight: "8px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.title}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{r.duration} Min · {r.protein}g P</p>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "4px 8px", borderRadius: "6px", whiteSpace: "nowrap" }}>
                    {r.kcal} kcal
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
