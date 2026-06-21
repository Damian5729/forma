import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { WeeklyChart } from "./WeeklyChart";

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default async function Progress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const days = getLast7Days();
  const start = days[0] + "T00:00:00";
  const end = days[6] + "T23:59:59";

  const { data: logs } = await supabase
    .from("meal_logs")
    .select("calories, protein, logged_at")
    .eq("user_id", user.id)
    .gte("logged_at", start)
    .lte("logged_at", end);

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("daily_calories, protein_goal")
    .eq("id", user.id)
    .single();

  const goal = profile?.daily_calories ?? 1850;
  const proteinGoal = profile?.protein_goal ?? 140;

  const dayData = days.map((date) => {
    const dayLogs = (logs ?? []).filter((l) => l.logged_at.startsWith(date));
    return {
      date,
      label: new Date(date).toLocaleDateString("de-DE", { weekday: "short" }),
      calories: dayLogs.reduce((s, l) => s + l.calories, 0),
      protein: Math.round(dayLogs.reduce((s, l) => s + (l.protein ?? 0), 0) * 10) / 10,
    };
  });

  const totalDaysLogged = dayData.filter((d) => d.calories > 0).length;
  const avgCalories = totalDaysLogged > 0
    ? Math.round(dayData.filter((d) => d.calories > 0).reduce((s, d) => s + d.calories, 0) / totalDaysLogged)
    : 0;
  const avgProtein = totalDaysLogged > 0
    ? Math.round(dayData.filter((d) => d.calories > 0).reduce((s, d) => s + d.protein, 0) / totalDaysLogged * 10) / 10
    : 0;

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/progress" userName={userName} />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 28px", color: "var(--text-primary)" }}>
          Wochenübersicht
        </h1>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Tage geloggt", val: `${totalDaysLogged}/7`, color: "var(--accent-light)" },
            { label: "Ø Kalorien", val: avgCalories > 0 ? `${avgCalories}` : "–", unit: avgCalories > 0 ? "kcal" : "", color: "var(--text-primary)" },
            { label: "Ø Protein", val: avgProtein > 0 ? `${avgProtein}g` : "–", color: "var(--text-primary)" },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.5px" }}>{m.label.toUpperCase()}</div>
              <div style={{ fontSize: "24px", fontWeight: 500, color: m.color }}>
                {m.val}<span style={{ fontSize: "13px", marginLeft: "2px" }}>{(m as { unit?: string }).unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>Kalorien der letzten 7 Tage</h2>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Ziel: {goal} kcal</span>
          </div>
          <WeeklyChart dayData={dayData} goal={goal} />
        </div>

        {/* Protein chart */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>Protein der letzten 7 Tage</h2>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Ziel: {proteinGoal}g</span>
          </div>
          <WeeklyChart dayData={dayData} goal={proteinGoal} mode="protein" />
        </div>
      </main>
    </div>
  );
}
