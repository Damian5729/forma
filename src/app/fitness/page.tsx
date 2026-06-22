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

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  const difficultyColor: Record<string, string> = {
    Anfänger: "#1D9E75",
    Mittel: "#EF9F27",
    Fortgeschritten: "#E24B4A",
  };

  // Muscle group detail view
  if (muscle) {
    const filtered = EXERCISES.filter((e) => e.muscle_group === muscle);
    const mg = MUSCLE_GROUPS.find((g) => g.name === muscle);

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
        <Nav active="/fitness" userName={userName} />

        <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }} className="page-enter">
          <div style={{ marginBottom: "24px" }}>
            <Link
              href="/fitness"
              style={{ fontSize: "14px", color: "var(--text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}
            >
              ← Alle Muskelgruppen
            </Link>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 6px", color: "var(--text-primary)" }}>
                  {mg?.icon} {muscle}
                </h1>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                  {filtered.length} Übungen
                </p>
              </div>
              <Link href="/fitness/plan" style={{ padding: "10px 20px", background: "var(--accent)", borderRadius: "10px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
                Trainingspläne
              </Link>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
            {filtered.map((ex, i) => (
              <Link key={ex.id} href={`/fitness/${ex.id}`} style={{ textDecoration: "none" }}>
                <div className="card-hover stagger" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px", cursor: "pointer", height: "100%", animationDelay: `${i * 0.04}s` }}>
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

  // Muscle group overview
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }} className="page-enter">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 6px", color: "var(--text-primary)" }}>
              💪 Fitness & Training
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
              {EXERCISES.length} Übungen · {MUSCLE_GROUPS.length} Muskelgruppen
            </p>
          </div>
          <Link href="/fitness/plan" style={{ padding: "10px 20px", background: "var(--accent)", borderRadius: "10px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
            Trainingspläne
          </Link>
        </div>

        <Link href="/fitness/running" style={{ textDecoration: "none", display: "block", marginBottom: "14px" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(239,159,39,0.15) 0%, rgba(239,159,39,0.06) 100%)", border: "1px solid rgba(239,159,39,0.3)", borderRadius: "16px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }} className="card-hover">
            <span style={{ fontSize: "36px", lineHeight: 1 }}>🏃</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>Laufen</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>4 Trainingspläne · Lauftagebuch</div>
            </div>
            <span style={{ fontSize: "13px", color: "#EF9F27", fontWeight: 500 }}>→</span>
          </div>
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
          {MUSCLE_GROUPS.map((mg, i) => {
            const count = EXERCISES.filter((e) => e.muscle_group === mg.name).length;
            return (
              <Link key={mg.name} href={`/fitness?muscle=${mg.name}`} style={{ textDecoration: "none" }}>
                <div
                  className="card-hover stagger"
                  style={{
                    background: `linear-gradient(135deg, ${mg.color}22 0%, ${mg.color}10 100%)`,
                    border: `1px solid ${mg.color}40`,
                    borderRadius: "16px",
                    padding: "24px 20px",
                    minHeight: "120px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    animationDelay: `${i * 0.04}s`,
                  }}
                >
                  <span style={{ fontSize: "40px", lineHeight: 1 }}>{mg.icon}</span>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{mg.name}</span>
                  <span style={{ fontSize: "12px", color: mg.color }}>{count} Übungen</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
