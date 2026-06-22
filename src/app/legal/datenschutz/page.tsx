import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 80px", color: "var(--text-primary)" }}>
      <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Zurück</Link>

      <h1 style={{ fontSize: "28px", fontWeight: 600, margin: "24px 0 8px", letterSpacing: "-0.5px" }}>Datenschutzerklärung</h1>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "40px" }}>Stand: Juni 2025</p>

      {[
        {
          title: "1. Verantwortlicher",
          text: "Verantwortlicher für die Datenverarbeitung ist Damian Günter (kontakt@forma.app). Bei Fragen zum Datenschutz wende dich jederzeit an diese Adresse.",
        },
        {
          title: "2. Welche Daten wir erheben",
          text: "Wir erheben folgende Daten: Name, E-Mail-Adresse (für das Konto), Körperdaten die du freiwillig einträgst (Gewicht, Größe, Körpermaße, Körperfett), Ernährungsdaten (geloggte Mahlzeiten, Kalorien, Makros), Trainingsdaten (Workouts, Laufpläne), Supplement-Einträge sowie technische Daten (IP-Adresse, Browser-Typ bei Nutzung der Web-App).",
        },
        {
          title: "3. Deine Gesundheitsdaten bleiben bei dir",
          text: "Deine Körperdaten, Gewichtsdaten und Ernährungsdaten werden ausschließlich zur Bereitstellung der App-Funktionen genutzt. Wir geben diese Daten nicht an Dritte weiter, verkaufen sie nicht und nutzen sie nicht für Werbezwecke. Diese Daten verlassen unsere Infrastruktur (Supabase, EU-Server) nicht.",
        },
        {
          title: "4. KI-Funktionen (Claude API)",
          text: "Für den KI-Coach und die Blutbild-Auswertung nutzen wir die API von Anthropic (Claude). Dabei werden Anfragen — ohne direkte Personenidentifizierung — an Anthropics Server übermittelt. Anthropic verarbeitet diese Daten gemäß ihrer eigenen Datenschutzrichtlinie. Wir übermitteln keine Stammdaten (Name, E-Mail) an Anthropic.",
        },
        {
          title: "5. Zahlungsdaten",
          text: "Zahlungen für forma Pro werden über Stripe abgewickelt. Wir speichern keine Kreditkartendaten. Stripe verarbeitet Zahlungsdaten gemäß PCI-DSS-Standard. Es gelten die Datenschutzbestimmungen von Stripe.",
        },
        {
          title: "6. Datenspeicherung",
          text: "Deine Daten werden auf Servern von Supabase (EU-Region) gespeichert. Die Daten werden so lange gespeichert, wie dein Konto aktiv ist. Nach Kontolöschung werden alle personenbezogenen Daten innerhalb von 30 Tagen gelöscht.",
        },
        {
          title: "7. Deine Rechte",
          text: "Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Datenportabilität deiner gespeicherten Daten. Wende dich dazu an kontakt@forma.app. Du kannst dein Konto und alle zugehörigen Daten jederzeit selbst löschen.",
        },
        {
          title: "8. Cookies",
          text: "forma nutzt ausschließlich technisch notwendige Cookies für die Authentifizierung (Session-Cookie von Supabase). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.",
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
