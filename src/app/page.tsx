import Link from "next/link";

const features = [
  {
    icon: "◎",
    title: "Kalorienbedarf",
    desc: "Persönlicher Tagesbedarf basierend auf deinen Zielen und Körperwerten.",
  },
  {
    icon: "⬡",
    title: "Protein-Rezepte",
    desc: "Hunderte kalorienarme, proteinreiche Rezepte — Schritt für Schritt.",
  },
  {
    icon: "◈",
    title: "KI-Coach",
    desc: "Wann essen, was essen — intelligente Empfehlungen für deinen Alltag.",
  },
  {
    icon: "◇",
    title: "Ernährungsplan",
    desc: "Tagesplan mit Frühstück, Mittagessen und Abendessen automatisch erstellt.",
  },
];

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        style={{
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: 500,
            letterSpacing: "-0.5px",
            color: "var(--text-primary)",
          }}
        >
          forma
        </span>
        <Link
          href="/auth/login"
          style={{
            fontSize: "14px",
            color: "var(--accent-light)",
            textDecoration: "none",
          }}
        >
          Anmelden
        </Link>
      </nav>

      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "12px",
            letterSpacing: "2px",
            color: "var(--accent-light)",
            background: "var(--accent-bg)",
            padding: "6px 16px",
            borderRadius: "99px",
            border: "1px solid rgba(93,202,165,0.2)",
            marginBottom: "32px",
          }}
        >
          INTELLIGENTE ERNÄHRUNG
        </div>

        <h1
          style={{
            fontSize: "clamp(52px, 8vw, 96px)",
            fontWeight: 500,
            letterSpacing: "-3px",
            lineHeight: 1,
            color: "var(--text-primary)",
            margin: "0 0 24px",
          }}
        >
          forma
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            maxWidth: "420px",
            lineHeight: 1.6,
            margin: "0 0 48px",
          }}
        >
          Kalorien tracken. Proteinreich kochen. Deinen Körper verstehen.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/auth/register"
            style={{
              padding: "14px 32px",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Kostenlos starten
          </Link>
          <Link
            href="/dashboard"
            style={{
              padding: "14px 32px",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "15px",
              border: "1px solid var(--border)",
            }}
          >
            Demo ansehen
          </Link>
        </div>
      </section>

      <section
        style={{
          padding: "64px 24px",
          maxWidth: "960px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  color: "var(--accent)",
                  marginBottom: "12px",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  margin: "0 0 8px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          padding: "24px 32px",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--text-muted)",
        }}
      >
        © 2025 Forma
      </footer>
    </main>
  );
}
