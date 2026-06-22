import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { DeleteRecipeButton } from "./DeleteRecipeButton";
import Link from "next/link";

const FREE_RECIPE_LIMIT = 10;

const ALL_TAGS = ["High-Protein", "Low-Carb", "Vegan", "Vegetarisch", "Frühstück", "Mittagessen", "Abendessen", "Snack", "Meal-Prep", "Schnell", "Omega-3"];

export default async function Recipes({ searchParams }: { searchParams: Promise<{ tag?: string; q?: string; mine?: string }> }) {
  const { tag, q, mine } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name, subscription_status")
    .eq("id", user.id)
    .single();
  const isPro = profile?.subscription_status === "pro";

  let query = supabase.from("recipes").select("id, title, calories, protein, carbs, fat, duration, tags, description, user_id").order("protein", { ascending: false });
  if (mine === "1") query = query.eq("user_id", user.id);
  if (tag) query = query.contains("tags", [tag]);
  if (q) query = query.ilike("title", `%${q}%`);
  const { data: recipes } = await query;

  // Count user's own recipes for the tab badge
  const { count: myCount } = await supabase.from("recipes").select("id", { count: "exact", head: true }).eq("user_id", user.id);

  const { data: favRows } = await supabase.from("recipe_favorites").select("recipe_id").eq("user_id", user.id);
  const favSet = new Set((favRows ?? []).map((r: { recipe_id: string }) => r.recipe_id));

  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  const visibleRecipes = isPro ? (recipes ?? []) : (recipes ?? []).slice(0, FREE_RECIPE_LIMIT);
  const lockedCount = isPro ? 0 : Math.max(0, (recipes ?? []).length - FREE_RECIPE_LIMIT);

  function cardGradient(tags: string[], title: string): string {
    const t = title.toLowerCase();
    if (t.includes("lachs") || t.includes("forelle") || t.includes("thunfisch") || t.includes("makrele") || tags.includes("Omega-3") || tags.includes("Fisch")) return "var(--card-omega)";
    if (t.includes("hähnchen") || t.includes("pute") || t.includes("hühnchen") || tags.includes("High-Protein") || tags.includes("Muskelaufbau")) return "var(--card-protein)";
    if (t.includes("vegan") || t.includes("tofu") || t.includes("tempeh") || t.includes("kichererbsen") || t.includes("linsen") || tags.includes("Vegan") || tags.includes("Vegetarisch")) return "var(--card-vegan)";
    if (t.includes("avocado") || t.includes("low-carb") || t.includes("salat") || tags.includes("Low-Carb") || tags.includes("Keto")) return "var(--card-lowcarb)";
    if (t.includes("oats") || t.includes("porridge") || t.includes("pfannkuchen") || t.includes("joghurt") || t.includes("smoothie") || tags.includes("Frühstück")) return "var(--card-breakfast)";
    return "linear-gradient(135deg,#1a1020 0%,#141418 60%)";
  }

  function cardEmoji(tags: string[], title: string): string {
    const t = title.toLowerCase();
    if (t.includes("lachs")) return "🐟";
    if (t.includes("forelle") || t.includes("thunfisch") || t.includes("makrele") || t.includes("fisch") || t.includes("garnelen")) return "🦐";
    if (t.includes("hähnchen") || t.includes("pute") || t.includes("hühnchen")) return "🍗";
    if (t.includes("rind") || t.includes("steak") || t.includes("hackfleisch")) return "🥩";
    if (t.includes("ei") || t.includes("omelette") || t.includes("frittata") || t.includes("rührei") || t.includes("shakshuka")) return "🍳";
    if (t.includes("pfannkuchen") || t.includes("waffle")) return "🥞";
    if (t.includes("smoothie") || t.includes("açaí") || t.includes("bowl")) return "🥤";
    if (t.includes("oats") || t.includes("porridge") || t.includes("haferbrei")) return "🥣";
    if (t.includes("joghurt") || t.includes("quark") || t.includes("skyr")) return "🫙";
    if (t.includes("avocado")) return "🥑";
    if (t.includes("salat") || t.includes("caesar")) return "🥗";
    if (t.includes("suppe") || t.includes("eintopf")) return "🍲";
    if (t.includes("curry")) return "🍛";
    if (t.includes("pasta") || t.includes("spaghetti") || t.includes("penne")) return "🍝";
    if (t.includes("pizza")) return "🍕";
    if (t.includes("taco") || t.includes("burrito") || t.includes("wrap")) return "🌮";
    if (t.includes("tofu") || t.includes("tempeh") || t.includes("seitan")) return "🌿";
    if (t.includes("kichererbsen") || t.includes("linsen") || t.includes("bohnen")) return "🫘";
    if (t.includes("quinoa") || t.includes("reis")) return "🍚";
    if (t.includes("brot") || t.includes("toast")) return "🍞";
    if (tags.includes("Frühstück")) return "🌅";
    if (tags.includes("Snack")) return "⚡";
    if (tags.includes("Vegan") || tags.includes("Vegetarisch")) return "🌱";
    if (tags.includes("Meal-Prep")) return "📦";
    if (tags.includes("High-Protein")) return "💪";
    return "🍽";
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/recipes" userName={userName} />

      <main className="main-pad page-enter" style={{ maxWidth: "960px" }}>
        {/* Header + Search */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>🍽 Rezepte</h1>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/recipes/create"
              style={{ padding: "9px 16px", background: "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>
              + Eigenes Rezept
            </Link>
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
          </div>

          {/* Tag filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Eigene Rezepte — prominent */}
            {(myCount ?? 0) > 0 && (
              <Link href={mine === "1" ? "/recipes" : "/recipes?mine=1"}
                style={{
                  padding: "7px 16px",
                  background: mine === "1"
                    ? "linear-gradient(135deg,#1D9E75,#16835f)"
                    : "linear-gradient(135deg,rgba(29,158,117,0.15),rgba(29,158,117,0.08))",
                  border: "1px solid rgba(29,158,117,0.5)",
                  borderRadius: "99px",
                  color: mine === "1" ? "#fff" : "var(--accent-light)",
                  fontSize: "12px", fontWeight: 600,
                  textDecoration: "none",
                  display: "flex", alignItems: "center", gap: "6px",
                  boxShadow: mine === "1" ? "0 3px 12px rgba(29,158,117,0.35)" : "none",
                }}>
                ✨ Eigene
                <span style={{ background: mine === "1" ? "rgba(255,255,255,0.25)" : "rgba(29,158,117,0.2)", borderRadius: "99px", padding: "1px 7px", fontSize: "10px" }}>
                  {myCount}
                </span>
              </Link>
            )}

            <div style={{ width: "1px", height: "16px", background: "var(--border)", flexShrink: 0 }} />

            <Link href="/recipes" style={{ padding: "6px 14px", background: !tag && mine !== "1" ? "var(--accent-bg)" : "var(--bg-card)", border: !tag && mine !== "1" ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: !tag && mine !== "1" ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "12px", textDecoration: "none" }}>
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
          {visibleRecipes.map((r, i) => {
            const tags = r.tags as string[];
            const bg = cardGradient(tags, r.title);
            const emoji = cardEmoji(tags, r.title);
            return (
              <div key={r.id} className="card-hover stagger" style={{ background: "var(--bg-card)", border: r.user_id === user.id ? "1px solid rgba(29,158,117,0.3)" : "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", position: "relative", animationDelay: `${i * 0.05}s` }}>
                {/* Badges */}
                <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 2, display: "flex", gap: "6px" }}>
                  {r.user_id === user.id && (
                    <span style={{ fontSize: "9px", color: "var(--accent-light)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", padding: "3px 8px", borderRadius: "99px", fontWeight: 600, letterSpacing: "0.3px" }}>EIGENES</span>
                  )}
                  {favSet.has(r.id) && (
                    <span style={{ color: "#E24B4A", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", padding: "3px 7px", borderRadius: "99px", fontSize: "12px" }}>♥</span>
                  )}
                </div>
                {r.user_id === user.id && (
                  <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}>
                    <DeleteRecipeButton recipeId={r.id} />
                  </div>
                )}

                <Link href={`/recipes/${r.id}`} style={{ textDecoration: "none", display: "block" }}>
                  {/* Card header */}
                  <div style={{ position: "relative", height: "130px", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "56px", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}>{emoji}</span>
                    <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", color: "#5DCAA5", fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "99px" }}>
                      {r.calories} kcal
                    </div>
                    <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", color: "#aaa", fontSize: "10px", padding: "3px 8px", borderRadius: "99px" }}>
                      ◷ {r.duration} Min
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.4 }}>
                      {r.title}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", marginBottom: "10px" }}>
                      {[
                        { label: "Protein", val: `${r.protein}g`, color: "#5DCAA5" },
                        { label: "Carbs", val: `${r.carbs}g`, color: "#5B8DD9" },
                        { label: "Fett", val: `${r.fat}g`, color: "#EF9F27" },
                      ].map((m) => (
                        <div key={m.label} style={{ background: "var(--bg-hover)", borderRadius: "7px", padding: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: m.color }}>{m.val}</div>
                          <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "1px" }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {tags.slice(0, 2).map((t: string) => (
                        <span key={t} style={{ fontSize: "10px", color: "var(--text-muted)", background: "var(--overlay-sm)", padding: "2px 7px", borderRadius: "99px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {lockedCount > 0 && (
          <div style={{ marginTop: "32px", background: "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.03))", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "16px", padding: "28px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🍳</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>
              +{lockedCount} weitere Rezepte mit forma Pro
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px" }}>
              Alle 50+ Rezepte mit Nährwerten, Kochanleitungen und Einkaufslisten freischalten.
            </p>
            <Link href="/upgrade" style={{ display: "inline-block", padding: "11px 28px", background: "linear-gradient(135deg,#F59E0B,#EF9F27)", color: "#000", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
              Pro freischalten →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
