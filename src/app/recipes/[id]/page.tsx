import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { LogRecipeButton } from "./LogRecipeButton";
import { FavoriteButton } from "./FavoriteButton";
import { ShoppingList } from "./ShoppingList";
import { StarRating } from "./StarRating";
import Link from "next/link";

function tagGradient(tags: string[], title: string): string {
  const t = title.toLowerCase();
  if (t.includes("lachs") || t.includes("forelle") || t.includes("thunfisch") || t.includes("makrele") || tags.includes("Omega-3") || tags.includes("Fisch")) return "linear-gradient(135deg,#0d1524 0%,#141418 55%)";
  if (t.includes("hähnchen") || t.includes("pute") || t.includes("hühnchen") || tags.includes("High-Protein") || tags.includes("Muskelaufbau")) return "linear-gradient(135deg,#0d2419 0%,#141418 55%)";
  if (t.includes("tofu") || t.includes("tempeh") || t.includes("kichererbsen") || t.includes("linsen") || tags.includes("Vegan") || tags.includes("Vegetarisch")) return "linear-gradient(135deg,#0d1f0d 0%,#141418 55%)";
  if (t.includes("avocado") || t.includes("salat") || tags.includes("Low-Carb") || tags.includes("Keto")) return "linear-gradient(135deg,#101a08 0%,#141418 55%)";
  if (t.includes("oats") || t.includes("porridge") || t.includes("pfannkuchen") || t.includes("joghurt") || t.includes("smoothie") || tags.includes("Frühstück")) return "linear-gradient(135deg,#1f1208 0%,#141418 55%)";
  return "linear-gradient(135deg,#1a1020 0%,#141418 55%)";
}

function tagEmoji(tags: string[], title: string): string {
  const t = title.toLowerCase();
  if (t.includes("lachs")) return "🐟";
  if (t.includes("forelle") || t.includes("thunfisch") || t.includes("makrele")) return "🐠";
  if (t.includes("garnelen") || t.includes("shrimp")) return "🦐";
  if (t.includes("hähnchen") || t.includes("pute") || t.includes("hühnchen")) return "🍗";
  if (t.includes("rind") || t.includes("steak") || t.includes("hackfleisch")) return "🥩";
  if (t.includes("ei") || t.includes("omelette") || t.includes("frittata") || t.includes("rührei") || t.includes("shakshuka")) return "🍳";
  if (t.includes("pfannkuchen") || t.includes("waffle")) return "🥞";
  if (t.includes("smoothie") || t.includes("açaí") || t.includes("bowl")) return "🥤";
  if (t.includes("oats") || t.includes("porridge") || t.includes("haferbrei")) return "🥣";
  if (t.includes("joghurt") || t.includes("quark") || t.includes("skyr") || t.includes("hüttenkäse")) return "🫙";
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
  if (tags.includes("High-Protein")) return "💪";
  return "🍽";
}

