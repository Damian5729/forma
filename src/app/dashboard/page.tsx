import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date().toISOString().split("T")[0];

  const [{ data: meals }, { data: profile }] = await Promise.all([
    supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_at", `${today}T00:00:00`)
      .lte("logged_at", `${today}T23:59:59`)
      .order("logged_at", { ascending: true }),
    supabase
      .from("user_profiles")
      .select("daily_calories, protein_goal, carb_goal, fat_goal, name, goal")
      .eq("id", user.id)
      .single(),
  ]);

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  return (
    <DashboardClient
      userName={userName}
      initialMeals={meals ?? []}
      goal={profile?.daily_calories ?? 1850}
      proteinGoal={profile?.protein_goal ?? 140}
      userGoal={profile?.goal ?? "lose"}
    />
  );
}
