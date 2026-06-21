import Link from "next/link";

const stats = [
  { val: "48+", label: "Protein-Rezepte" },
  { val: "300+", label: "Lebensmittel" },
  { val: "4", label: "Trainingspläne" },
  { val: "100%", label: "Kostenlos" },
];

const features = [
  {
    icon: "◎",
    title: "Kalorien & Makros",
    desc: "Tagesbedarf nach Harris-Benedict. Protein, Carbs, Fett — alles live im Blick.",
    badge: "Kernfunktion",
  },
  {
    icon: "⬡",
    title: "Schritt-für-Schritt Kochen",
    desc: "48 Rezepte im Thermomix-Stil: Step-by-Step, Timer, automatisches Logging.",
    badge: "Beliebt",
  },
  {
    icon: "◈",
    title: "Trainingsplan",
    desc: "Push Pull Legs, Upper/Lower — auf dein Ziel abgestimmt. kg & Wiederholungen tracken.",
    badge: "Neu",
  },
  {
    icon: "◇",
    title: "Streak & Fortschritt",
    desc: "Tages-Streak, Gewichtsverlauf, Körpermaße, Wochencharts.",
    badge: "",
  },
  {
    icon: "▣",
    title: "Barcode-Scanner",
    desc: "Produkt scannen → Makros sofort eingetragen. Open Food Facts Datenbank.",
    badge: "Neu",
  },
  {
    icon: "◉",
    title: "KI-Coach",
    desc: "Kontextbasierte Empfehlungen: wann essen, was essen, wie viel noch übrig.",
    badge: "",
  },
];

const testimonials = [
  { text: "Endlich eine App die nicht überlädt. Genau was ich brauchte.", name: "Sarah M.", goal: "−8 kg in 3 Monaten" },
  { text: "Die Rezepte sind auf einem anderen Level. Kochen macht jetzt Spaß.", name: "Tobias K.", goal: "+6 kg Muskeln" },
  { text: "Barcode Scanner und Mahlzeiten-Vorlagen sparen so viel Zeit.", name: "Julia R.", goal: "Ernährung umgestellt" },
];

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "rgba(12,12,14,0.9)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <span style={{ fontSize: "20px", fontWeight: 500, letterSpacing: "-0.5px", color: "var(--text-primary)" }}>forma</span>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/auth/login" style={{ fontSize: "14px", color: "var(--text-secondary)", textDecoration: "none" }}>Anmelden</Link>
          <Link href="/auth/register" style={{ fontSize: "14px", color: "#fff", background: "var(--accent)", padding: "8px 18px", borderRadius: "8px", textDecoration: "none", fontWeight: 500 }}>Kostenlos starten</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", letterSpacing: "2px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "6px 16px", borderRadius: "99px", border: "1px solid rgba(93,202,165,0.25)", marginBottom: "32px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          CALORIE TRACKER · REZEPTE · TRAINING
        </div>

        <h1 style={{ fontSize: "clamp(56px, 9vw, 104px)", fontWeight: 500, letterSpacing: "-4px", lineHeight: 0.92, color: "var(--text-primary)", margin: "0 0 28px" }}>
          forma
        </h1>

        <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "var(--text-secondary)", maxWidth: "480px", lineHeight: 1.65, margin: "0 0 16px" }}>
          Der smarte Begleiter für Ernährung & Training.
          Besser als Yazio — ohne Abo.
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 48px" }}>Für alle die abnehmen, Muskeln aufbauen oder einfach gesünder leben wollen.</p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "64px" }}>
          <Link href="/auth/register" style={{ padding: "15px 36px", background: "var(--accent)", color: "#fff", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: 500, letterSpacing: "0.1px" }}>
            Jetzt kostenlos starten →
          </Link>
          <Link href="/auth/login" style={{ padding: "15px 28px", background: "var(--bg-card)", color: "var(--text-secondary)", borderRadius: "12px", textDecoration: "none", fontSize: "15px", border: "1px solid var(--border)" }}>
            Ich habe schon einen Account
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 500, color: "var(--accent-light)", letterSpacing: "-1px" }}>{s.val}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: "80px 24px", maxWidth: "1040px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--accent-light)", marginBottom: "12px" }}>FEATURES</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-1px", margin: 0 }}>
            Alles was du brauchst
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", position: "relative" }}>
              {f.badge && (
                <span style={{ position: "absolute", top: "16px", right: "16px", fontSize: "9px", letterSpacing: "1px", color: "var(--accent-light)", background: "var(--accent-bg)", padding: "3px 8px", borderRadius: "99px", border: "1px solid rgba(93,202,165,0.25)" }}>
                  {f.badge.toUpperCase()}
                </span>
              )}
              <div style={{ fontSize: "26px", color: "var(--accent)", marginBottom: "14px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 24px", background: "rgba(29,158,117,0.04)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--accent-light)", marginBottom: "12px" }}>SO FUNKTIONIERTS</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: "0 0 48px" }}>
            In 3 Minuten startklar
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", textAlign: "left" }}>
            {[
              { step: "01", title: "Profil anlegen", desc: "Alter, Größe, Gewicht, Ziel — wir berechnen deinen persönlichen Kalorienbedarf." },
              { step: "02", title: "Mahlzeiten loggen", desc: "Suche, Barcode scannen oder Vorlage — in Sekunden eingetragen." },
              { step: "03", title: "Ziele erreichen", desc: "Streak aufbauen, Gewicht tracken, Trainingsplan folgen." },
            ].map((s) => (
              <div key={s.step} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px" }}>
                <div style={{ fontSize: "11px", color: "var(--accent-light)", letterSpacing: "1px", marginBottom: "10px" }}>SCHRITT {s.step}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        <p style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--accent-light)", textAlign: "center", marginBottom: "12px" }}>STIMMEN</p>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.5px", textAlign: "center", margin: "0 0 40px" }}>
          Was Nutzer sagen
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 16px", fontStyle: "italic" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 2px" }}>{t.name}</p>
                <p style={{ fontSize: "11px", color: "var(--accent-light)", margin: 0 }}>{t.goal}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-1.5px", margin: "0 0 16px" }}>
          Bereit loszulegen?
        </h2>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: "0 0 36px" }}>Kostenlos. Kein Abo. Kein Bullshit.</p>
        <Link href="/auth/register" style={{ padding: "16px 40px", background: "var(--accent)", color: "#fff", borderRadius: "12px", textDecoration: "none", fontSize: "16px", fontWeight: 500 }}>
          Forma starten →
        </Link>
      </section>

      <footer style={{ padding: "24px 32px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)" }}>forma</span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>© 2025 · Intelligente Ernährung</span>
      </footer>
    </main>
  );
}
