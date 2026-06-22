"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const ALL_TAGS = ["High-Protein", "Low-Carb", "Vegan", "Vegetarisch", "Frühstück", "Mittagessen", "Abendessen", "Snack", "Meal-Prep", "Schnell", "Omega-3", "Keto"];

// Simple macro estimator per 100g for common ingredients
const INGREDIENT_MACROS: Record<string, { cal: number; p: number; c: number; f: number }> = {
  "reis": { cal: 130, p: 2.7, c: 28, f: 0.3 },
  "gekochter reis": { cal: 130, p: 2.7, c: 28, f: 0.3 },
  "hähnchen": { cal: 165, p: 31, c: 0, f: 3.6 },
  "hähnchenbrustfilet": { cal: 110, p: 23, c: 0, f: 1.2 },
  "hähnchenbrust": { cal: 110, p: 23, c: 0, f: 1.2 },
  "brokkoli": { cal: 34, p: 2.8, c: 7, f: 0.4 },
  "kartoffel": { cal: 77, p: 2, c: 17, f: 0.1 },
  "süßkartoffel": { cal: 86, p: 1.6, c: 20, f: 0.1 },
  "lachs": { cal: 208, p: 20, c: 0, f: 13 },
  "thunfisch": { cal: 116, p: 26, c: 0, f: 1 },
  "eier": { cal: 155, p: 13, c: 1.1, f: 11 },
  "ei": { cal: 155, p: 13, c: 1.1, f: 11 },
  "haferflocken": { cal: 389, p: 17, c: 66, f: 7 },
  "magerquark": { cal: 63, p: 12, c: 3.5, f: 0.2 },
  "griechischer joghurt": { cal: 100, p: 10, c: 4, f: 5 },
  "joghurt": { cal: 63, p: 5, c: 7, f: 1.5 },
  "nudeln": { cal: 220, p: 8, c: 43, f: 1 },
  "vollkornnudeln": { cal: 210, p: 9, c: 42, f: 1.5 },
  "tofu": { cal: 70, p: 8, c: 2, f: 4 },
  "spinat": { cal: 23, p: 2.9, c: 3.6, f: 0.4 },
  "avocado": { cal: 160, p: 2, c: 9, f: 15 },
  "mandeln": { cal: 579, p: 21, c: 22, f: 50 },
  "erdnüsse": { cal: 567, p: 26, c: 16, f: 49 },
  "olivenöl": { cal: 884, p: 0, c: 0, f: 100 },
  "linsen": { cal: 116, p: 9, c: 20, f: 0.4 },
  "kichererbsen": { cal: 164, p: 8.9, c: 27, f: 2.6 },
  "bohnen": { cal: 127, p: 8.7, c: 22, f: 0.5 },
  "rinderhack": { cal: 250, p: 20, c: 0, f: 19 },
  "rindfleisch": { cal: 250, p: 26, c: 0, f: 17 },
  "truthahn": { cal: 135, p: 29, c: 0, f: 1 },
  "thunfisch dose": { cal: 116, p: 26, c: 0, f: 1 },
  "cottage cheese": { cal: 98, p: 11, c: 3, f: 4 },
  "milch": { cal: 61, p: 3.2, c: 4.8, f: 3.3 },
  "protein pulver": { cal: 110, p: 24, c: 3, f: 1.5 },
  "quinoa": { cal: 120, p: 4.4, c: 22, f: 2 },
};

function parseAmount(amount: string): number {
  const match = amount.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return 0;
  return parseFloat(match[1].replace(",", "."));
}

function estimateMacros(ingredients: { name: string; amount: string }[]): { cal: number; p: number; c: number; f: number } {
  let cal = 0, p = 0, c = 0, f = 0;
  for (const ing of ingredients) {
    const key = ing.name.toLowerCase().trim();
    const data = INGREDIENT_MACROS[key] ?? INGREDIENT_MACROS[Object.keys(INGREDIENT_MACROS).find(k => key.includes(k)) ?? ""];
    if (!data) continue;
    const grams = parseAmount(ing.amount);
    if (!grams) continue;
    const factor = grams / 100;
    cal += data.cal * factor;
    p += data.p * factor;
    c += data.c * factor;
    f += data.f * factor;
  }
  return { cal: Math.round(cal), p: Math.round(p * 10) / 10, c: Math.round(c * 10) / 10, f: Math.round(f * 10) / 10 };
}

