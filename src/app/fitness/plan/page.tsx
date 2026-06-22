import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TRAINING_PLANS } from "@/lib/training-plans";
import { HOME_TRAINING_PLANS } from "@/lib/training-plans-home";
import Link from "next/link";
import { ProPaywall } from "@/components/ProPaywall";

const ALL_PLANS = [...TRAINING_PLANS, ...HOME_TRAINING_PLANS];

const levelColor: Record<string, string> = {
  Anfänger: "#1D9E75",
  Mittel: "#EF9F27",
  Fortgeschritten: "#E24B4A",
};

const goalIcon: Record<string, string> = {
  Muskelaufbau: "💪",
  Fettabbau: "🔥",
  Kraft: "⚡",
  Allgemein: "🎯",
};

function getRecommended(userGoal: string | null, activity: string | null, location: string): string[] {
  const isHome = location === "Zuhause";

  if (userGoal === "gain") {
    if (isHome) return ["home-muscle-dumbbell", "home-beginner", "calisthenics-starter"];
    if (activity === "high") return ["gvt", "ppl-intermediate", "upper-lower"];
    return ["ppl-intermediate", "upper-lower", "fullbody-beginner"];
  }
  if (userGoal === "lose") {
    if (isHome) return ["home-hiit-fatburn", "home-beginner", "calisthenics-starter"];
    return ["fatburn-hiit", "fullbody-beginner", "upper-lower"];
  }
  if (isHome) return ["home-beginner", "home-hiit-fatburn", "calisthenics-starter"];
  return ["fullbody-beginner", "upper-lower", "ppl-intermediate"];
}

function getNutritionTip(goal: string | null, calories: number | null, protein: number | null): string {
  if (goal === "gain") {
    return `Für Muskelaufbau: ${calories ? `${calories} kcal` : "ausreichend Kalorien"} täglich mit ${protein ? `mind. ${protein}g Protein` : "hohem Proteinanteil"}. Esse 30–60 Min vor dem Training Kohlenhydrate.`;
  }
  if (goal === "lose") {
    return `Für Fettabbau: Bleib bei ${calories ? `${calories} kcal` : "deinem Kalorienziel"} — davon ${protein ? `${protein}g Protein` : "viel Protein"} um Muskeln zu erhalten. Training nüchtern oder nach leichter Mahlzeit.`;
  }
  return `${calories ? `${calories} kcal` : "Ausgewogene Ernährung"} täglich mit ${protein ? `${protein}g Protein` : "ausreichend Protein"} unterstützt dein Training optimal.`;
}

const FILTER_CHIPS = ["Alle", "Zuhause", "Muskelaufbau", "Kraft", "Fettabbau"] as const;

