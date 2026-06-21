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

// Match user goal to plan recommendations
function getRecommended(userGoal: string | null): string[] {
  if (userGoal === "gain") return ["ppl-intermediate", "upper-lower", "fullbody-beginner"];
  if (userGoal === "lose") return ["fatburn-hiit", "fullbody-beginner", "upper-lower"];
  return ["fullbody-beginner", "upper-lower", "ppl-intermediate"];
}

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("goal, activity, name")
    .eq("id", user.id)
    .single();

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";
  const recommendedIds = getRecommended(profile?.goal ?? null);
  const recommended = TRAINING_PLANS.filter((p) => recommendedIds.includes(p.id));
  const others = TRAINING_PLANS.filter((p) => !recommendedIds.includes(p.id));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/fitness" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Übungen</Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>
            Trainingspläne
          </h1>
        </div>

        {/* Personalized recommendation */}
        <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "10px" }}>
          <span style={{ color: "var(--accent)", fontSize: "18px", flexShrink: 0 }}>◎</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--accent-light)", marginBottom: "3px" }}>
              Empfohlen für dich
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {profile?.goal === "gain"
                ? "Dein Ziel ist Muskelaufbau — wir empfehlen Volumen-Pläne mit progressiver Überlastung."
                : profile?.goal === "lose"
                ? "Dein Ziel ist Abnehmen — wir empfehlen Kombination aus Kraft und Kardio."
                : "Allgemeine Fitness — wir empfehlen einen ausgewogenen Ganzkörper-Plan."}
            </p>
          </div>
        </div>

        {/* Recommended plans */}
        <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--accent-light)", marginBottom: "12px", letterSpacing: "0.5px" }}>
          EMPFOHLEN FÜR DICH
        </h2>
        <div className="grid-2col" style={{ marginBottom: "28px" }}>
          {recommended.map((plan, i) => (
            <Link key={plan.id} href={`/fitness/plan/${plan.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "var(--bg-card)", border: i === 0 ? "1.5px solid var(--accent)" : "1px solid var(--border)", borderRadius: "16px", padding: "20px", height: "100%", position: "relative" }}>
                {i === 0 && (
                  <div style={{ position: "absolute", top: "-10px", left: "16px", background: "var(--accent)", color: "#fff", fontSize: "10px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", letterSpacing: "0.5px" }}>
                    BESTE WAHL
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ fontSize: "26px" }}>{goalIcon[plan.goal]}</span>
                  <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "3px 8px", borderRadius: "99px" }}>
                    {plan.level}
                  </span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>{plan.name}</h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "14px" }}>{plan.description}</p>
                <div style={{ display: "flex", gap: "14px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>TAGE/WOCHE</div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--accent-light)" }}>{plan.daysPerWeek}×</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>DAUER</div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{plan.duration}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Other plans */}
        {others.length > 0 && (
          <>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)", marginBottom: "12px", letterSpacing: "0.5px" }}>
              WEITERE PLÄNE
            </h2>
            <div className="grid-2col">
              {others.map((plan) => (
                <Link key={plan.id} href={`/fitness/plan/${plan.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <span style={{ fontSize: "24px" }}>{goalIcon[plan.goal]}</span>
                      <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "3px 8px", borderRadius: "99px" }}>
                        {plan.level}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>{plan.name}</h3>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{plan.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
