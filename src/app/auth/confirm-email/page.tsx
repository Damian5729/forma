export default function ConfirmEmailPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 10px" }}>
          E-Mail bestätigen
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 24px" }}>
          Wir haben dir einen Bestätigungslink geschickt.<br />
          Schau in deinen Posteingang und klicke den Link — danach kannst du dich einloggen.
        </p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
            Keine E-Mail erhalten? Schau im Spam-Ordner oder{" "}
            <a href="/auth/register" style={{ color: "var(--accent-light)", textDecoration: "none" }}>
              registriere dich erneut
            </a>
            .
          </p>
        </div>
        <a href="/auth/login" style={{ display: "inline-block", padding: "12px 28px", background: "var(--accent)", color: "#fff", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
          Zum Login →
        </a>
      </div>
    </div>
  );
}
