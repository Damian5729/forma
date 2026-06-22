import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PlanClient } from "./PlanClient";
import { ProPaywall } from "@/components/ProPaywall";
import Link from "next/link";

export default async function SupplementPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date().toISOString().split("T")[0];

  const [{ data: profile }, { data: plan }, { data: completions }] = await Promise.all([
    supabase.from("user_profiles").select("name, subscription_status").eq("id", user.id).single(),
    supabase.from("supplement_plans").select("*").eq("user_id", user.id).order("time_of_day").order("created_at"),
    supabase.from("supplement_logs").select("supplement_id").eq("user_id", user.id).eq("logged_date", today),
  ]);

  const isPro = profile?.subscription_status?.toLowerCase() === "pro";
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/supplements" userName={userName} />

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px 24px" }} className="page-enter mobile-page-pad">

        <div style={{ marginBottom: "8px" }}>
          <Link href="/supplements" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Supplements</Link>
        </div>

        {!isPro ? (
          <ProPaywall
            icon="💊"
            title="Supplement-Tagesplan"
            description="Erstelle deinen persönlichen Supplement-Plan, tracke Einnahmen und lass dein Blutbild von der KI auswerten — exklusiv für forma Pro."
          />
        ) : (
          <>
            <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.05))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "18px", padding: "22px", marginBottom: "24px" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>💊</div>
              <p style={{ fontSize: "11px", color: "#A78BFA", letterSpacing: "2px", marginBottom: "6px" }}>SUPPLEMENT PLAN</p>
              <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.3px" }}>
                Dein Tagesplan
              </h1>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                Hake Supplements ab wenn du sie genommen hast. Lass dein Blutbild von der KI auswerten.
              </p>
            </div>

            <PlanClient
              userId={user.id}
              initialPlan={plan ?? []}
              todayCompletions={(completions ?? []).map((c) => ({ supplement_id: c.supplement_id }))}
              today={today}
              isPro={true}
            />
          </>
        )}
      </main>
    </div>
  );
}
