import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { WochenplanClient } from "./WochenplanClient";
import Link from "next/link";

export default async function WochenplanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: recipes }] = await Promise.all([
    supabase.from("user_profiles").select("daily_calories, protein_goal, name").eq("id", user.id).single(),
    supabase.from("recipes").select("id, title, calories, protein, carbs, fat, duration, tags, ingredients"),
  ]);

  const dailyGoal = profile?.daily_calories ?? 1850;
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  const monday = (() => {
    const d = new Date();
    const dow = d.getDay();
    d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
  })();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/dashboard" userName={userName} />
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 24px" }} className="page-enter mobile-page-pad">

        <Link href="/dashboard/tagesplan" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px", display: "inline-block" }}>
          ← Tagesplan
        </Link>

        <div style={{ background: "var(--g-purple)", border: "1px solid rgba(93,202,165,0.15)", borderRadius: "18px", padding: "24px", marginBottom: "22px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📅</div>
          <p style={{ fontSize: "11px", color: "var(--accent-light)", letterSpacing: "2px", marginBottom: "6px" }}>WOCHENPLAN</p>
          <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: "8px" }}>
            KW ab {monday}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            7 Tage, {dailyGoal} kcal/Tag — tausche einzelne Rezepte aus oder logge gleich alles auf einmal.
          </p>
        </div>

        <WochenplanClient
          recipes={(recipes ?? []).map((r) => ({ ...r, tags: r.tags as string[], ingredients: r.ingredients as { name: string; amount: string }[] | undefined }))}
          userId={user.id}
          dailyGoal={dailyGoal}
        />
      </main>
    </div>
  );
}
