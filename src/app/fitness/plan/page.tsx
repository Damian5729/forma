import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TRAINING_PLANS } from "@/lib/training-plans";
import Link from "next/link";

const levelColor: Record<string, string> = {
  Anfänger: "#1D9E75",
  Mittel: "#EF9F27",
  Fortgeschritten: "#E24B4A",
};

const goalIcon: Record<string, string> = {
  Muskelaufbau: "◎",
  Fettabbau: "◇",
  Kraft: "⬡",
  Allgemein: "◈",
};

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/fitness" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
            ← Zurück zu Übungen
          </Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>
            Trainingspläne
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Fertige Pläne — einfach auswählen und loslegen
          </p>
        </div>

        <div className="grid-2col">
          {TRAINING_PLANS.map((plan) => (
            <Link key={plan.id} href={`/fitness/plan/${plan.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", height: "100%", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "28px" }}>{goalIcon[plan.goal]}</span>
                  <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "4px 10px", borderRadius: "99px" }}>
                    {plan.level}
                  </span>
                </div>

                <h2 style={{ fontSize: "17px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px" }}>
                  {plan.name}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
                  {plan.description}
                </p>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>TAGE/WOCHE</div>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--accent-light)" }}>{plan.daysPerWeek}×</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>DAUER</div>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}>{plan.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>ZIEL</div>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}>{plan.goal}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
