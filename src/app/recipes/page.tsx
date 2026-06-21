import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import Link from "next/link";

const ALL_TAGS = ["High-Protein", "Low-Carb", "Vegan", "Vegetarisch", "Frühstück", "Mittagessen", "Abendessen", "Snack", "Meal-Prep", "Schnell", "Omega-3"];

export default async function Recipes({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let query = supabase.from("recipes").select("id, title, calories, protein, carbs, fat, duration, tags").order("protein", { ascending: false });
  if (tag) query = query.contains("tags", [tag]);
  const { data: recipes } = await query;

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/recipes" userName={userName} />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 16px", color: "var(--text-primary)" }}>
            Rezepte
          </h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Link
              href="/recipes"
              style={{ padding: "6px 14px", background: !tag ? "var(--accent-bg)" : "var(--bg-card)", border: !tag ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: !tag ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "12px", textDecoration: "none" }}
            >
              Alle
            </Link>
            {ALL_TAGS.map((t) => (
              <Link
                key={t}
                href={`/recipes?tag=${t}`}
                style={{ padding: "6px 14px", background: tag === t ? "var(--accent-bg)" : "var(--bg-card)", border: tag === t ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: tag === t ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "12px", textDecoration: "none" }}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        {recipes && recipes.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Keine Rezepte gefunden.</p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
          {(recipes ?? []).map((r) => (
            <Link key={r.id} href={`/recipes/${r.id}`} style={{ textDecoration: "none" }}>
              <div
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", cursor: "pointer", transition: "border-color 0.15s", height: "100%" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: 0, flex: 1, lineHeight: 1.4 }}>
                    {r.title}
                  </h3>
                  <span style={{ fontSize: "11px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(93,202,165,0.2)", whiteSpace: "nowrap", marginLeft: "8px" }}>
                    {r.calories} kcal
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                  {[
                    { label: "Protein", val: `${r.protein}g`, color: "var(--accent-light)" },
                    { label: "Carbs", val: `${r.carbs}g`, color: "var(--text-primary)" },
                    { label: "Fett", val: `${r.fat}g`, color: "var(--text-primary)" },
                  ].map((m) => (
                    <div key={m.label} style={{ background: "var(--bg-hover)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {(r.tags as string[]).slice(0, 2).map((t: string) => (
                      <span key={t} style={{ fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "3px 8px", borderRadius: "99px" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.duration} Min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
