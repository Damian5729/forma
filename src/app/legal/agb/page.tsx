import Link from "next/link";

export default function AGBPage() {
  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 80px", color: "var(--text-primary)" }}>
      <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Zurück</Link>

      <h1 style={{ fontSize: "28px", fontWeight: 600, margin: "24px 0 8px", letterSpacing: "-0.5px" }}>Allgemeine Geschäftsbedingungen</h1>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "40px" }}>Stand: Juni 2025</p>

      {[
        {
          title: "1. Geltungsbereich",
          text: 'Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der App und des Dienstes forma (nachfolgend "forma" oder "wir"), betrieben von Damian Günter. Mit der Registrierung stimmst du diesen AGB zu.',
        },
        {
          title: "2. Leistungsbeschreibung",
          text: "forma ist eine digitale Anwendung zur Unterstützung bei Ernährungstracking, Kalorienberechnung, Rezeptverwaltung und Trainingsplanung. forma stellt Informationen und Werkzeuge bereit, ersetzt jedoch keine medizinische Beratung oder ärztliche Behandlung.",
        },
        {
          title: "3. Registrierung & Nutzerkonto",
          text: "Zur Nutzung der App ist eine Registrierung erforderlich. Du bist verpflichtet, wahrheitsgemäße Angaben zu machen und dein Passwort geheim zu halten. Du bist für alle Aktivitäten unter deinem Konto verantwortlich.",
        },
        {
          title: "4. Kostenfreie & kostenpflichtige Funktionen",
          text: "forma bietet sowohl kostenfreie als auch kostenpflichtige Funktionen (forma Pro). Kostenpflichtige Funktionen werden durch ein monatliches oder jährliches Abonnement freigeschaltet. Preise werden vor Abschluss des Abonnements klar ausgewiesen.",
        },
        {
          title: "5. Widerrufsrecht",
          text: "Du hast das Recht, innerhalb von 14 Tagen nach Abschluss des Abonnements ohne Angabe von Gründen zu widerrufen. Der Widerruf ist per E-Mail an support@forma.app zu richten.",
        },
        {
          title: "6. Haftungsausschluss",
          text: "forma übernimmt keine Haftung für die Richtigkeit der berechneten Nährwertangaben oder gesundheitlichen Empfehlungen. Die Nutzung erfolgt auf eigene Verantwortung. forma ersetzt keine ärztliche oder ernährungswissenschaftliche Beratung.",
        },
        {
          title: "7. Kündigung",
          text: "Ein Abonnement kann jederzeit zum Ende des laufenden Abrechnungszeitraums gekündigt werden. Nach Kündigung bleibt das Pro-Konto bis zum Ende des bezahlten Zeitraums aktiv.",
        },
        {
          title: "8. Änderungen der AGB",
          text: "Wir behalten uns vor, diese AGB jederzeit zu ändern. Änderungen werden dir per E-Mail oder in der App mitgeteilt. Die weitere Nutzung nach Mitteilung gilt als Zustimmung.",
        },
        {
          title: "9. Anwendbares Recht",
          text: "Es gilt deutsches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Anbieters.",
        },
      ].map((s) => (
        <div key={s.title} style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>{s.title}</h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{s.text}</p>
        </div>
      ))}
    </main>
  );
}
