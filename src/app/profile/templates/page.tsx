import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TemplateManager } from "./TemplateManager";
import Link from "next/link";

export default async function Templates() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: templates } = await supabase
    .from("meal_templates")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/profile" userName={userName} />
      <main className="main-pad" style={{ maxWidth: "640px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/profile" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Profil</Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>Mahlzeiten-Vorlagen</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Speichere Lieblingsmahlzeiten für 1-Klick Logging.
          </p>
        </div>
        <TemplateManager userId={user.id} initialTemplates={templates ?? []} />
      </main>
    </div>
  );
}
