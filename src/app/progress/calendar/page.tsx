import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { DatePicker } from "./DatePicker";
import Link from "next/link";

const mealTypeLabel: Record<string, string> = {
  breakfast: "🌅 Frühstück",
  lunch: "☀️ Mittagessen",
  dinner: "🌙 Abendessen",
  snack: "⚡ Snack",
};

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: rawDate } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date().toISOString().split("T")[0];
  const selectedDate = rawDate ?? today;

  const prevDate = new Date(selectedDate + "T12:00:00");
  prevDate.setDate(prevDate.getDate() - 1);
  const prevStr = prevDate.toISOString().split("T")[0];

  const nextDate = new Date(selectedDate + "T12:00:00");
  nextDate.setDate(nextDate.getDate() + 1);
  const nextStr = nextDate.toISOString().split("T")[0];
  const isToday = selectedDate === today;
  const isFuture = selectedDate > today;

  const [{ data: meals }, { data: profile }, { data: waterLog }, { data: workoutLogs }] = await Promise.all([
    supabase.from("meal_logs").select("*").eq("user_id", user.id)
      .gte("logged_at", `${selectedDate}T00:00:00`)
      .lte("logged_at", `${selectedDate}T23:59:59`)
      .order("logged_at", { ascending: true }),
    supabase.from("user_profiles").select("daily_calories, protein_goal, name").eq("id", user.id).single(),
    supabase.from("water_logs").select("glasses").eq("user_id", user.id).eq("logged_at", selectedDate).maybeSingle(),
    supabase.from("workout_logs").select("exercise_name, sets, day_name, day_idx, plan_id, session_id, logged_at")
      .eq("user_id", user.id)
      .gte("logged_at", `${selectedDate}T00:00:00`)
      .lte("logged_at", `${selectedDate}T23:59:59`)
      .order("logged_at", { ascending: true }),
  ]);

  const goal = profile?.daily_calories ?? 1850;
  const proteinGoal = profile?.protein_goal ?? 140;
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  const totalCal = (meals ?? []).reduce((s, m) => s + m.calories, 0);
  const totalProtein = Math.round((meals ?? []).reduce((s, m) => s + (m.protein ?? 0), 0) * 10) / 10;
  const totalCarbs = Math.round((meals ?? []).reduce((s, m) => s + (m.carbs ?? 0), 0) * 10) / 10;
  const totalFat = Math.round((meals ?? []).reduce((s, m) => s + (m.fat ?? 0), 0) * 10) / 10;

  const groups = ["breakfast", "lunch", "dinner", "snack"]
    .map((type) => ({ type, items: (meals ?? []).filter((m) => m.meal_type === type) }))
    .filter((g) => g.items.length > 0);

  const dateDisplay = new Date(selectedDate + "T12:00:00").toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const calPct = Math.min((totalCal / goal) * 100, 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/progress" userName={userName} />

      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 24px" }} className="page-enter mobile-page-pad">
        <Link href="/progress" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px", display: "inline-block" }}>
          ← Fortschritt
        </Link>

        {/* Date picker row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <Link href={`/progress/calendar?date=${prevStr}`}
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", textDecoration: "none", fontSize: "16px" }}>
            ‹
          </Link>
          <div style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "8px 14px" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 1px" }}>
              {isToday ? "Heute" : isFuture ? "Zukunft" : "Vergangener Tag"}
            </p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>{dateDisplay}</p>
          </div>
          <DatePicker value={selectedDate} max={today} />
          {!isToday && (
            <Link href={`/progress/calendar?date=${nextStr}`}
              style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", textDecoration: "none", fontSize: "16px" }}>
              ›
            </Link>
          )}
        </div>

        {isFuture ? (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔮</div>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Noch in der Zukunft — kein Log vorhanden.</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ background: "var(--g-green-dark)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "10px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "var(--accent-light)", marginBottom: "3px", letterSpacing: "1px" }}>KALORIEN</p>
                  <p style={{ fontSize: "28px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
                    {totalCal} <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 400 }}>/ {goal}</span>
                  </p>
                </div>
                <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-muted)" }}>
                  {totalCal >= goal
                    ? <span style={{ color: totalCal > goal * 1.1 ? "#E24B4A" : "#EF9F27" }}>{totalCal > goal ? `+${totalCal - goal} über Ziel` : "Ziel erreicht ✓"}</span>
                    : `${goal - totalCal} unter Ziel`}
                </div>
              </div>
              <div style={{ height: "6px", background: "var(--bg-hover)", borderRadius: "99px", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ height: "100%", width: `${calPct}%`, background: totalCal > goal ? "#E24B4A" : "linear-gradient(90deg,#1D9E75,#5DCAA5)", borderRadius: "99px" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Protein", val: `${totalProtein}g`, goal: `${proteinGoal}g`, color: "#5DCAA5" },
                  { label: "Carbs", val: `${totalCarbs}g`, color: "#5B8DD9" },
                  { label: "Fett", val: `${totalFat}g`, color: "#EF9F27" },
                ].map((m) => (
                  <div key={m.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: 500, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "2px" }}>{m.label}{m.goal ? ` / ${m.goal}` : ""}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Water */}
            {waterLog && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "22px" }}>💧</span>
                <div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 2px" }}>WASSER</p>
                  <p style={{ fontSize: "16px", fontWeight: 500, color: "#5B8DD9", margin: 0 }}>{waterLog.glasses} / 8 Gläser</p>
                </div>
                <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i < waterLog.glasses ? "#5B8DD9" : "var(--bg-hover)" }} />
                  ))}
                </div>
              </div>
            )}

            {/* Workout log */}
            {workoutLogs && workoutLogs.length > 0 && (() => {
              // Group by session_id or day_name
              const sessions: Record<string, { dayName: string; exercises: { name: string; sets: { reps: number; weight: number }[] }[] }> = {};
              workoutLogs.forEach((w) => {
                const key = w.session_id ?? w.day_name ?? "workout";
                if (!sessions[key]) sessions[key] = { dayName: w.day_name ?? "Workout", exercises: [] };
                sessions[key].exercises.push({ name: w.exercise_name, sets: w.sets as { reps: number; weight: number }[] });
              });
              return (
                <div style={{ marginBottom: "16px" }}>
                  {Object.entries(sessions).map(([key, session]) => (
                    <div key={key} style={{ background: "var(--g-blue-deep)", border: "1px solid rgba(91,141,217,0.25)", borderRadius: "14px", overflow: "hidden", marginBottom: "10px" }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(91,141,217,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "16px" }}>💪</span>
                          <span style={{ fontSize: "13px", fontWeight: 500, color: "#5B8DD9" }}>{session.dayName}</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{session.exercises.length} Übungen</span>
                      </div>
                      <div style={{ padding: "10px 16px" }}>
                        {session.exercises.map((ex, i) => (
                          <div key={i} style={{ padding: "8px 0", borderBottom: i < session.exercises.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                            <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 4px" }}>{ex.name}</p>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {ex.sets.map((s, si) => (
                                <span key={si} style={{ fontSize: "11px", color: "var(--text-secondary)", background: "rgba(91,141,217,0.1)", padding: "3px 8px", borderRadius: "6px" }}>
                                  S{si + 1}: {s.reps}×{s.weight > 0 ? `${s.weight}kg` : "–"}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Meal log */}
            {groups.length === 0 ? (
              <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "14px", padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Keine Mahlzeiten an diesem Tag geloggt.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {groups.map((g) => (
                  <div key={g.type} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
                    <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--accent-light)" }}>{mealTypeLabel[g.type] ?? g.type}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{g.items.reduce((s, m) => s + m.calories, 0)} kcal</span>
                    </div>
                    {g.items.map((m, i) => (
                      <div key={m.id} style={{ padding: "12px 16px", borderTop: i > 0 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 2px" }}>{m.name}</p>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: 0 }}>
                            {new Date(m.logged_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} · P: {m.protein}g
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{m.calories}</div>
                          <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>kcal</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
