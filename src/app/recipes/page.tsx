import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import Link from "next/link";

const ALL_TAGS = ["High-Protein", "Low-Carb", "Vegan", "Vegetarisch", "Frühstück", "Mittagessen", "Abendessen", "Snack", "Meal-Prep", "Schnell", "Omega-3"];

export default async function Recipes({ searchParams }: { searchParams: Promise<{ tag?: string; q?: string }> }) {
  const { tag, q } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let query = supabase.from("recipes").select("id, title, calories, protein, carbs, fat, duration, tags, description").order("protein", { ascending: false });
  if (tag) query = query.contains("tags", [tag]);
  if (q) query = query.ilike("title", `%${q}%`);
  const { data: recipes } = await query;

  const { data: favRows } = await supabase.from("recipe_favorites").select("recipe_id").eq("user_id", user.id);
  const favSet = new Set((favRows ?? []).map((r: { recipe_id: string }) => r.recipe_id));

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/recipes" userName={userName} />

      <main className="main-pad" style={{ maxWidth: "960px" }}>
        {/* Header + Search */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Rezepte</h1>
            <form method="GET" action="/recipes" style={{ display: "flex", gap: "8px" }}>
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Rezept suchen…"
                style={{ padding: "9px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "13px", outline: "none", width: "200px" }}
              />
              <button type="submit" style={{ padding: "9px 16px", background: "var(--accent)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", cursor: "pointer" }}>
                Suchen
              </button>
              {q && (
                <Link href="/recipes" style={{ padding: "9px 14px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-secondary)", fontSize: "13px", textDecoration: "none" }}>×</Link>
              )}
            </form>
          </div>

          {/* Tag filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Link href="/recipes" style={{ padding: "6px 14px", background: !tag ? "var(--accent-bg)" : "var(--bg-card)", border: !tag ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: !tag ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "12px", textDecoration: "none" }}>
              Alle
            </Link>
            {ALL_TAGS.map((t) => (
              <Link key={t} href={`/recipes?tag=${t}`} style={{ padding: "6px 14px", background: tag === t ? "var(--accent-bg)" : "var(--bg-card)", border: tag === t ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: tag === t ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "12px", textDecoration: "none" }}>
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* Favorites shortcut */}
        {favSet.size > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#E24B4A" }}>♥</span>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{favSet.size} Favoriten gespeichert</span>
            <Link href="/recipes?favorites=1" style={{ fontSize: "12px", color: "var(--accent-light)", textDecoration: "none", marginLeft: "auto" }}>Alle anzeigen →</Link>
          </div>
        )}

        {q && (
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            {recipes?.length ?? 0} Ergebnisse für &ldquo;{q}&rdquo;
          </p>
        )}

        {recipes && recipes.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "8px" }}>Keine Rezepte gefunden.</p>
            <Link href="/recipes" style={{ fontSize: "13px", color: "var(--accent-light)", textDecoration: "none" }}>← Alle Rezepte</Link>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
          {(recipes ?? []).map((r) => (
            <div key={r.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", position: "relative" }}>
              {favSet.has(r.id) && (
                <div style={{ position: "absolute", top: "12px", right: "12px", color: "#E24B4A", fontSize: "16px", zIndex: 1 }}>♥</div>
              )}
              <Link href={`/recipes/${r.id}`} style={{ textDecoration: "none", display: "block", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: 0, flex: 1, lineHeight: 1.4, paddingRight: favSet.has(r.id) ? "24px" : "0" }}>
                    {r.title}
                  </h3>
                  <span style={{ fontSize: "11px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(93,202,165,0.2)", whiteSpace: "nowrap", marginLeft: "8px", flexShrink: 0 }}>
                    {r.calories} kcal
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "12px" }}>
                  {[
                    { label: "Protein", val: `${r.protein}g`, color: "var(--accent-light)" },
                    { label: "Carbs", val: `${r.carbs}g`, color: "var(--text-primary)" },
                    { label: "Fett", val: `${r.fat}g`, color: "var(--text-primary)" },
                  ].map((m) => (
                    <div key={m.label} style={{ background: "var(--bg-hover)", borderRadius: "7px", padding: "7px", textAlign: "center" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "1px" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {(r.tags as string[]).slice(0, 2).map((t: string) => (
                      <span key={t} style={{ fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "3px 7px", borderRadius: "99px" }}>{t}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{r.duration} Min</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