export default async function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: recipe }, { data: favRow }, { data: myRating }, { data: allRatings }] = await Promise.all([
    supabase.from("recipes").select("*").eq("id", id).single(),
    supabase.from("recipe_favorites").select("id").eq("user_id", user.id).eq("recipe_id", id).maybeSingle(),
    supabase.from("recipe_ratings").select("rating").eq("user_id", user.id).eq("recipe_id", id).maybeSingle(),
    supabase.from("recipe_ratings").select("rating").eq("recipe_id", id),
  ]);

  if (!recipe) notFound();

  const userName = user.user_metadata?.name ?? user.email ?? "User";
  const ingredients = recipe.ingredients as { name: string; amount: string }[];
  const steps = recipe.steps as string[];
  const tags = recipe.tags as string[];
  const isFav = !!favRow;
  const avgRating = allRatings?.length
    ? Math.round((allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length) * 10) / 10
    : null;

  const coachMsg = recipe.protein >= 35
    ? `${recipe.protein}g Protein pro Portion — top für Muskelaufbau.`
    : recipe.calories <= 350
    ? `Nur ${recipe.calories} kcal — ideal im Kaloriendefizit.`
    : tags.includes("Meal-Prep")
    ? "Perfekt für Meal-Prep — Sonntag kochen, Woche genießen."
    : "Ausgewogenes Nährstoffprofil für deinen Alltag.";

  const gradient = tagGradient(tags, recipe.title);
  const emoji = tagEmoji(tags, recipe.title);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/recipes" userName={userName} />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "0 0 24px" }} className="page-enter mobile-page-pad">

        {/* Visual header card — emoji+gradient for all recipes */}
        <div style={{ background: gradient, borderBottom: "1px solid var(--border)", padding: "28px 24px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-20px", left: "50%", fontSize: "120px", opacity: 0.07, transform: "translateX(-50%)", pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>{emoji}</div>
          <Link href="/recipes" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "16px" }}>
            ← Rezepte
          </Link>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
            {tags.map((tag: string) => (
              <Link key={tag} href={`/recipes?tag=${tag}`} style={{ fontSize: "11px", color: "var(--accent-light)", background: "rgba(29,158,117,0.12)", padding: "4px 10px", borderRadius: "99px", border: "1px solid rgba(93,202,165,0.2)", textDecoration: "none" }}>
                {tag}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ fontSize: "52px", lineHeight: 1, flexShrink: 0 }}>{emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: "26px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "8px", lineHeight: 1.2 }}>
                {recipe.title}
              </h1>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "14px" }}>
                {recipe.description}
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>◷ {recipe.duration} Min</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>◎ {recipe.servings} {recipe.servings === 1 ? "Portion" : "Portionen"}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
            <Link href={`/recipes/${recipe.id}/cook`}
              className="glow-green"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 22px", background: "linear-gradient(135deg,#1D9E75,#16835f)", borderRadius: "12px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
              ▶ Kochen starten
            </Link>
            <FavoriteButton recipeId={recipe.id} userId={user.id} initialFav={isFav} />
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Makros */}
          <div className="grid-4col" style={{ marginBottom: "22px" }}>
            {[
              { label: "Kalorien", val: recipe.calories, unit: "kcal", color: "var(--text-primary)", bg: "var(--bg-card)" },
              { label: "Protein", val: recipe.protein, unit: "g", color: "#5DCAA5", bg: "var(--g-green-dark)" },
              { label: "Carbs", val: recipe.carbs, unit: "g", color: "#5B8DD9", bg: "linear-gradient(135deg,#0d1524,#141418)" },
              { label: "Fett", val: recipe.fat, unit: "g", color: "#EF9F27", bg: "linear-gradient(135deg,#231508,#141418)" },
            ].map((m) => (
              <div key={m.label} style={{ background: m.bg, border: "1px solid var(--border)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 500, color: m.color }}>{m.val}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{m.unit} {m.label}</div>
              </div>
            ))}
          </div>

          {/* Star rating */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "4px 18px", marginBottom: "16px" }}>
            <StarRating
              recipeId={recipe.id}
              userId={user.id}
              initialRating={myRating?.rating ?? null}
              avgRating={avgRating}
              totalRatings={allRatings?.length ?? 0}
            />
          </div>

          {/* Zutaten + Coach */}
          <div className="grid-2col" style={{ marginBottom: "16px" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "14px" }}>ZUTATEN</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {ingredients.map((ing, i) => (
                  <li key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: i < ingredients.length - 1 ? "1px solid var(--border)" : "none", paddingBottom: i < ingredients.length - 1 ? "8px" : "0" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{ing.name}</span>
                    <span style={{ fontSize: "12px", color: "var(--accent-light)", marginLeft: "10px", whiteSpace: "nowrap" }}>{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "14px", padding: "18px", flex: 1 }}>
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>🤖</div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{coachMsg}</p>
              </div>
              <LogRecipeButton recipe={{ id: recipe.id, title: recipe.title, calories: recipe.calories, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat }} userId={user.id} />
            </div>
          </div>

          {/* Shopping list */}
          <div style={{ marginBottom: "16px" }}>
            <ShoppingList ingredients={ingredients} title={recipe.title} />
          </div>

          {/* Steps */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "20px" }}>ZUBEREITUNG</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              {steps.map((step, i) => (
                <li key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }} className="fade-enter">
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--accent-light)", fontWeight: 500, flexShrink: 0, marginTop: "2px" }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
