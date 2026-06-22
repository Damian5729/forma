import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TagesplanClient } from "./TagesplanClient";
import Link from "next/link";

export default async function TagesplanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date().toISOString().split("T")[0];

  const [{ data: profile }, { data: todayMeals }, { data: recipes }] = await Promise.all([
    supabase.from("user_profiles").select("daily_calories, protein_goal, name").eq("id", user.id).single(),
    supabase.from("meal_logs").select("calories").eq("user_id", user.id)
      .gte("logged_at", `${today}T00:00:00`).lte("logged_at", `${today}T23:59:59`),
    supabase.from("recipes").select("id, title, calories, protein, carbs, fat, duration, tags, ingredients"),
  ]);

  const consumed = (todayMeals ?? []).reduce((s: number, m: { calories: number }) => s + m.calories, 0);
  const goal = profile?.daily_calories ?? 1850;
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  const remaining = goal - consumed;
  const dateStr = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/dashboard" userName={userName} />
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 24px" }} className="page-enter mobile-page-pad">

        <Link href="/dashboard" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "20px" }}>
          ← Dashboard
        </Link>

        {/* Header */}
        <div style={{ background: "var(--g-green-dark)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "18px", padding: "24px", marginBottom: "22px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
          <p style={{ fontSize: "11px", color: "var(--accent-light)", letterSpacing: "2px", marginBottom: "6px" }}>TAGESPLAN</p>
          <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: "8px" }}>
            Dein Plan für {dateStr}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            {consumed > 0
              ? `${consumed} kcal bereits geloggt — ${remaining > 0 ? `noch ${remaining} kcal für heute.` : `Tagesziel erreicht!`}`
              : `Tagesziel: ${goal} kcal. Rezepte ausgewählt, damit du heute gut isst.`}
          </p>
        </div>

        <TagesplanClient
          recipes={(recipes ?? []).map((r) => ({ ...r, tags: r.tags as string[] }))}
          userId={user.id}
          consumed={consumed}
          goal={goal}
        />
      </main>
    </div>
  );
}
