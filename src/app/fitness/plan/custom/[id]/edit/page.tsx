import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import { CustomPlanEditor } from "./CustomPlanEditor";

export default async function EditCustomPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: plan } = await supabase
    .from("custom_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!plan) notFound();

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
          <Link href={`/fitness/plan/${id}`} style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
            ← {plan.name}
          </Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>
            Plan bearbeiten
          </h1>
        </div>
        <CustomPlanEditor planId={id} initial={plan} />
      </main>
    </div>
  );
}
