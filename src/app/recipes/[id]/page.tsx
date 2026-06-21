import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { LogRecipeButton } from "./LogRecipeButton";
import Link from "next/link";

export default async function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (!recipe) notFound();

  const userName = user.user_metadata?.name ?? user.email ?? "User";
  const ingredients = recipe.ingredients as { name: string; amount: string }[];
  const steps = recipe.steps as string[];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/recipes" userName={userName} />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
            {(recipe.tags as string[]).map((tag: string) => (
              <span key={tag} style={{ fontSize: "11px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "4px 10px", borderRadius: "99px", border: "1px solid rgba(93,202,165,0.2)" }}>
                {tag}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 500, margin: "0 0 10px", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            {recipe.title}
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: "0 0 20px", lineHeight: 1.6 }}>
            {recipe.description}
          </p>

          {/* Cook button */}
          <Link
            href={`/recipes/${recipe.id}/cook`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", background: "var(--accent)", borderRadius: "12px",
              color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: 500,
              marginBottom: "20px",
            }}
          >
            <span>▶</span> Kochen starten
          </Link>

          {/* Meta */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "20px", color: "var(--text-muted)" }}>◷</span>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{recipe.duration} Min</span>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "20px", color: "var(--text-muted)" }}>◎</span>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{recipe.servings} {recipe.servings === 1 ? "Portion" : "Portionen"}</span>
            </div>
          </div>
        </div>

        {/* Makros */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "28px" }}>
          {[
            { label: "Kalorien", val: `${recipe.calories}`, unit: "kcal", color: "var(--text-primary)" },
            { label: "Protein", val: `${recipe.protein}`, unit: "g", color: "var(--accent-light)" },
            { label: "Carbs", val: `${recipe.carbs}`, unit: "g", color: "var(--text-primary)" },
            { label: "Fett", val: `${recipe.fat}`, unit: "g", color: "var(--text-primary)" },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: 500, color: m.color }}>{m.val}<span style={{ fontSize: "13px", marginLeft: "2px" }}>{m.unit}</span></div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
          {/* Zutaten */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 500, margin: "0 0 16px", color: "var(--text-primary)" }}>
              Zutaten
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {ingredients.map((ing, i) => (
                <li key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: i < ingredients.length - 1 ? "1px solid var(--border)" : "none", paddingBottom: i < ingredients.length - 1 ? "10px" : "0" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{ing.name}</span>
                  <span style={{ fontSize: "13px", color: "var(--accent-light)", marginLeft: "12px", whiteSpace: "nowrap" }}>{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coach tip */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "14px", padding: "20px", flex: 1 }}>
              <div style={{ fontSize: "22px", color: "var(--accent)", marginBottom: "8px" }}>◎</div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                {recipe.protein >= 30
                  ? `Mit ${recipe.protein}g Protein pro Portion ist dieses Rezept ideal für Muskelaufbau und Regeneration.`
                  : recipe.calories <= 300
                  ? "Kalorienarme Mahlzeit — ideal für ein Kaloriendefizit ohne Hunger."
                  : "Ausgewogene Mahlzeit mit gutem Nährstoffprofil für deinen Alltag."}
              </p>
            </div>
            <LogRecipeButton recipe={{ id: recipe.id, title: recipe.title, calories: recipe.calories, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat }} userId={user.id} />
          </div>
        </div>

        {/* Zubereitung */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 500, margin: "0 0 20px", color: "var(--text-primary)" }}>
            Zubereitung
          </h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
            {steps.map((step, i) => (
              <li key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--accent-light)", fontWeight: 500, flexShrink: 0, marginTop: "1px" }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
