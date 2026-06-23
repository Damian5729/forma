import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import { ShoppingListClient } from "./ShoppingListClient";

export default async function ShoppingListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: items }, { data: profile }] = await Promise.all([
    supabase.from("shopping_list_items").select("*").eq("user_id", user.id)
      .order("checked", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("user_profiles").select("name").eq("id", user.id).single(),
  ]);

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/dashboard" userName={userName} />
      <main className="main-pad" style={{ maxWidth: "640px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/dashboard" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Home</Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>🛒 Einkaufsliste</h1>
        </div>
        <ShoppingListClient initial={items ?? []} />
      </main>
    </div>
  );
}
