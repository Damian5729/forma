import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { CoachClient } from "./CoachClient";
import Link from "next/link";

export default async function CoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("goal, weight, height, body_fat_pct, daily_calories, protein_goal, name, subscription_status")
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

  const isPro = profile?.subscription_status?.toLowerCase() === "pro";

  if (!isPro) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
        <Nav active="/coach" userName={userName} />
        <main style={{ maxWidth: "560px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>🤖</div>
          <h1 style={{ fontSize: "26px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: "0 0 12px" }}>
            KI-Coach ist Pro
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: "0 0 32px", lineHeight: 1.6 }}>
            Personalisierte Empfehlungen, Makro-Analyse und smarte Ernährungstipps — nur mit forma Pro.
          </p>
          <Link href="/upgrade" style={{ padding: "14px 36px", background: "linear-gradient(135deg,#F59E0B,#EF9F27)", color: "#000", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: 700, boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}>
            Pro freischalten — 14,99€/Monat →
          </Link>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px" }}>Jederzeit kündbar · Rechnung per E-Mail</p>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/coach" userName={userName} />
      <CoachClient userContext={userContext} />
    </div>
  );
}
