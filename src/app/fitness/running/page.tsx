import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ProPaywall } from "@/components/ProPaywall";
import { RUNNING_PLANS } from "@/lib/running-plans";
import Link from "next/link";

const levelColor: Record<string, string> = {
  Einsteiger: "#1D9E75",
  Mittel: "#EF9F27",
  Fortgeschritten: "#E24B4A",
};

const goalIcon: Record<string, string> = {
  "5km": "🎯",
  "10km": "🏅",
  Halbmarathon: "🏆",
  Abnehmen: "🔥",
  Allgemein: "⚡",
};

export default async function RunningPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name, subscription_status")
    .eq("id", user.id)
    .single();

  const isPro = profile?.subscription_status === "pro";
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "8px" }}>
          <Link href="/fitness" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
            ← Fitness
          </Link>
        </div>

        {!isPro && (
          <ProPaywall
            icon="🏃"
            title="Laufpläne & Einzelläufe"
            description="Alle Laufpläne, strukturierten Einheiten und Einzelläufe sind exklusiv für forma Pro Nutzer."
          />
        )}
        {isPro && (<>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", margin: "12px 0 6px" }}>
              🏃 Laufen
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
              {RUNNING_PLANS.length} Trainingspläne · Von Einsteiger bis Fortgeschritten
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Link
              href="/fitness/running/single"
              style={{ padding: "10px 18px", background: "rgba(239,159,39,0.12)", border: "1px solid rgba(239,159,39,0.3)", borderRadius: "10px", color: "#EF9F27", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}
            >
              ⚡ Einzelläufe
            </Link>
            <Link
              href="/fitness/running/log"
              style={{ padding: "10px 18px", background: "#EF9F27", borderRadius: "10px", color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}
            >
              Lauf loggen
            </Link>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(239,159,39,0.12) 0%, rgba(239,159,39,0.05) 100%)", border: "1px solid rgba(239,159,39,0.25)", borderRadius: "16px", padding: "18px 20px", marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "20px", flexShrink: 0 }}>👟</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#EF9F27", marginBottom: "4px" }}>
                Wähle deinen Plan
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                Jeder Plan enthält wöchentliche Einheiten mit genauer Struktur, Tempo und Zielvorgabe. Tracke deine Läufe mit dem Lauftagebuch.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-2col">
          {RUNNING_PLANS.map((plan, i) => (
            <Link key={plan.id} href={`/fitness/running/${plan.id}`} style={{ textDecoration: "none" }}>
              <div
                className="card-hover stagger"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "20px",
                  height: "100%",
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ fontSize: "28px" }}>{goalIcon[plan.goal]}</span>
                  <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "3px 8px", borderRadius: "99px" }}>
                    {plan.level}
                  </span>
                </div>

                <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
                  {plan.description}
                </p>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>WOCHEN</div>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "#EF9F27" }}>{plan.weeksTotal}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>TAGE/WOCHE</div>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}>{plan.daysPerWeek}×</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>ZIEL</div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{plan.goal}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </>)}
      </main>
    </div>
  );
}