export default async function PlansPage({
  searchParams,
}: {
  searchParams?: Promise<{ goal?: string; loc?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("goal, activity, name, daily_calories, protein_goal, subscription_status")
    .eq("id", user.id)
    .single();

  const isPro = profile?.subscription_status === "pro";

  const params = await searchParams;
  const activeFilter = params?.goal ?? "";
  const locFilter = params?.loc ?? "";

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";
  const recommendedIds = getRecommended(profile?.goal ?? null, profile?.activity ?? null, locFilter);

  let filtered = ALL_PLANS;
  if (locFilter === "Zuhause") filtered = ALL_PLANS.filter((p) => p.location === "Zuhause");
  else if (activeFilter) filtered = ALL_PLANS.filter((p) => p.goal === activeFilter);

  const recommended = filtered.filter((p) => recommendedIds.includes(p.id));
  const others = filtered.filter((p) => !recommendedIds.includes(p.id));

  const nutritionTip = getNutritionTip(
    profile?.goal ?? null,
    profile?.daily_calories ?? null,
    profile?.protein_goal ?? null
  );

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

        {/* Filter chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {FILTER_CHIPS.map((chip) => {
            const isHome = chip === "Zuhause";
            const isActive = chip === "Alle"
              ? !activeFilter && !locFilter
              : isHome
              ? locFilter === "Zuhause"
              : activeFilter === chip;
            const href = chip === "Alle"
              ? "/fitness/plan"
              : isHome
              ? "/fitness/plan?loc=Zuhause"
              : `/fitness/plan?goal=${chip}`;
            return (
              <Link key={chip} href={href} style={{
                padding: "7px 14px",
                borderRadius: "99px",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                background: isActive ? (isHome ? "#378ADD" : "var(--accent)") : "var(--bg-card)",
                border: isActive ? (isHome ? "1px solid #378ADD" : "1px solid var(--accent)") : "1px solid var(--border)",
                color: isActive ? "#fff" : "var(--text-secondary)",
              }}>
                {isHome ? "🏠 " : ""}{chip}
              </Link>
            );
          })}
        </div>

        {/* Personalized recommendation card */}
        <div style={{ background: "var(--g-green-main)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "16px", padding: "18px 20px", marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: nutritionTip ? "12px" : "0" }}>
            <span style={{ fontSize: "20px", flexShrink: 0 }}>◎</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-light)", marginBottom: "4px" }}>
                Empfohlen für dich
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {profile?.goal === "gain"
                  ? "Ziel Muskelaufbau — Volumen-Pläne mit progressiver Überlastung empfohlen."
                  : profile?.goal === "lose"
                  ? "Ziel Abnehmen — Kombination aus Kraft und HIIT-Kardio für maximale Fettverbrennung."
                  : "Allgemeine Fitness — ausgewogener Ganzkörper-Plan für Kraft und Ausdauer."}
              </p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(29,158,117,0.15)", paddingTop: "12px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "16px", flexShrink: 0 }}>🥗</span>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--accent-light)", fontWeight: 500 }}>Ernährungstipp: </span>
              {nutritionTip}
            </p>
          </div>
        </div>

        {/* Recommended plans */}
        {recommended.length > 0 && (
          <>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--accent-light)", marginBottom: "12px", letterSpacing: "0.5px" }}>
              {activeFilter ? activeFilter.toUpperCase() : locFilter === "Zuhause" ? "ZUHAUSE PLÄNE" : "EMPFOHLEN FÜR DICH"}
            </h2>
            <div className="grid-2col" style={{ marginBottom: "28px" }}>
              {recommended.map((plan, i) => (
                <Link key={plan.id} href={`/fitness/plan/${plan.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "var(--bg-card)", border: i === 0 && !activeFilter && !locFilter ? "1.5px solid var(--accent)" : "1px solid var(--border)", borderRadius: "16px", padding: "20px", height: "100%", position: "relative" }}>
                    {i === 0 && !activeFilter && !locFilter && (
                      <div style={{ position: "absolute", top: "-10px", left: "16px", background: "var(--accent)", color: "#fff", fontSize: "10px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px", letterSpacing: "0.5px" }}>
                        BESTE WAHL
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ fontSize: "24px" }}>{goalIcon[plan.goal]}</span>
                        {plan.location === "Zuhause" && (
                          <span style={{ fontSize: "14px", alignSelf: "center" }}>🏠</span>
                        )}
                      </div>
                      <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "3px 8px", borderRadius: "99px" }}>
                        {plan.level}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>{plan.name}</h3>
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
                      <div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>ORT</div>
                        <div style={{ fontSize: "13px", color: plan.location === "Zuhause" ? "#378ADD" : "var(--text-secondary)" }}>{plan.location}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Other plans */}
        {others.length > 0 && (
          <>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)", marginBottom: "12px", letterSpacing: "0.5px" }}>
              WEITERE PLÄNE
            </h2>
            <div className="grid-2col">
              {others.map((plan) =>
                isPro ? (
                  <Link key={plan.id} href={`/fitness/plan/${plan.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <span style={{ fontSize: "24px" }}>{goalIcon[plan.goal]}</span>
                          {plan.location === "Zuhause" && <span style={{ fontSize: "14px", alignSelf: "center" }}>🏠</span>}
                        </div>
                        <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "3px 8px", borderRadius: "99px" }}>
                          {plan.level}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>{plan.name}</h3>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "12px" }}>{plan.description}</p>
                      <span style={{ fontSize: "11px", color: plan.location === "Zuhause" ? "#378ADD" : "var(--text-muted)" }}>
                        {plan.location === "Zuhause" ? "🏠 Zuhause" : "🏋️ Gym"}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link key={plan.id} href="/upgrade" style={{ textDecoration: "none" }}>
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", height: "100%", position: "relative", overflow: "hidden" }}>
                      <div style={{ filter: "blur(2px)", opacity: 0.4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                          <span style={{ fontSize: "24px" }}>{goalIcon[plan.goal]}</span>
                          <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "3px 8px", borderRadius: "99px" }}>{plan.level}</span>
                        </div>
                        <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>{plan.name}</h3>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{plan.description}</p>
                      </div>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(12,12,14,0.6)", borderRadius: "16px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#F59E0B", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", padding: "5px 14px", borderRadius: "99px", letterSpacing: "1px" }}>
                          PRO FREISCHALTEN →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
