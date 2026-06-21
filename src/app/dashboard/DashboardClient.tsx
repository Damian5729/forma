"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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

interface Template {
  id: string;
  name: string;
  calories: number;
  protein: number;
  meal_type: string;
}

interface Props {
  userName: string;
  initialMeals: MealLog[];
  goal: number;
  proteinGoal?: number;
  carbGoal?: number;
  fatGoal?: number;
  userGoal?: string;
  userId?: string;
  streak?: number;
  initialWater?: number;
  quickTemplates?: Template[];
}

const mealTypeLabel: Record<string, string> = {
  breakfast: "Frühstück",
  lunch: "Mittagessen",
  dinner: "Abendessen",
  snack: "Snack",
};

function MacroBar({ label, value, goal, color }: { label: string; value: number; goal: number; color: string }) {
  const pct = Math.min((value / goal) * 100, 100);
  const over = value > goal;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontSize: "11px", color: over ? "#E24B4A" : "var(--text-muted)" }}>
          {value}g / {goal}g
        </span>
      </div>
      <div style={{ height: "5px", background: "var(--bg-hover)", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: over ? "#E24B4A" : color, borderRadius: "99px", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export function DashboardClient({
  userName, initialMeals, goal, proteinGoal = 140, carbGoal = 200, fatGoal = 60,
  userGoal = "lose", userId = "", streak = 0, initialWater = 0, quickTemplates = [],
}: Props) {
  const router = useRouter();
  const [meals, setMeals] = useState<MealLog[]>(initialMeals);
  const [showModal, setShowModal] = useState(false);
  const [loggingTemplate, setLoggingTemplate] = useState<string | null>(null);

  const consumed = meals.reduce((s, m) => s + m.calories, 0);
  const proteinTotal = Math.round(meals.reduce((s, m) => s + (m.protein ?? 0), 0) * 10) / 10;
  const carbTotal = Math.round(meals.reduce((s, m) => s + (m.carbs ?? 0), 0) * 10) / 10;
  const fatTotal = Math.round(meals.reduce((s, m) => s + (m.fat ?? 0), 0) * 10) / 10;

  const handleAdded = useCallback(() => {
    router.refresh();
    setMeals([]);
  }, [router]);

  const logTemplate = async (t: Template) => {
    setLoggingTemplate(t.id);
    const supabase = createClient();
    await supabase.from("meal_logs").insert({
      user_id: userId,
      name: t.name,
      calories: t.calories,
      protein: t.protein,
      carbs: 0,
      fat: 0,
      meal_type: t.meal_type,
    });
    setLoggingTemplate(null);
    router.refresh();
    setMeals([]);
  };

  const dateStr = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  const remaining = Math.max(goal - consumed, 0);
  const hour = new Date().getHours();

  const coachMsg = (() => {
    if (consumed === 0 && hour < 10) return "Guten Morgen! Ein proteinreiches Frühstück gibt dir Energie für den Tag.";
    if (consumed === 0) return "Du hast heute noch nichts eingetragen — fang am besten jetzt an.";
    if (remaining > 700) return `Noch ${remaining} kcal übrig — genug für eine vollständige Mahlzeit.`;
    if (remaining > 300) return `${remaining} kcal bis zum Tagesziel — ideal für einen leichten Snack.`;
    if (remaining > 0) return `Fast geschafft! Nur noch ${remaining} kcal — bleib bei proteinreichen Optionen.`;
    return `Tagesziel erreicht 🎯 ${Math.abs(remaining)} kcal über dem Ziel.`;
  })();

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  const mealGroups = ["breakfast", "lunch", "dinner", "snack"].map((type) => ({
    type,
    label: mealTypeLabel[type],
    items: meals.filter((m) => m.meal_type === type),
  })).filter((g) => g.items.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/dashboard" userName={userName} />

      {showModal && (
        <AddMealModal onClose={() => setShowModal(false)} onAdded={handleAdded} />
      )}

      <main className="main-pad" style={{ maxWidth: "820px" }}>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px", letterSpacing: "0.5px" }}>{dateStr}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)" }}>
              Hallo, {userName.split(" ")[0]}
            </h1>
            {streak > 0 && <StreakBadge streak={streak} />}
          </div>
        </div>

        {/* Main card: ring + macro bars */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", marginBottom: "10px" }}>
          <div className="flex-stack">
            {/* Ring */}
            <div style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <CalorieRing consumed={consumed} goal={goal} size={130} />
            </div>

            {/* Macro bars */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Kalorien</span>
                <span style={{ fontSize: "20px", fontWeight: 500, color: consumed > goal ? "#E24B4A" : "var(--text-primary)" }}>
                  {consumed} <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 400 }}>/ {goal}</span>
                </span>
              </div>
              <div style={{ height: "6px", background: "var(--bg-hover)", borderRadius: "99px", overflow: "hidden", marginBottom: "4px" }}>
                <div style={{ height: "100%", width: `${Math.min((consumed / goal) * 100, 100)}%`, background: consumed > goal ? "#E24B4A" : "var(--accent)", borderRadius: "99px", transition: "width 0.6s ease" }} />
              </div>
              <MacroBar label="Protein" value={proteinTotal} goal={proteinGoal} color="var(--accent)" />
              <MacroBar label="Kohlenhydrate" value={carbTotal} goal={carbGoal} color="#5B8DD9" />
              <MacroBar label="Fett" value={fatTotal} goal={fatGoal} color="#EF9F27" />
            </div>
          </div>
        </div>

        {/* Coach tip */}
        <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "12px", padding: "12px 16px", marginBottom: "14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ color: "var(--accent)", flexShrink: 0, fontSize: "16px", marginTop: "1px" }}>◎</span>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{coachMsg}</p>
        </div>

        {/* Water tracker */}
        {userId && (
          <div style={{ marginBottom: "10px" }}>
            <WaterTracker userId={userId} initialGlasses={initialWater} goal={8} />
          </div>
        )}

        {/* Quick log from templates */}
        {quickTemplates.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px", marginBottom: "10px" }}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "10px" }}>SCHNELL-LOG</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {quickTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => logTemplate(t)}
                  disabled={loggingTemplate === t.id}
                  style={{
                    padding: "7px 12px", background: loggingTemplate === t.id ? "var(--accent-bg)" : "var(--bg-hover)",
                    border: "1px solid var(--border)", borderRadius: "8px",
                    color: "var(--text-primary)", fontSize: "12px", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ display: "block", fontWeight: 500 }}>{t.name}</span>
                  <span style={{ fontSize: "10px", color: "var(--accent-light)" }}>{t.calories} kcal</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add meal CTA */}
        <button
          onClick={() => setShowModal(true)}
          style={{ width: "100%", padding: "14px", background: "var(--accent)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: "pointer", marginBottom: "20px" }}
        >
          + Mahlzeit eintragen
        </button>

        {/* Meal log grouped */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Heute</h2>
            {meals.length > 0 && (
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{meals.length} Mahlzeiten · {consumed} kcal</span>
            )}
          </div>

          {meals.length === 0 ? (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0 0 12px" }}>Noch nichts eingetragen</p>
              <button onClick={() => setShowModal(true)} style={{ fontSize: "13px", color: "var(--accent-light)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Erste Mahlzeit eintragen →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {mealGroups.map((group) => (
                <div key={group.type} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "var(--accent-light)", fontWeight: 500, letterSpacing: "0.5px" }}>{group.label.toUpperCase()}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {group.items.reduce((s, m) => s + m.calories, 0)} kcal
                    </span>
                  </div>
                  {group.items.map((m, i) => (
                    <div key={m.id} style={{ padding: "11px 14px", borderTop: i > 0 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {m.name}
                        </p>
                        <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: 0 }}>{formatTime(m.logged_at)}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{m.calories} kcal</div>
                        <div style={{ fontSize: "10px", color: "var(--accent-light)" }}>P: {m.protein}g</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links row */}
        <div className="grid-4col" style={{ marginBottom: "24px" }}>
          {[
            { href: "/recipes", label: "Rezepte", icon: "⬡" },
            { href: "/fitness/plan", label: "Training", icon: "◎" },
            { href: "/progress", label: "Fortschritt", icon: "◇" },
            { href: "/profile/templates", label: "Vorlagen", icon: "◈" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 12px", textDecoration: "none", textAlign: "center", display: "block" }}>
              <div style={{ fontSize: "20px", color: "var(--accent)", marginBottom: "5px" }}>{l.icon}</div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{l.label}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
