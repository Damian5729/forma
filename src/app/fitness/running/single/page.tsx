import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { SINGLE_RUNS } from "@/lib/running-singles";
import Link from "next/link";

const effortColor: Record<string, string> = {
  Leicht: "#1D9E75",
  Mittel: "#EF9F27",
  Hart: "#E24B4A",
};

const typeColor: Record<string, string> = {
  Intervall: "#E24B4A",
  Tempo: "#EF9F27",
  Easy: "#1D9E75",
  Fartlek: "#8B5CF6",
  Kraft: "#378ADD",
};

export default async function SingleRunsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("user_profiles").select("name").eq("id", user.id).single();
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  const grouped = SINGLE_RUNS.reduce((acc, run) => {
    (acc[run.type] ??= []).push(run);
    return acc;
  }, {} as Record<string, typeof SINGLE_RUNS>);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/fitness/running" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Laufen</Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>
            🏃 Einzelläufe
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Starte direkt ohne Wochenplan — wähle dein Workout.
          </p>
        </div>

        {Object.entries(grouped).map(([type, runs]) => (
          <div key={type} style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: typeColor[type] ?? "#aaa" }} />
              <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                {type.toUpperCase()}
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {runs.map((run) => (
                <Link key={run.id} href={`/fitness/running/log?type=${encodeURIComponent(run.name)}&duration=${run.duration}&distance=${encodeURIComponent(run.distance)}`} style={{ textDecoration: "none" }}>
                  <div className="card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 18px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "28px", lineHeight: 1, flexShrink: 0, marginTop: "2px" }}>{run.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                        <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>{run.name}</h3>
                        <span style={{ fontSize: "10px", color: effortColor[run.effort], background: `${effortColor[run.effort]}18`, padding: "3px 8px", borderRadius: "99px", flexShrink: 0, marginLeft: "8px" }}>
                          {run.effort}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.5 }}>{run.description}</p>
                      <div style={{ background: "var(--bg-hover)", borderRadius: "8px", padding: "8px 10px", fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace", lineHeight: 1.6 }}>
                        {run.structure}
                      </div>
                      <div style={{ display: "flex", gap: "14px", marginTop: "10px" }}>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>⏱ {run.duration} Min</span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>📍 {run.distance}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
