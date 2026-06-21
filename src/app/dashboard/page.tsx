import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date().toISOString().split("T")[0];

  const { data: meals } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("logged_at", `${today}T00:00:00`)
    .lte("logged_at", `${today}T23:59:59`)
    .order("logged_at", { ascending: true });

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  return (
    <DashboardClient
      userName={userName}
      initialMeals={meals ?? []}
      goal={1850}
    />
  );
}
