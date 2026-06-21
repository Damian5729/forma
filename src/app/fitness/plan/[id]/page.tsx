import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TRAINING_PLANS } from "@/lib/training-plans";
import Link from "next/link";
import { WorkoutDayLogger } from "./WorkoutDayLogger";

export default async function PlanDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const plan = TRAINING_PLANS.find((p) => p.id === id);
  if (!plan) notFound();

  const { data: history } = await supabase
    .from("workout_logs")
    .select("exercise_name, sets, logged_at")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(50);

  const lastLogByExercise: Record<string, { sets: { reps: number; weight: number }[]; date: string }> = {};
  (history ?? []).forEach((h) => {
    if (!lastLogByExercise[h.exercise_name]) {
      lastLogByExercise[h.exercise_name] = {
        sets: h.sets as { reps: number; weight: number }[],
        date: h.logged_at,
      };
    }
  });

  const userName = user.user_metadata?.name ?? user.email ?? "User";
  const levelColor: Record<string, string> = { Anfänger: "#1D9E75", Mittel: "#EF9F27", Fortgeschritten: "#E24B4A" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/fitness/plan" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
            ← Alle Pläne
          </Link>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "4px 10px", borderRadius: "99px" }}>
              {plan.level}
            </span>
            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{plan.daysPerWeek} Tage/Woche · {plan.duration}</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)" }}>{plan.name}</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.6 }}>{plan.description}</p>
        </div>

        {/* Days */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {plan.days.map((day, dayIdx) => (
            <div key={dayIdx} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
              {/* Day header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "var(--accent-light)", letterSpacing: "0.5px", marginBottom: "3px" }}>
                    {day.name.toUpperCase()}
                  </p>
                  <h2 style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>{day.focus}</h2>
                </div>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{day.exercises.length} Übungen</span>
              </div>

              {/* Exercise list */}
              <div style={{ padding: "12px 20px" }}>
                {day.exercises.map((ex, exIdx) => {
                  const last = lastLogByExercise[ex.name];
                  return (
                    <div
                      key={exIdx}
                      style={{
                        padding: "12px 0",
                        borderBottom: exIdx < day.exercises.length - 1 ? "1px solid var(--border)" : "none",
                        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link href={`/fitness/${ex.exerciseId}`} style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none" }}>
                          {ex.name}
                        </Link>
                        <div style={{ display: "flex", gap: "10px", marginTop: "3px" }}>
                          <span style={{ fontSize: "12px", color: "var(--accent-light)" }}>{ex.sets} × {ex.reps}</span>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Pause: {ex.rest}</span>
                        </div>
                        {ex.notes && <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{ex.notes}</p>}
                        {last && (
                          <p style={{ fontSize: "11px", color: "var(--accent-light)", marginTop: "3px" }}>
                            Letztes Mal: {last.sets.map((s) => `${s.reps}×${s.weight}kg`).join(", ")}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/fitness/${ex.exerciseId}`}
                        style={{ fontSize: "12px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "6px 10px", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap" }}
                      >
                        Loggen →
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Start workout button */}
              <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
                <WorkoutDayLogger dayName={day.name} exercises={day.exercises} userId={user.id} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
