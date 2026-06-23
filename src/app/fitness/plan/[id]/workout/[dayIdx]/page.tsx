import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { TRAINING_PLANS, TrainingPlan } from "@/lib/training-plans";
import { HOME_TRAINING_PLANS } from "@/lib/training-plans-home";
const ALL_PLANS = [...TRAINING_PLANS, ...HOME_TRAINING_PLANS];
import { WorkoutPlayer } from "./WorkoutPlayer";

export default async function WorkoutPage({ params }: { params: Promise<{ id: string; dayIdx: string }> }) {
  const { id, dayIdx: dayIdxStr } = await params;
  const dayIdx = parseInt(dayIdxStr);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let plan: TrainingPlan | null = ALL_PLANS.find((p) => p.id === id) ?? null;

  if (!plan) {
    const { data } = await supabase
      .from("custom_plans")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (data) {
      plan = {
        id: data.id,
        name: data.name,
        description: data.description,
        level: data.level,
        daysPerWeek: data.days_per_week,
        goal: data.goal,
        duration: data.duration,
        location: data.location,
        days: data.days,
      } as TrainingPlan;
    }
  }

  if (!plan || isNaN(dayIdx) || dayIdx >= plan.days.length) notFound();

  const day = plan.days[dayIdx];

  // Load user overrides, profile (for body weight), and last session in parallel
  const [{ data: override }, { data: profile }, { data: history }] = await Promise.all([
    supabase.from("user_plan_overrides").select("exercises")
      .eq("user_id", user.id).eq("plan_id", id).eq("day_idx", dayIdx).maybeSingle(),
    supabase.from("user_profiles").select("weight").eq("id", user.id).single(),
    supabase.from("workout_logs").select("exercise_name, sets, logged_at")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(200),
  ]);

  const exercises = (override?.exercises as typeof day.exercises | null) ?? day.exercises;

  const lastSessions: Record<string, { sets: { reps: number; weight: number }[]; date: string }> = {};
  (history ?? []).forEach((h) => {
    if (!lastSessions[h.exercise_name]) {
      lastSessions[h.exercise_name] = {
        sets: h.sets as { reps: number; weight: number }[],
        date: h.logged_at,
      };
    }
  });

  return (
    <WorkoutPlayer
      planId={id}
      dayIdx={dayIdx}
      dayName={day.name}
      dayFocus={day.focus}
      exercises={exercises}
      lastSessions={lastSessions}
      userId={user.id}
      userWeight={profile?.weight ?? null}
    />
  );
}
