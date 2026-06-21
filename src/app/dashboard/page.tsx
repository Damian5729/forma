import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const unique = [...new Set(dates.map((d) => d.split("T")[0]))].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (unique[0] !== today && unique[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date().toISOString().split("T")[0];

  const [{ data: meals }, { data: profile }, { data: streakLogs }, { data: waterLog }, { data: templates }] = await Promise.all([
    supabase.from("meal_logs").select("*").eq("user_id", user.id)
      .gte("logged_at", `${today}T00:00:00`).lte("logged_at", `${today}T23:59:59`)
      .order("logged_at", { ascending: true }),
    supabase.from("user_profiles").select("daily_calories, protein_goal, carb_goal, fat_goal, name, goal").eq("id", user.id).single(),
    supabase.from("meal_logs").select("logged_at").eq("user_id", user.id).order("logged_at", { ascending: false }).limit(60),
    supabase.from("water_logs").select("glasses").eq("user_id", user.id).eq("logged_at", today).single(),
    supabase.from("meal_templates").select("id, name, calories, protein, meal_type").eq("user_id", user.id).limit(4),
  ]);

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";
  const streak = calcStreak((streakLogs ?? []).map((l: { logged_at: string }) => l.logged_at));

  return (
    <DashboardClient
      userName={userName}
      initialMeals={meals ?? []}
      goal={profile?.daily_calories ?? 1850}
      proteinGoal={profile?.protein_goal ?? 140}
      carbGoal={profile?.carb_goal ?? 200}
      fatGoal={profile?.fat_goal ?? 60}
      userGoal={profile?.goal ?? "lose"}
      userId={user.id}
      streak={streak}
      initialWater={waterLog?.glasses ?? 0}
      quickTemplates={(templates as { id: string; name: string; calories: number; protein: number; meal_type: string }[] | null) ?? []}
    />
  );
}
