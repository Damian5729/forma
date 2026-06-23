import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import { CustomPlanBuilder } from "./CustomPlanBuilder";

export default async function NewCustomPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/fitness" userName={userName} />
      <main className="main-pad" style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "28px" }}>
          <Link href="/fitness/plan" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
            ← Trainingspläne
          </Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>
            Eigenen Plan erstellen
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px" }}>
            Füge Trainingstage und Übungen hinzu — ganz nach deinen Vorstellungen.
          </p>
        </div>
        <CustomPlanBuilder />
      </main>
    </div>
  );
}
