import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { CoachClient } from "./CoachClient";

export default async function CoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("goal, weight, height, body_fat_pct, daily_calories, protein_goal, name")
    .eq("id", user.id)
    .single();

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  const userContext = {
    name: userName,
    goal: profile?.goal ?? "–",
    weight: profile?.weight ?? undefined,
    height: profile?.height ?? undefined,
    bodyFat: profile?.body_fat_pct ?? undefined,
    dailyCalories: profile?.daily_calories ?? undefined,
    proteinGoal: profile?.protein_goal ?? undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/coach" userName={userName} />
      <CoachClient userContext={userContext} />
    </div>
  );
}