export default function CreateRecipe() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(20);
  const [servings, setServings] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<{ name: string; amount: string }[]>([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fat, setFat] = useState<number | "">("");
  const [macroEstimated, setMacroEstimated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (t: string) => setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const updateIngredient = (i: number, field: "name" | "amount", val: string) => {
    setIngredients((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  };

  const handleEstimate = () => {
    const est = estimateMacros(ingredients.filter(i => i.name && i.amount));
    if (est.cal > 0) {
      const s = servings || 1;
      setCalories(Math.round(est.cal / s));
      setProtein(Math.round((est.p / s) * 10) / 10);
      setCarbs(Math.round((est.c / s) * 10) / 10);
      setFat(Math.round((est.f / s) * 10) / 10);
      setMacroEstimated(true);
    }
  };

  const save = async () => {
    if (!title.trim()) { setError("Bitte einen Titel eingeben."); return; }
    if (!calories) { setError("Bitte Kalorien eingeben."); return; }
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    const validIngredients = ingredients.filter(i => i.name.trim() && i.amount.trim());
    const validSteps = steps.filter(s => s.trim());

    const { error: err } = await supabase.from("recipes").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      duration,
      servings,
      tags,
      ingredients: validIngredients,
      steps: validSteps,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });

    if (err) { setError(err.message); setSaving(false); return; }
    router.push("/recipes");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: "var(--overlay-xs)", border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none",
  };
  const labelStyle: React.CSSProperties = { fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px", display: "block", marginBottom: "6px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="mobile-page-pad" style={{ maxWidth: "720px", margin: "0 auto", padding: "24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <Link href="/recipes" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "20px", lineHeight: 1 }}>←</Link>
          <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Eigenes Rezept</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Basic info */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
            <p style={{ ...labelStyle, marginBottom: "14px", fontSize: "12px" }}>BASIS-INFO</p>
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Titel *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z.B. Hähnchen Reis Bowl" style={inputStyle} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Beschreibung</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Kurze Beschreibung deines Rezepts…"
                rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={labelStyle}>Dauer (Min)</label>
                <input type="number" value={duration} min={1} onChange={(e) => setDuration(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Portionen</label>
                <input type="number" value={servings} min={1} onChange={(e) => setServings(Number(e.target.value))} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
            <p style={labelStyle}>TAGS</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {ALL_TAGS.map((t) => (
                <button key={t} onClick={() => toggleTag(t)}
                  style={{ padding: "6px 14px", background: tags.includes(t) ? "var(--accent-bg)" : "var(--bg-hover)", border: tags.includes(t) ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "99px", color: tags.includes(t) ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "12px", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
            <p style={labelStyle}>ZUTATEN</p>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input value={ing.name} onChange={(e) => updateIngredient(i, "name", e.target.value)}
                  placeholder="Zutat (z.B. Hähnchenbrust)" style={{ ...inputStyle, flex: 2 }} />
                <input value={ing.amount} onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                  placeholder="Menge (z.B. 150g)" style={{ ...inputStyle, flex: 1 }} />
                {ingredients.length > 1 && (
                  <button onClick={() => setIngredients((prev) => prev.filter((_, j) => j !== i))}
                    style={{ padding: "0 10px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-muted)", cursor: "pointer", flexShrink: 0 }}>
                    ×
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setIngredients((prev) => [...prev, { name: "", amount: "" }])}
              style={{ padding: "8px 14px", background: "var(--bg-hover)", border: "1px dashed var(--border)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", width: "100%", marginTop: "4px" }}>
              + Zutat hinzufügen
            </button>
          </div>

          {/* Macros */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <p style={{ ...labelStyle, margin: 0 }}>MAKRONÄHRSTOFFE (pro Portion)</p>
              <button onClick={handleEstimate}
                style={{ padding: "5px 12px", background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "8px", color: "var(--accent-light)", fontSize: "11px", cursor: "pointer" }}>
                🤖 Schätzen
              </button>
            </div>
            {macroEstimated && (
              <p style={{ fontSize: "11px", color: "var(--accent-light)", marginBottom: "10px", padding: "8px", background: "var(--accent-bg)", borderRadius: "8px" }}>
                ✓ Automatisch geschätzt — bitte prüfen und anpassen
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                { label: "Kalorien (kcal) *", val: calories, set: setCalories, color: "var(--text-primary)" },
                { label: "Protein (g)", val: protein, set: setProtein, color: "#1D9E75" },
                { label: "Kohlenhydrate (g)", val: carbs, set: setCarbs, color: "#5B8DD9" },
                { label: "Fett (g)", val: fat, set: setFat, color: "#EF9F27" },
              ].map((m) => (
                <div key={m.label}>
                  <label style={{ ...labelStyle, color: m.color }}>{m.label}</label>
                  <input type="number" value={m.val} min={0}
                    onChange={(e) => m.set(e.target.value === "" ? "" : Number(e.target.value))}
                    style={{ ...inputStyle, color: m.color }} />
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
            <p style={labelStyle}>ZUBEREITUNG</p>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "var(--accent-light)", flexShrink: 0, marginTop: "12px" }}>
                  {i + 1}
                </span>
                <textarea value={step} onChange={(e) => setSteps((prev) => { const n = [...prev]; n[i] = e.target.value; return n; })}
                  placeholder={`Schritt ${i + 1}…`} rows={2}
                  style={{ ...inputStyle, flex: 1, resize: "vertical", lineHeight: 1.5 }} />
                {steps.length > 1 && (
                  <button onClick={() => setSteps((prev) => prev.filter((_, j) => j !== i))}
                    style={{ padding: "0 8px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-muted)", cursor: "pointer", flexShrink: 0, marginTop: "10px", height: "36px" }}>
                    ×
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setSteps((prev) => [...prev, ""])}
              style={{ padding: "8px 14px", background: "var(--bg-hover)", border: "1px dashed var(--border)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", width: "100%", marginTop: "4px" }}>
              + Schritt hinzufügen
            </button>
          </div>

          {error && <p style={{ fontSize: "13px", color: "#E24B4A", padding: "10px 14px", background: "rgba(226,75,74,0.08)", borderRadius: "8px" }}>{error}</p>}

          <button onClick={save} disabled={saving}
            className="glow-green"
            style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: saving ? "default" : "pointer" }}>
            {saving ? "Wird gespeichert…" : "✓ Rezept speichern"}
          </button>
        </div>
      </main>
    </div>
  );
}
