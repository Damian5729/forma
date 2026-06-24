import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [{ data: meals }, { data: workouts }] = await Promise.all([
    supabase.from("meal_logs").select("logged_at").eq("user_id", user.id).gte("logged_at", `${monthStart}T00:00:00`),
    supabase.from("workout_logs").select("logged_at").eq("user_id", user.id).gte("logged_at", `${monthStart}T00:00:00`),
  ]);

  const mealDays = [...new Set((meals ?? []).map((m: { logged_at: string }) => m.logged_at.split("T")[0]))];
  const workoutDays = [...new Set((workouts ?? []).map((w: { logged_at: string }) => w.logged_at.split("T")[0]))];

  return NextResponse.json({ mealDays, workoutDays });
}
