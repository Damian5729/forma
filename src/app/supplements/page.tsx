import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { SupplementLogger } from "./SupplementLogger";
import Link from "next/link";

export default async function SupplementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("user_profiles").select("name").eq("id", user.id).single();
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/supplements" userName={userName} />
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px 24px" }} className="page-enter mobile-page-pad">

        {/* Header */}
        <div style={{ background: "var(--g-blue-soft)", border: "1px solid rgba(93,202,165,0.15)", borderRadius: "18px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🥤</div>
          <p style={{ fontSize: "11px", color: "var(--accent-light)", letterSpacing: "2px", marginBottom: "6px" }}>PROTEIN & SHAKES</p>
          <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: "8px" }}>
            Shake, Riegel & Extras loggen
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            Proteinshakes, Riegel, Snacks & Supplements — Marke wählen, Produkt auswählen, fertig.
          </p>
        </div>

        {/* Link to plan */}
        <Link href="/supplements/plan"
          style={{ display: "flex", alignItems: "center", gap: "12px", background: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(139,92,246,0.04))", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "14px", padding: "14px 18px", marginBottom: "20px", textDecoration: "none" }}>
          <span style={{ fontSize: "22px" }}>🥤</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Supplement Plan</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>Morgens Ashwagandha, Abends Zink · Blutbild scannen</p>
          </div>
          <span style={{ color: "#A78BFA", fontSize: "18px" }}>→</span>
        </Link>

        <SupplementLogger userId={user.id} />
      </main>
    </div>
  );
}
