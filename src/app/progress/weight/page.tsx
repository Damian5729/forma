import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { WeightLogger } from "./WeightLogger";

export default async function WeightPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: logs } = await supabase
    .from("weight_logs")
    .select("id, weight, logged_at")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: true })
    .limit(30);

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("weight, height")
    .eq("id", user.id)
    .single();

  const userName = user.user_metadata?.name ?? user.email ?? "User";
  const entries = logs ?? [];

  const startWeight = entries[0]?.weight ?? profile?.weight ?? null;
  const currentWeight = entries[entries.length - 1]?.weight ?? profile?.weight ?? null;
  const diff = startWeight && currentWeight ? Math.round((currentWeight - startWeight) * 10) / 10 : null;

  const bmi = currentWeight && profile?.height
    ? Math.round((currentWeight / ((profile.height / 100) ** 2)) * 10) / 10
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/progress" userName={userName} />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 24px", color: "var(--text-primary)" }}>
          Gewichtsverlauf
        </h1>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Aktuell", val: currentWeight ? `${currentWeight} kg` : "–", color: "var(--accent-light)" },
            { label: "Veränderung", val: diff !== null ? `${diff > 0 ? "+" : ""}${diff} kg` : "–", color: diff === null ? "var(--text-primary)" : diff < 0 ? "#1D9E75" : diff > 0 ? "#E24B4A" : "var(--text-primary)" },
            { label: "BMI", val: bmi ? String(bmi) : "–", color: "var(--text-primary)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.4px" }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: "22px", fontWeight: 500, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {entries.length > 1 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 16px", color: "var(--text-primary)" }}>Verlauf</h2>
            {(() => {
              const weights = entries.map((e) => e.weight);
              const min = Math.min(...weights) - 1;
              const max = Math.max(...weights) + 1;
              const range = max - min;
              const w = 100 / (entries.length - 1);
              return (
                <div style={{ position: "relative", height: "120px", marginBottom: "8px" }}>
                  <svg viewBox={`0 0 100 100`} preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                    <polyline
                      points={entries.map((e, i) => `${i * w},${100 - ((e.weight - min) / range) * 100}`).join(" ")}
                      fill="none"
                      stroke="#1D9E75"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    {entries.map((e, i) => (
                      <circle key={i} cx={i * w} cy={100 - ((e.weight - min) / range) * 100} r="3" fill="#1D9E75" vectorEffect="non-scaling-stroke" />
                    ))}
                  </svg>
                </div>
              );
            })()}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {new Date(entries[0].logged_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {new Date(entries[entries.length - 1].logged_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
              </span>
            </div>
          </div>
        )}

        <WeightLogger userId={user.id} />

        {/* Log table */}
        {entries.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", marginTop: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 14px", color: "var(--text-primary)" }}>Einträge</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...entries].reverse().slice(0, 10).map((e) => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {new Date(e.logged_at).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" })}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{e.weight} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
