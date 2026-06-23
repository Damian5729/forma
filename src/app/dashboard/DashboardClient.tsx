"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Nav } from "@/components/Nav";
import { CalorieRing } from "@/components/CalorieRing";
import { AddMealModal } from "@/components/AddMealModal";
import { AddActivityModal } from "@/components/AddActivityModal";
import { ActivityRing } from "@/components/ActivityRing";
import { WaterTracker } from "@/components/WaterTracker";
import { StreakBadge } from "@/components/StreakBadge";
import { MilestoneToast } from "@/components/MilestoneToast";
import { RunningWidget } from "@/components/RunningWidget";
import { SupplementWidget } from "@/components/SupplementWidget";
import { SplashScreen } from "@/components/SplashScreen";
import { OnboardingTour } from "@/components/OnboardingTour";
import { PushNotifications } from "@/components/PushNotifications";
import { UpgradeSuccess } from "@/components/UpgradeSuccess";

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

interface Milestone {
  id: string;
  emoji: string;
  title: string;
  desc: string;
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
  recentMeals?: { name: string; calories: number; protein: number; carbs: number; fat: number; meal_type: string }[];
  newMilestones?: Milestone[];
  burnGoal?: number;
  initialBurned?: number;
  initialSteps?: number;
  initialActivities?: { id: string; activity_type: string; duration_minutes: number; calories_burned: number; logged_at: string }[];
  runningWidget?: {
    planId: string; planName: string; weekNum: number; dayNum: number;
    weeksTotal: number; workout: {
      name: string; type: string; duration: number; distance?: string;
      description: string; structure: string; effort: string;
    }; alreadyDone: boolean;
  } | null;
  supplements?: { id: string; name: string; dose: string | null; time_of_day: string; emoji: string }[];
  suppDoneIds?: string[];
  today?: string;
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
        <span style={{ fontSize: "11px", color: over ? "#E24B4A" : "var(--text-muted)" }}>{value}g / {goal}g</span>
      </div>
      <div style={{ height: "5px", background: "var(--bg-hover)", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: over ? "#E24B4A" : color, borderRadius: "99px", transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
    </div>
  );
}

export function DashboardClient({
  userName, initialMeals, goal, proteinGoal = 140, carbGoal = 200, fatGoal = 60,
  userId = "", streak = 0, initialWater = 0, quickTemplates = [], recentMeals = [], newMilestones = [],
  burnGoal = 400, initialBurned = 0, initialSteps = 0, initialActivities = [],
  runningWidget = null,
  supplements = [],
  suppDoneIds = [],
  today = new Date().toISOString().split("T")[0],
}: Props) {
  const router = useRouter();
  const [meals, setMeals] = useState<MealLog[]>(initialMeals);
  const [activities, setActivities] = useState(initialActivities);
  const [showModal, setShowModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [loggingTemplate, setLoggingTemplate] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>(newMilestones);

  const consumed = meals.reduce((s, m) => s + m.calories, 0);
  const proteinTotal = Math.round(meals.reduce((s, m) => s + (m.protein ?? 0), 0) * 10) / 10;
  const carbTotal = Math.round(meals.reduce((s, m) => s + (m.carbs ?? 0), 0) * 10) / 10;
  const fatTotal = Math.round(meals.reduce((s, m) => s + (m.fat ?? 0), 0) * 10) / 10;

  const handleAdded = useCallback(() => {
    router.refresh();
    setMeals([]);
  }, [router]);

  const deleteActivity = async (id: string) => {
    setDeletingActivityId(id);
    const supabase = createClient();
    await supabase.from("activity_logs").delete().eq("id", id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setDeletingActivityId(null);
    router.refresh();
  };

  const deleteMeal = async (id: string) => {
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("meal_logs").delete().eq("id", id);
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setDeletingId(null);
  };

  const logRecent = async (meal: typeof recentMeals[0]) => {
    const supabase = createClient();
    await supabase.from("meal_logs").insert({ user_id: userId, ...meal });
    router.refresh();
    setMeals([]);
  };

  const logTemplate = async (t: Template) => {
    setLoggingTemplate(t.id);
    const supabase = createClient();
    await supabase.from("meal_logs").insert({ user_id: userId, name: t.name, calories: t.calories, protein: t.protein, carbs: 0, fat: 0, meal_type: t.meal_type });
    setLoggingTemplate(null);
    router.refresh();
    setMeals([]);
  };

  const dateStr = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  const remaining = goal - consumed;
  const hour = new Date().getHours();

  const proteinGap = proteinGoal - proteinTotal;
  const proteinPct = proteinGoal > 0 ? (proteinTotal / proteinGoal) * 100 : 0;
  const caloriePct = goal > 0 ? (consumed / goal) * 100 : 0;
  const mealCount = meals.length;

  const coachTips: { msg: string; type: "info" | "warn" | "success" | "protein" }[] = [];

  // Primary calorie tip
  if (consumed === 0 && hour < 11) {
    coachTips.push({ msg: "Guten Morgen! Ein proteinreiches Frühstück hält dich bis Mittag satt.", type: "info" });
  } else if (consumed === 0) {
    coachTips.push({ msg: "Noch nichts geloggt – trag jetzt deine erste Mahlzeit ein.", type: "warn" });
  } else if (remaining < 0) {
    coachTips.push({ msg: `Tagesziel überschritten (+${Math.abs(remaining)} kcal). Morgen wieder!`, type: "warn" });
  } else if (caloriePct >= 90) {
    coachTips.push({ msg: `Fast am Ziel! Nur noch ${remaining} kcal – kleiner Snack reicht.`, type: "success" });
  } else if (hour >= 20 && caloriePct < 70) {
    coachTips.push({ msg: `Abends noch ${remaining} kcal offen – nicht vergessen zu loggen.`, type: "warn" });
  } else {
    coachTips.push({ msg: `Noch ${remaining} kcal übrig (${Math.round(caloriePct)}% des Tagesziels erreicht).`, type: "info" });
  }

  // Protein tip
  if (proteinPct < 40 && hour > 13) {
    coachTips.push({ msg: `Protein nachziehen: ${Math.round(proteinGap)}g fehlen noch. Tipp: Quark, Hüttenkäse oder Proteinshake.`, type: "protein" });
  } else if (proteinPct >= 100) {
    coachTips.push({ msg: `Proteinziel erreicht! (${proteinTotal}g ✓)`, type: "success" });
  }

  // Meal variety tip
  if (mealCount === 1 && hour > 15) {
    coachTips.push({ msg: "Nur eine Mahlzeit geloggt – verteile Kalorien auf 3-4 Mahlzeiten für stabileren Blutzucker.", type: "info" });
  }

  // Streak motivation
  if (streak >= 3 && mealCount > 0) {
    coachTips.push({ msg: `🔥 ${streak} Tage Streak! Weiter so.`, type: "success" });
  }

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  const mealGroups = ["breakfast", "lunch", "dinner", "snack"]
    .map((type) => ({ type, label: mealTypeLabel[type], items: meals.filter((m) => m.meal_type === type) }))
    .filter((g) => g.items.length > 0);

  const quickLinks = [
    { href: "/recipes", label: "Rezepte", icon: "🍽", gradient: "var(--g-green-dark)" },
    { href: "/fitness/plan", label: "Training", icon: "💪", gradient: "var(--g-purple)" },
    { href: "/dashboard/tagesplan", label: "Tagesplan", icon: "📋", gradient: "var(--g-forest)" },
    { href: "/supplements", label: "Supplements", icon: "💊", gradient: "var(--g-blue-soft)", highlight: true },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <SplashScreen userName={userName} />
      <OnboardingTour />
      <UpgradeSuccess />
      <PushNotifications />
      <Nav active="/dashboard" userName={userName} />

      {milestones.length > 0 && (
        <MilestoneToast
          milestones={milestones}
          onClose={() => setMilestones([])}
        />
      )}

      {showModal && <AddMealModal onClose={() => setShowModal(false)} onAdded={handleAdded} />}
      {showActivityModal && userId && (
        <AddActivityModal
          userId={userId}
          onClose={() => setShowActivityModal(false)}
          onAdded={() => { router.refresh(); setShowActivityModal(false); }}
        />
      )}

      <main className="main-pad page-enter" style={{ maxWidth: "820px" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px", letterSpacing: "0.5px" }}>{dateStr}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
              {hour >= 6 && hour < 11
                ? "☀️ Guten Morgen"
                : hour >= 11 && hour < 17
                ? "👋 Hey"
                : hour >= 17 && hour < 22
                ? "🌆 Guten Abend"
                : "🌙 Gute Nacht"}, <span className="gradient-text">{userName.split(" ")[0]}</span>
            </h1>
            {streak > 0 && <StreakBadge streak={streak} />}
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.5 }}>
            {hour >= 6 && hour < 11
              ? streak > 0
                ? `${streak} Tage am Stück — heute auch nicht vergessen! 🔥`
                : "Fang stark in den Tag. Was kommt heute auf den Teller?"
              : hour >= 11 && hour < 14
              ? "Mittagszeit! Hast du schon was gegessen heute?"
              : hour >= 14 && hour < 17
              ? "Wie läuft dein Tag so? Alles eingetragen?"
              : hour >= 17 && hour < 20
              ? "Wie war dein Tag? Trag noch alles ein was noch fehlt."
              : hour >= 20 && hour < 22
              ? "Fast geschafft — noch den Abend eintragen und du bist durch 💪"
              : "Noch so spät wach? Morgen frisch durchstarten 🌙"}
          </p>
        </div>

        {/* Calorie ring + macro bars */}
        <div className="glow-green" style={{ background: "var(--g-green-main)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "20px", padding: "22px", marginBottom: "10px" }}>
          <div className="flex-stack">
            <div style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <CalorieRing consumed={consumed} goal={goal} size={138} />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Kalorien heute</span>
                <span style={{ fontSize: "22px", fontWeight: 500, color: consumed > goal ? "#E24B4A" : "var(--text-primary)", transition: "color 0.3s" }}>
                  {consumed} <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 400 }}>/ {goal}</span>
                </span>
              </div>
              <div style={{ height: "6px", background: "var(--bg-hover)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min((consumed / goal) * 100, 100)}%`, background: consumed > goal ? "#E24B4A" : "linear-gradient(90deg, #1D9E75, #5DCAA5)", borderRadius: "99px", transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)" }} />
              </div>
              <MacroBar label="Protein" value={proteinTotal} goal={proteinGoal} color="#1D9E75" />
              <MacroBar label="Kohlenhydrate" value={carbTotal} goal={carbGoal} color="#5B8DD9" />
              <MacroBar label="Fett" value={fatTotal} goal={fatGoal} color="#EF9F27" />
            </div>
          </div>
        </div>

        {/* Coach tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
          {coachTips.map((tip, i) => (
            <div key={i} style={{
              background: tip.type === "warn" ? "rgba(226,75,74,0.08)" : tip.type === "success" ? "var(--accent-bg)" : tip.type === "protein" ? "rgba(91,141,217,0.08)" : "var(--bg-card)",
              border: `1px solid ${tip.type === "warn" ? "rgba(226,75,74,0.2)" : tip.type === "success" ? "rgba(29,158,117,0.2)" : tip.type === "protein" ? "rgba(91,141,217,0.2)" : "var(--border)"}`,
              borderRadius: "12px", padding: "10px 14px", display: "flex", gap: "10px", alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "15px", flexShrink: 0 }}>
                {tip.type === "warn" ? "⚠️" : tip.type === "success" ? "✅" : tip.type === "protein" ? "💪" : "🤖"}
              </span>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>{tip.msg}</p>
            </div>
          ))}
        </div>

        {/* Water */}
        {userId && (
          <div style={{ marginBottom: "10px" }}>
            <WaterTracker userId={userId} initialGlasses={initialWater} goal={8} />
          </div>
        )}

        {/* Supplement widget */}
        {userId && (
          <SupplementWidget
            userId={userId}
            supplements={supplements}
            doneIds={suppDoneIds}
            today={today}
          />
        )}

        {/* Activity Ring */}
        <div style={{ background: "var(--g-red)", border: "1px solid rgba(255,59,48,0.15)", borderRadius: "20px", padding: "18px 20px", marginBottom: activities.length > 0 ? "0" : "10px", borderBottomLeftRadius: activities.length > 0 ? "0" : "20px", borderBottomRightRadius: activities.length > 0 ? "0" : "20px" }}>
          <ActivityRing
            burned={activities.reduce((s, a) => s + a.calories_burned, 0)}
            burnGoal={burnGoal}
            steps={initialSteps}
            stepsGoal={10000}
            size={130}
            onAddActivity={() => setShowActivityModal(true)}
          />
        </div>

        {/* Activity list */}
        {activities.length > 0 && (
          <div style={{ background: "var(--g-red-soft)", border: "1px solid rgba(255,59,48,0.15)", borderTop: "none", borderRadius: "0 0 20px 20px", marginBottom: "10px", overflow: "hidden" }}>
            {activities.map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", borderTop: i > 0 ? "1px solid rgba(255,59,48,0.08)" : "none", opacity: deletingActivityId === a.id ? 0.4 : 1, transition: "opacity 0.2s" }}>
                <span style={{ fontSize: "13px", color: "var(--text-primary)", flex: 1, fontWeight: 500 }}>{a.activity_type}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{a.duration_minutes} Min</span>
                <span style={{ fontSize: "12px", color: "#FF6B6B", fontWeight: 500, minWidth: "60px", textAlign: "right" }}>−{a.calories_burned} kcal</span>
                <button onClick={() => deleteActivity(a.id)} disabled={deletingActivityId === a.id}
                  style={{ width: "26px", height: "26px", borderRadius: "8px", background: "transparent", border: "1px solid rgba(255,59,48,0.2)", color: "rgba(255,107,107,0.6)", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick-log: templates */}
        {quickTemplates.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px" }}>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "10px" }}>⚡ SCHNELL-LOG</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {quickTemplates.map((t) => (
                <button key={t.id} onClick={() => logTemplate(t)} disabled={loggingTemplate === t.id}
                  style={{ padding: "8px 12px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <span style={{ display: "block", fontWeight: 500 }}>{t.name}</span>
                  <span style={{ fontSize: "10px", color: "var(--accent-light)" }}>{t.calories} kcal</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick-log: recently eaten */}
        {recentMeals.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px" }}>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "10px" }}>🕐 ZULETZT GEGESSEN</p>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
              {recentMeals.map((m, i) => (
                <button key={i} onClick={() => logRecent(m)}
                  style={{ padding: "8px 12px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "12px", cursor: "pointer", textAlign: "left", flexShrink: 0, transition: "all 0.15s" }}>
                  <span style={{ display: "block", fontWeight: 500, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
                  <span style={{ fontSize: "10px", color: "var(--accent-light)" }}>{m.calories} kcal · {m.protein}g P</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pläne + Supplements — always visible above the fold */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "10px" }}>
          <Link href="/dashboard/tagesplan"
            style={{ background: "var(--g-forest)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "14px", padding: "14px 10px", textDecoration: "none", textAlign: "center", display: "block" }}>
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>📋</div>
            <div style={{ fontSize: "11px", color: "var(--accent-light)", fontWeight: 500 }}>Tagesplan</div>
          </Link>
          <Link href="/dashboard/wochenplan"
            style={{ background: "var(--g-purple)", border: "1px solid rgba(93,202,165,0.15)", borderRadius: "14px", padding: "14px 10px", textDecoration: "none", textAlign: "center", display: "block" }}>
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>📅</div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>Wochenplan</div>
          </Link>
          <Link href="/supplements"
            style={{ background: "linear-gradient(135deg,#1D9E75 0%,#0d2419 60%)", border: "1px solid rgba(29,158,117,0.4)", borderRadius: "14px", padding: "14px 10px", textDecoration: "none", textAlign: "center", display: "block" }}>
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>💊</div>
            <div style={{ fontSize: "11px", color: "var(--accent-light)", fontWeight: 500 }}>Supplements</div>
          </Link>
        </div>

        {/* Running widget */}
        {runningWidget && userId && (
          <RunningWidget
            userId={userId}
            planId={runningWidget.planId}
            planName={runningWidget.planName}
            weekNum={runningWidget.weekNum}
            dayNum={runningWidget.dayNum}
            weeksTotal={runningWidget.weeksTotal}
            workout={runningWidget.workout}
            alreadyDone={runningWidget.alreadyDone}
          />
        )}

        {/* Add meal button */}
        <button onClick={() => setShowModal(true)}
          className="glow-green"
          style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #1D9E75, #16835f)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: "pointer", marginBottom: "20px", letterSpacing: "0.1px" }}>
          + Mahlzeit eintragen
        </button>

        {/* Meal log */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Heute</h2>
            {meals.length > 0 && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{meals.length} Einträge · {consumed} kcal</span>}
          </div>

          {meals.length === 0 ? (
            <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "14px", padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🍽</div>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px" }}>Noch nichts eingetragen</p>
              <button onClick={() => setShowModal(true)} style={{ fontSize: "13px", color: "var(--accent-light)", background: "none", border: "none", cursor: "pointer" }}>
                Erste Mahlzeit eintragen →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} className="stagger">
              {mealGroups.map((group) => (
                <div key={group.type} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }} className="fade-enter">
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)" }}>
                    <span style={{ fontSize: "11px", color: "var(--accent-light)", fontWeight: 500, letterSpacing: "0.5px" }}>{group.label.toUpperCase()}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{group.items.reduce((s, m) => s + m.calories, 0)} kcal</span>
                  </div>
                  {group.items.map((m, i) => (
                    <div key={m.id} style={{ padding: "12px 16px", borderTop: i > 0 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "opacity 0.2s", opacity: deletingId === m.id ? 0.4 : 1 }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</p>
                        <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: 0 }}>{formatTime(m.logged_at)} · P: {m.protein}g</p>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0, marginLeft: "12px" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{m.calories}</div>
                          <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>kcal</div>
                        </div>
                        <button onClick={() => deleteMeal(m.id)} disabled={deletingId === m.id}
                          style={{ width: "28px", height: "28px", borderRadius: "8px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick nav cards */}
        <div className="grid-4col">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href} className="card-hover" style={{ background: (l as { highlight?: boolean }).highlight ? "linear-gradient(135deg,#1D9E75 0%,#0d2419 60%)" : l.gradient, border: (l as { highlight?: boolean }).highlight ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "14px", padding: "16px 12px", textDecoration: "none", textAlign: "center", display: "block" }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{l.icon}</div>
              <div style={{ fontSize: "11px", color: (l as { highlight?: boolean }).highlight ? "var(--accent-light)" : "var(--text-secondary)", fontWeight: 500 }}>{l.label}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
