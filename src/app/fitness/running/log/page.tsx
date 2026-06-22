// Run in Supabase SQL Editor:
// CREATE TABLE running_logs (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
//   date date NOT NULL,
//   distance_km numeric NOT NULL,
//   duration_minutes numeric NOT NULL,
//   pace_per_km text,
//   notes text,
//   created_at timestamptz DEFAULT now()
// );
// ALTER TABLE running_logs ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users see own logs" ON running_logs FOR ALL USING (auth.uid() = user_id);

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import { LogClient } from "./LogClient";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default async function RunningLogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  let logs: { id: string; date: string; distance_km: number; duration_minutes: number; pace_per_km: string | null; notes: string | null }[] = [];

  try {
    const { data } = await supabase
      .from("running_logs")
      .select("id, date, distance_km, duration_minutes, pace_per_km, notes")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(10);
    logs = data ?? [];
  } catch {
    logs = [];
  }

  const totalKm = logs.reduce((sum, l) => sum + Number(l.distance_km), 0);
  const totalRuns = logs.length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "640px" }}>
        <div style={{ marginBottom: "8px" }}>
          <Link href="/fitness/running" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
            ← Laufen
          </Link>
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", margin: "12px 0 6px" }}>
          🏃 Lauftagebuch
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: "0 0 24px" }}>
          Erfasse deine Läufe und verfolge deinen Fortschritt.
        </p>

        {totalRuns > 0 && (
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 18px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 600, color: "#EF9F27" }}>{totalRuns}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Läufe</div>
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 18px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 600, color: "#EF9F27" }}>{totalKm.toFixed(1)} km</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Gesamt</div>
            </div>
          </div>
        )}

        <LogClient userId={user.id} />

        <h2 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "14px" }}>
          Letzte Läufe
        </h2>

        {logs.length === 0 ? (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "32px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
              Noch keine Läufe erfasst. Trag deinen ersten Lauf ein!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {logs.map((log) => (
              <div key={log.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{formatDate(log.date)}</span>
                  {log.pace_per_km && (
                    <span style={{ fontSize: "11px", color: "#EF9F27", background: "rgba(239,159,39,0.1)", padding: "2px 8px", borderRadius: "99px" }}>
                      {log.pace_per_km}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)" }}>{Number(log.distance_km).toFixed(1)} km</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Distanz</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {Math.floor(log.duration_minutes)}:{String(Math.round((log.duration_minutes % 1) * 60)).padStart(2, "0")} min
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Zeit</div>
                  </div>
                </div>
                {log.notes && (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "8px 0 0", lineHeight: 1.5 }}>
                    {log.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
