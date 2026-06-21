import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { MeasurementLogger } from "./MeasurementLogger";
import Link from "next/link";

const fields = [
  { key: "waist", label: "Taille", unit: "cm" },
  { key: "hips", label: "Hüfte", unit: "cm" },
  { key: "chest", label: "Brust", unit: "cm" },
  { key: "arms", label: "Arme (Bicep)", unit: "cm" },
  { key: "thighs", label: "Oberschenkel", unit: "cm" },
];

export default async function Measurements() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: logs } = await supabase
    .from("body_measurements")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(10);

  const userName = user.user_metadata?.name ?? user.email ?? "User";
  const latest = logs?.[0] ?? null;
  const prev = logs?.[1] ?? null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/profile" userName={userName} />
      <main className="main-pad" style={{ maxWidth: "640px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/profile" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Profil</Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>Körpermaße</h1>
        </div>

        {/* Current measurements */}
        {latest && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
            {fields.map((f) => {
              const cur = latest[f.key as keyof typeof latest] as number | null;
              const old = prev?.[f.key as keyof typeof prev] as number | null;
              const diff = cur && old ? Math.round((cur - old) * 10) / 10 : null;
              return (
                <div key={f.key} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>{f.label.toUpperCase()}</div>
                  <div style={{ fontSize: "20px", fontWeight: 500, color: cur ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {cur ? `${cur} ${f.unit}` : "–"}
                  </div>
                  {diff !== null && (
                    <div style={{ fontSize: "11px", color: diff < 0 ? "#1D9E75" : diff > 0 ? "#E24B4A" : "var(--text-muted)", marginTop: "2px" }}>
                      {diff > 0 ? "+" : ""}{diff} cm
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <MeasurementLogger userId={user.id} />

        {/* History */}
        {logs && logs.length > 1 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", marginTop: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "14px" }}>Verlauf</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", color: "var(--text-muted)", padding: "4px 8px 8px 0", fontWeight: 400 }}>Datum</th>
                    {fields.map((f) => (
                      <th key={f.key} style={{ textAlign: "right", color: "var(--text-muted)", padding: "4px 0 8px 8px", fontWeight: 400 }}>{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 8).map((l) => (
                    <tr key={l.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ color: "var(--text-secondary)", padding: "8px 8px 8px 0" }}>
                        {new Date(l.logged_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                      </td>
                      {fields.map((f) => (
                        <td key={f.key} style={{ textAlign: "right", color: "var(--text-primary)", padding: "8px 0 8px 8px" }}>
                          {(l[f.key as keyof typeof l] as number | null) ?? "–"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
