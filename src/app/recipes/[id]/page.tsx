import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { LogRecipeButton } from "./LogRecipeButton";
import { FavoriteButton } from "./FavoriteButton";
import { ShoppingList } from "./ShoppingList";
import Link from "next/link";

export default async function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: recipe }, { data: favRow }] = await Promise.all([
    supabase.from("recipes").select("*").eq("id", id).single(),
    supabase.from("recipe_favorites").select("id").eq("user_id", user.id).eq("recipe_id", id).maybeSingle(),
  ]);

  if (!recipe) notFound();

  const userName = user.user_metadata?.name ?? user.email ?? "User";
  const ingredients = recipe.ingredients as { name: string; amount: string }[];
  const steps = recipe.steps as string[];
  const isFav = !!favRow;

  const coachMsg = recipe.protein >= 35
    ? `${recipe.protein}g Protein pro Portion — top für Muskelaufbau und Sättigung.`
    : recipe.calories <= 350
    ? `Nur ${recipe.calories} kcal — ideal im Kaloriendefizit ohne Hunger.`
    : recipe.tags?.includes?.("Meal-Prep")
    ? "Perfekt für Meal-Prep — am Sonntag kochen, die ganze Woche genießen."
    : "Ausgewogenes Nährstoffprofil für einen aktiven Alltag.";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/recipes" userName={userName} />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Back */}
        <Link href="/recipes" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
          ← Alle Rezepte
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {(recipe.tags as string[]).map((tag: string) => (
              <Link key={tag} href={`/recipes?tag=${tag}`} style={{ fontSize: "11px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "4px 10px", borderRadius: "99px", border: "1px solid rgba(93,202,165,0.2)", textDecoration: "none" }}>
                {tag}
              </Link>
            ))}
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 500, margin: "0 0 10px", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            {recipe.title}
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: "0 0 20px", lineHeight: 1.6 }}>
            {recipe.description}
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <Link
              href={`/recipes/${recipe.id}/cook`}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", background: "var(--accent)", borderRadius: "12px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
            >
              ▶ Kochen starten
            </Link>
            <FavoriteButton recipeId={recipe.id} userId={user.id} initialFav={isFav} />
          </div>

          {/* Meta row */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>◷ {recipe.duration} Min</span>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>◎ {recipe.servings} {recipe.servings === 1 ? "Portion" : "Portionen"}</span>
          </div>
        </div>

        {/* Makros */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
          {[
            { label: "Kalorien", val: recipe.calories, unit: "kcal", color: "var(--text-primary)" },
            { label: "Protein", val: recipe.protein, unit: "g", color: "var(--accent-light)" },
            { label: "Carbs", val: recipe.carbs, unit: "g", color: "#5B8DD9" },
            { label: "Fett", val: recipe.fat, unit: "g", color: "#EF9F27" },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 500, color: m.color }}>{m.val}<span style={{ fontSize: "12px", marginLeft: "2px", color: "var(--text-muted)", fontWeight: 400 }}>{m.unit}</span></div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Zutaten + Coach */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 14px", color: "var(--text-primary)" }}>Zutaten</h2>
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
            <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "14px", padding: "18px", flex: 1 }}>
              <div style={{ fontSize: "20px", color: "var(--accent)", marginBottom: "8px" }}>◎</div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{coachMsg}</p>
            </div>
            <LogRecipeButton
              recipe={{ id: recipe.id, title: recipe.title, calories: recipe.calories, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat }}
              userId={user.id}
            />
          </div>
        </div>

        {/* Shopping list (collapsible) */}
        <div style={{ marginBottom: "20px" }}>
          <ShoppingList ingredients={ingredients} title={recipe.title} />
        </div>

        {/* Zubereitung */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 20px", color: "var(--text-primary)" }}>Zubereitung</h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
            {steps.map((step, i) => (
              <li key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--accent-light)", fontWeight: 500, flexShrink: 0, marginTop: "2px" }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
