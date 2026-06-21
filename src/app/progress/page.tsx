import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { WeeklyChart } from "./WeeklyChart";
import Link from "next/link";

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

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
    if ((prev.getTime() - curr.getTime()) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}

export default async function Progress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const days = getLast7Days();
  const start = days[0] + "T00:00:00";
  const end = days[6] + "T23:59:59";

  const [{ data: logs }, { data: profile }, { data: allLogs }, { data: latestWeight }] = await Promise.all([
    supabase.from("meal_logs").select("calories, protein, logged_at").eq("user_id", user.id).gte("logged_at", start).lte("logged_at", end),
    supabase.from("user_profiles").select("daily_calories, protein_goal, goal, weight, height").eq("id", user.id).single(),
    supabase.from("meal_logs").select("logged_at").eq("user_id", user.id).order("logged_at", { ascending: false }).limit(60),
    supabase.from("weight_logs").select("weight, logged_at").eq("user_id", user.id).order("logged_at", { ascending: false }).limit(2),
  ]);

  const goal = profile?.daily_calories ?? 1850;
  const proteinGoal = profile?.protein_goal ?? 140;
  const streak = calcStreak((allLogs ?? []).map((l) => l.logged_at));

  const bmi = profile?.weight && profile?.height
    ? Math.round((profile.weight / ((profile.height / 100) ** 2)) * 10) / 10
    : null;

  const currentWeight = latestWeight?.[0]?.weight ?? profile?.weight ?? null;
  const prevWeight = latestWeight?.[1]?.weight ?? null;
  const weightDiff = currentWeight && prevWeight ? Math.round((currentWeight - prevWeight) * 10) / 10 : null;

  const dayData = days.map((date) => {
    const dayLogs = (logs ?? []).filter((l) => l.logged_at.startsWith(date));
    return {
      date,
      label: new Date(date + "T12:00:00").toLocaleDateString("de-DE", { weekday: "short" }),
      calories: dayLogs.reduce((s, l) => s + l.calories, 0),
      protein: Math.round(dayLogs.reduce((s, l) => s + (l.protein ?? 0), 0) * 10) / 10,
    };
  });

  const logged = dayData.filter((d) => d.calories > 0);
  const totalDaysLogged = logged.length;
  const avgCalories = totalDaysLogged > 0 ? Math.round(logged.reduce((s, d) => s + d.calories, 0) / totalDaysLogged) : 0;
  const avgProtein = totalDaysLogged > 0 ? Math.round(logged.reduce((s, d) => s + d.protein, 0) / totalDaysLogged * 10) / 10 : 0;

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/progress" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 24px", color: "var(--text-primary)" }}>Fortschritt</h1>

        {/* Quick stats */}
        <div className="grid-4col" style={{ marginBottom: "20px" }}>
          {[
            { label: "Streak", val: streak > 0 ? `${streak}` : "–", unit: streak > 0 ? "Tage" : "", color: streak >= 7 ? "#EF9F27" : "var(--accent-light)" },
            { label: "Ø Kalorien", val: avgCalories > 0 ? `${avgCalories}` : "–", unit: "kcal", color: "var(--text-primary)" },
            { label: "Ø Protein", val: avgProtein > 0 ? `${avgProtein}` : "–", unit: "g", color: "var(--text-primary)" },
            { label: "BMI", val: bmi ? `${bmi}` : "–", unit: "", color: bmi ? (bmi < 25 ? "var(--accent-light)" : "#EF9F27") : "var(--text-muted)" },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "5px", letterSpacing: "0.4px" }}>{m.label.toUpperCase()}</div>
              <div style={{ fontSize: "20px", fontWeight: 500, color: m.color }}>
                {m.val}<span style={{ fontSize: "11px", marginLeft: "2px", fontWeight: 400 }}>{m.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Weight + Body quick access */}
        <div className="grid-2col" style={{ marginBottom: "20px" }}>
          <Link href="/progress/weight" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", textDecoration: "none", display: "block" }}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>AKTUELLES GEWICHT</p>
            <p style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "3px" }}>
              {currentWeight ? `${currentWeight} kg` : "–"}
            </p>
            {weightDiff !== null && (
              <p style={{ fontSize: "12px", color: weightDiff <= 0 ? "var(--accent-light)" : "#E24B4A" }}>
                {weightDiff > 0 ? "+" : ""}{weightDiff} kg zur letzten Messung
              </p>
            )}
            {!currentWeight && <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Noch kein Gewicht eingetragen →</p>}
          </Link>
          <Link href="/profile/measurements" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", textDecoration: "none", display: "block" }}>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>KÖRPERMASSE</p>
            <p style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "3px" }}>Maße tracken</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Taille, Hüfte, Arme →</p>
          </Link>
        </div>

        {/* Tage der Woche */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 20px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "12px", letterSpacing: "0.5px" }}>DIESE WOCHE — {totalDaysLogged}/7 TAGE</p>
          <div style={{ display: "flex", gap: "6px" }}>
            {dayData.map((d) => (
              <div key={d.date} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ width: "100%", aspectRatio: "1", borderRadius: "8px", background: d.calories > 0 ? (d.calories <= goal ? "var(--accent)" : "#EF9F27") : "var(--bg-hover)", marginBottom: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {d.calories > 0 && <span style={{ fontSize: "10px", color: "#fff" }}>✓</span>}
                </div>
                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calorie chart */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>Kalorien</h2>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Ziel {goal} kcal/Tag</span>
          </div>
          <WeeklyChart dayData={dayData} goal={goal} />
        </div>

        {/* Protein chart */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>Protein</h2>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Ziel {proteinGoal}g/Tag</span>
          </div>
          <WeeklyChart dayData={dayData} goal={proteinGoal} mode="protein" />
        </div>
      </main>
    </div>
  );
}
