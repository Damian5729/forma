import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { RUNNING_PLANS } from "@/lib/running-plans";

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const unique = [...new Set(dates.map((d) => d.split("T")[0]))].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (unique[0] !== today && unique[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = (new Date(unique[i - 1]).getTime() - new Date(unique[i]).getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

const MILESTONES = [
  { id: "first_log", emoji: "🌱", title: "Erste Mahlzeit!", desc: "Du hast deine erste Mahlzeit geloggt. Der Anfang ist gemacht!" },
  { id: "streak_3", emoji: "🔥", title: "3-Tage Streak!", desc: "3 Tage in Folge geloggt. Konsistenz ist der Schlüssel!" },
  { id: "streak_7", emoji: "⚡", title: "Wochen-Streak!", desc: "7 Tage am Stück! Du bist unaufhaltbar." },
  { id: "streak_30", emoji: "👑", title: "Monats-Streak!", desc: "30 Tage täglich geloggt. Absolut legendär!" },
  { id: "logs_10", emoji: "🎯", title: "10 Mahlzeiten!", desc: "Du hast 10 Mahlzeiten eingetragen. Weiter so!" },
  { id: "logs_50", emoji: "🏆", title: "50 Mahlzeiten!", desc: "50 eingetragene Mahlzeiten. Du bist ein Profi!" },
  { id: "logs_100", emoji: "💎", title: "100 Mahlzeiten!", desc: "100 Mahlzeiten geloggt — das ist echte Disziplin!" },
  { id: "weight_log", emoji: "⚖️", title: "Gewicht geloggt!", desc: "Du verfolgst jetzt deinen Gewichtsverlauf." },
];

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date().toISOString().split("T")[0];

  const [
    { data: meals },
    { data: profile },
    { data: allLogs },
    { data: waterLog },
    { data: templates },
    { data: achievedRows },
    { data: weightCount },
    { data: recentRaw },
    { data: activityLogs },
    { data: stepLog },
  ] = await Promise.all([
    supabase.from("meal_logs").select("*").eq("user_id", user.id)
      .gte("logged_at", `${today}T00:00:00`).lte("logged_at", `${today}T23:59:59`)
      .order("logged_at", { ascending: true }),
    supabase.from("user_profiles").select("daily_calories, protein_goal, carb_goal, fat_goal, name, goal, active_running_plan_id, active_running_plan_started_at").eq("id", user.id).single(),
    supabase.from("meal_logs").select("logged_at").eq("user_id", user.id).order("logged_at", { ascending: false }).limit(120),
    supabase.from("water_logs").select("glasses").eq("user_id", user.id).eq("logged_at", today).maybeSingle(),
    supabase.from("meal_templates").select("id, name, calories, protein, meal_type").eq("user_id", user.id).limit(4),
    supabase.from("user_milestones").select("milestone_id").eq("user_id", user.id),
    supabase.from("weight_logs").select("id").eq("user_id", user.id).limit(1),
    supabase.from("meal_logs").select("name, calories, protein, carbs, fat, meal_type")
      .eq("user_id", user.id).order("logged_at", { ascending: false }).limit(20),
    supabase.from("activity_logs").select("id, activity_type, duration_minutes, calories_burned, logged_at")
      .eq("user_id", user.id)
      .gte("logged_at", `${today}T00:00:00`)
      .lte("logged_at", `${today}T23:59:59`)
      .order("logged_at", { ascending: false }),
    supabase.from("step_logs").select("steps").eq("user_id", user.id).eq("logged_at", today).maybeSingle(),
  ]);

  const streak = calcStreak((allLogs ?? []).map((l: { logged_at: string }) => l.logged_at));
  const totalLogs = allLogs?.length ?? 0;
  const achieved = new Set((achievedRows ?? []).map((r: { milestone_id: string }) => r.milestone_id));

  // Compute which milestones are newly earned
  const eligibleIds: string[] = [];
  if (totalLogs >= 1) eligibleIds.push("first_log");
  if (streak >= 3) eligibleIds.push("streak_3");
  if (streak >= 7) eligibleIds.push("streak_7");
  if (streak >= 30) eligibleIds.push("streak_30");
  if (totalLogs >= 10) eligibleIds.push("logs_10");
  if (totalLogs >= 50) eligibleIds.push("logs_50");
  if (totalLogs >= 100) eligibleIds.push("logs_100");
  if ((weightCount?.length ?? 0) > 0) eligibleIds.push("weight_log");

  const newIds = eligibleIds.filter((id) => !achieved.has(id));
  const newMilestones = newIds.map((id) => MILESTONES.find((m) => m.id === id)!).filter(Boolean);

  // Save newly earned milestones
  if (newIds.length > 0) {
    await supabase.from("user_milestones").upsert(
      newIds.map((milestone_id) => ({ user_id: user.id, milestone_id })),
      { onConflict: "user_id,milestone_id" }
    );
  }

  // Recent meals: deduplicated by name, last 5 unique
  const seen = new Set<string>();
  const recentMeals: { name: string; calories: number; protein: number; carbs: number; fat: number; meal_type: string }[] = [];
  for (const m of recentRaw ?? []) {
    if (!seen.has(m.name) && recentMeals.length < 5) {
      seen.add(m.name);
      recentMeals.push(m);
    }
  }

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  // Running widget logic
  let runningWidgetData: {
    planId: string; planName: string; weekNum: number; dayNum: number;
    weeksTotal: number; workout: {
      name: string; type: string; duration: number; distance?: string;
      description: string; structure: string; effort: string;
    }; alreadyDone: boolean;
  } | null = null;

  if (profile?.active_running_plan_id && profile?.active_running_plan_started_at) {
    const activePlan = RUNNING_PLANS.find((p) => p.id === profile.active_running_plan_id);
    if (activePlan) {
      const startDate = new Date(profile.active_running_plan_started_at);
      const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / 86400000);
      const totalDays = activePlan.weeksTotal * activePlan.daysPerWeek;
      if (daysSinceStart < totalDays) {
        const weekIdx = Math.floor(daysSinceStart / activePlan.daysPerWeek);
        const dayIdx = daysSinceStart % activePlan.daysPerWeek;
        const week = activePlan.weeks[weekIdx];
        const workout = week?.workouts[dayIdx];
        if (workout) {
          const { data: completionRow } = await supabase
            .from("running_completions")
            .select("id")
            .eq("user_id", user.id)
            .eq("plan_id", profile.active_running_plan_id)
            .eq("week_num", weekIdx + 1)
            .eq("day_num", dayIdx + 1)
            .maybeSingle();
          runningWidgetData = {
            planId: activePlan.id,
            planName: activePlan.name,
            weekNum: weekIdx + 1,
            dayNum: dayIdx + 1,
            weeksTotal: activePlan.weeksTotal,
            workout,
            alreadyDone: !!completionRow,
          };
        }
      }
    }
  }

  // Supplement widget
  const [{ data: suppPlan }, { data: suppCompletions }] = await Promise.all([
    supabase.from("supplement_plans").select("id, name, dose, time_of_day, emoji").eq("user_id", user.id).order("time_of_day").order("created_at"),
    supabase.from("supplement_logs").select("supplement_id").eq("user_id", user.id).eq("logged_date", today),
  ]);

  const burnedToday = (activityLogs ?? []).reduce((s: number, a: { calories_burned: number }) => s + a.calories_burned, 0);
  type ActivityLog = { id: string; activity_type: string; duration_minutes: number; calories_burned: number; logged_at: string };
  const stepsToday = stepLog?.steps ?? 0;
  const userGoal = profile?.goal ?? "lose";
  const burnGoal = userGoal === "gain" ? 200 : userGoal === "maintain" ? 300 : 500;

  return (
    <DashboardClient
      userName={userName}
      initialMeals={meals ?? []}
      goal={profile?.daily_calories ?? 1850}
      proteinGoal={profile?.protein_goal ?? 140}
      carbGoal={profile?.carb_goal ?? 200}
      fatGoal={profile?.fat_goal ?? 60}
      userGoal={userGoal}
      userId={user.id}
      streak={streak}
      initialWater={waterLog?.glasses ?? 0}
      quickTemplates={(templates as { id: string; name: string; calories: number; protein: number; meal_type: string }[] | null) ?? []}
      recentMeals={recentMeals}
      newMilestones={newMilestones}
      burnGoal={burnGoal}
      initialBurned={burnedToday}
      initialSteps={stepsToday}
      initialActivities={(activityLogs ?? []) as ActivityLog[]}
      runningWidget={runningWidgetData}
      supplements={suppPlan ?? []}
      suppDoneIds={(suppCompletions ?? []).map((c: { supplement_id: string }) => c.supplement_id)}
      today={today}
    />
  );
}
