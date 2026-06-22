import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { RunStartButton } from "@/components/RunStartButton";
import { RUNNING_PLANS } from "@/lib/running-plans";
import Link from "next/link";

const effortColor: Record<string, string> = {
  Leicht: "#1D9E75",
  Mittel: "#EF9F27",
  Hart: "#E24B4A",
};

const typeColor: Record<string, string> = {
  Intervall: "#E24B4A",
  Tempo: "#EF9F27",
  "Langer Lauf": "#378ADD",
  "Easy Run": "#1D9E75",
  Fartlek: "#8B5CF6",
  Bergläufe: "#6B7280",
};

const levelColor: Record<string, string> = {
  Einsteiger: "#1D9E75",
  Mittel: "#EF9F27",
  Fortgeschritten: "#E24B4A",
};

export default async function RunningPlanDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const plan = RUNNING_PLANS.find((p) => p.id === id);
  if (!plan) notFound();

  const { data: profile } = await supabase.from("user_profiles").select("name, active_running_plan_id").eq("id", user.id).single();
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";
  const isActive = profile?.active_running_plan_id === id;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "8px" }}>
          <Link href="/fitness/running" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
            ← Laufpläne
          </Link>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "10px", color: levelColor[plan.level], background: `${levelColor[plan.level]}20`, padding: "4px 10px", borderRadius: "99px" }}>
            {plan.level}
          </span>
          <span style={{ fontSize: "10px", color: "#EF9F27", background: "rgba(239,159,39,0.12)", padding: "4px 10px", borderRadius: "99px" }}>
            {plan.goal}
          </span>
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px" }}>
          🏃 {plan.name}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>
          {plan.description}
        </p>

        <div style={{ display: "flex", gap: "20px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "#EF9F27" }}>{plan.weeksTotal}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Wochen</div>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)" }}>{plan.daysPerWeek}×</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tage/Woche</div>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)" }}>{plan.weeksTotal * plan.daysPerWeek}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Einheiten gesamt</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {plan.weeks.map((week) => (
            <div key={week.week} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#EF9F27", marginRight: "10px" }}>
                    WOCHE {week.week}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
                    {week.theme}
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {week.workouts.length} Einheiten
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {week.workouts.map((workout, wi) => (
                  <div
                    key={wi}
                    style={{
                      padding: "16px 20px",
                      borderBottom: wi < week.workouts.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", color: typeColor[workout.type] ?? "var(--text-muted)", background: `${typeColor[workout.type] ?? "#6B7280"}18`, padding: "3px 8px", borderRadius: "99px", fontWeight: 500 }}>
                          {workout.type}
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
                          {workout.name}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {workout.distance && (
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{workout.distance}</span>
                        )}
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{workout.duration} Min</span>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: effortColor[workout.effort], display: "inline-block", flexShrink: 0 }} title={workout.effort} />
                      </div>
                    </div>

                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.5 }}>
                      {workout.description}
                    </p>

                    <div style={{ background: "var(--bg-hover)", borderRadius: "8px", padding: "10px 12px" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-primary)", margin: 0, lineHeight: 1.6, fontFamily: "monospace" }}>
                        {workout.structure}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "24px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <RunStartButton planId={id} userId={user.id} isActive={isActive} />
          <Link
            href="/fitness/running/log"
            style={{ display: "inline-block", padding: "12px 22px", background: "rgba(239,159,39,0.1)", border: "1px solid rgba(239,159,39,0.3)", borderRadius: "12px", color: "#EF9F27", textDecoration: "none", fontSize: "14px" }}
          >
            Lauf loggen →
          </Link>
        </div>
      </main>
    </div>
  );
}
