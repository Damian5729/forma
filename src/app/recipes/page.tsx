import { Nav } from "@/components/Nav";

const recipes = [
  {
    id: "1",
    title: "Lachs mit Brokkoli",
    kcal: 380,
    protein: 42,
    carbs: 18,
    fat: 14,
    duration: 20,
    tags: ["Abendessen", "Fisch", "Low-Carb"],
  },
  {
    id: "2",
    title: "Hähnchenbrust mit Quinoa",
    kcal: 480,
    protein: 48,
    carbs: 42,
    fat: 10,
    duration: 25,
    tags: ["Mittagessen", "Geflügel", "High-Protein"],
  },
  {
    id: "3",
    title: "Griechischer Joghurt Bowl",
    kcal: 280,
    protein: 22,
    carbs: 30,
    fat: 6,
    duration: 5,
    tags: ["Frühstück", "Vegetarisch", "Schnell"],
  },
  {
    id: "4",
    title: "Omelette mit Spinat & Feta",
    kcal: 310,
    protein: 28,
    carbs: 8,
    fat: 18,
    duration: 10,
    tags: ["Frühstück", "Vegetarisch", "Low-Carb"],
  },
  {
    id: "5",
    title: "Thunfisch-Salat",
    kcal: 260,
    protein: 35,
    carbs: 10,
    fat: 8,
    duration: 8,
    tags: ["Mittagessen", "Fisch", "Schnell"],
  },
  {
    id: "6",
    title: "Hüttenkäse-Bowl",
    kcal: 290,
    protein: 38,
    carbs: 20,
    fat: 5,
    duration: 5,
    tags: ["Snack", "Vegetarisch", "High-Protein"],
  },
];

const allTags = Array.from(new Set(recipes.flatMap((r) => r.tags)));

export default function Recipes() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/recipes" />

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 16px", color: "var(--text-primary)" }}>
            Rezepte
          </h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {allTags.map((tag) => (
              <button
                key={tag}
                style={{
                  padding: "6px 14px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "99px",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "14px",
          }}
        >
          {recipes.map((r) => (
            <div
              key={r.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "20px",
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: 0, flex: 1 }}>
                  {r.title}
                </h3>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--accent-light)",
                    background: "var(--accent-bg)",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(93,202,165,0.2)",
                    whiteSpace: "nowrap",
                    marginLeft: "8px",
                  }}
                >
                  {r.kcal} kcal
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
                <div style={{ display: "flex", gap: "6px" }}>
                  {r.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        background: "var(--bg-hover)",
                        padding: "3px 8px",
                        borderRadius: "99px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.duration} Min</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
