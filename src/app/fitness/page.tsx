import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { EXERCISES, MUSCLE_GROUPS } from "@/lib/exercises";
import Link from "next/link";

export default async function Fitness({ searchParams }: { searchParams: Promise<{ muscle?: string }> }) {
  const { muscle } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const filtered = muscle
    ? EXERCISES.filter((e) => e.muscle_group === muscle)
    : EXERCISES;

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  const difficultyColor: Record<string, string> = {
    Anfänger: "#1D9E75",
    Mittel: "#EF9F27",
    Fortgeschritten: "#E24B4A",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 6px", color: "var(--text-primary)" }}>
              Fitness & Training
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
              {EXERCISES.length} Übungen · {MUSCLE_GROUPS.length} Muskelgruppen
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link href="/fitness/plan" style={{ padding: "10px 20px", background: "var(--accent)", borderRadius: "10px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
              Trainingspläne
            </Link>
          </div>
        </div>

        {/* Muscle groups */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px", marginBottom: "28px" }}>
          <Link
            href="/fitness"
            style={{ background: !muscle ? "var(--accent-bg)" : "var(--bg-card)", border: !muscle ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "12px", padding: "12px 8px", textAlign: "center", textDecoration: "none" }}
          >
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>◎</div>
            <div style={{ fontSize: "11px", color: !muscle ? "var(--accent-light)" : "var(--text-secondary)" }}>Alle</div>
          </Link>
          {MUSCLE_GROUPS.map((mg) => (
            <Link
              key={mg.name}
              href={`/fitness?muscle=${mg.name}`}
              style={{ background: muscle === mg.name ? "var(--accent-bg)" : "var(--bg-card)", border: muscle === mg.name ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "12px", padding: "12px 8px", textAlign: "center", textDecoration: "none" }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{mg.icon}</div>
              <div style={{ fontSize: "11px", color: muscle === mg.name ? "var(--accent-light)" : "var(--text-secondary)" }}>{mg.name}</div>
            </Link>
          ))}
        </div>

        {/* Exercise list */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
          {filtered.map((ex) => (
            <Link key={ex.id} href={`/fitness/${ex.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px", cursor: "pointer", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: 0, flex: 1 }}>
                    {ex.name}
                  </h3>
                  <span style={{ fontSize: "10px", color: difficultyColor[ex.difficulty], background: `${difficultyColor[ex.difficulty]}20`, padding: "3px 8px", borderRadius: "99px", marginLeft: "8px", whiteSpace: "nowrap" }}>
                    {ex.difficulty}
                  </span>
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {ex.description}
                </p>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "10px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "3px 8px", borderRadius: "99px" }}>
                    {ex.muscle_group}
                  </span>
                  {ex.secondary_muscles.slice(0, 2).map((m) => (
                    <span key={m} style={{ fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "3px 8px", borderRadius: "99px" }}>
                      {m}
                    </span>
                  ))}
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "3px 8px", borderRadius: "99px" }}>
                    {ex.equipment}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
