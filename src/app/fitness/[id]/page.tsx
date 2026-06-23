import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { EXERCISES } from "@/lib/exercises";
import Link from "next/link";
import { SingleExercisePlayer } from "./SingleExercisePlayer";

const difficultyColor: Record<string, string> = {
  Anfänger: "#1D9E75",
  Mittel: "#EF9F27",
  Fortgeschritten: "#E24B4A",
};

export default async function ExerciseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const exercise = EXERCISES.find((e) => e.id === id);
  if (!exercise) notFound();

  const [{ data: history }, { data: profile }] = await Promise.all([
    supabase.from("workout_logs").select("sets, logged_at")
      .eq("user_id", user.id)
      .eq("exercise_name", exercise.name)
      .order("logged_at", { ascending: false })
      .limit(5),
    supabase.from("user_profiles").select("weight").eq("id", user.id).single(),
  ]);

  const lastSession = history && history.length > 0
    ? { sets: history[0].sets as { reps: number; weight: number }[], date: history[0].logged_at }
    : null;

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
        <Link href="/fitness" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
          ← Zurück zu Übungen
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
            <span style={{ fontSize: "11px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "4px 10px", borderRadius: "99px" }}>
              {exercise.muscle_group}
            </span>
            <span style={{ fontSize: "11px", color: difficultyColor[exercise.difficulty], background: `${difficultyColor[exercise.difficulty]}20`, padding: "4px 10px", borderRadius: "99px" }}>
              {exercise.difficulty}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "4px 10px", borderRadius: "99px" }}>
              {exercise.equipment}
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 500, margin: "0 0 10px", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            {exercise.name}
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            {exercise.description}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>PRIMÄRER MUSKEL</div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--accent-light)" }}>{exercise.muscle_group}</div>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>KALORIENVERBRAUCH</div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>~{exercise.calories_per_minute} kcal/Min</div>
          </div>
        </div>

        {exercise.secondary_muscles.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }}>SYNERGISTEN</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {exercise.secondary_muscles.map((m) => (
                <span key={m} style={{ fontSize: "12px", color: "var(--text-secondary)", background: "var(--bg-hover)", padding: "4px 10px", borderRadius: "99px" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          {/* Steps */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 500, margin: "0 0 16px", color: "var(--text-primary)" }}>Ausführung</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {exercise.steps.map((step, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "var(--accent-light)", fontWeight: 500, flexShrink: 0, marginTop: "1px" }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "14px", padding: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 500, margin: "0 0 12px", color: "var(--accent-light)" }}>Tipps</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {exercise.tips.map((tip, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, display: "flex", gap: "8px" }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0 }}>◎</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <SingleExercisePlayer
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              userId={user.id}
              userWeight={profile?.weight ?? null}
              lastSession={lastSession}
            />
          </div>
        </div>

        {/* History */}
        {history && history.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 500, margin: "0 0 16px", color: "var(--text-primary)" }}>Letzte Sessions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {history.map((h, i) => {
                const sets = h.sets as { reps: number; weight: number }[];
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      {new Date(h.logged_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {sets.map((s, j) => (
                        <span key={j} style={{ fontSize: "11px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "3px 8px", borderRadius: "6px" }}>
                          {s.reps} × {s.weight > 0 ? `${s.weight}kg` : "KG"}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
