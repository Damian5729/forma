import Link from "next/link";

interface Props {
  icon: string;
  title: string;
  description: string;
}

export function ProPaywall({ icon, title, description }: Props) {
  return (
    <div style={{ textAlign: "center", padding: "64px 24px", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", letterSpacing: "2px", color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "5px 14px", borderRadius: "99px", border: "1px solid rgba(245,158,11,0.25)", marginBottom: "20px" }}>
        ✦ FORMA PRO
      </div>
      <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
        {title}
      </h2>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: "0 0 28px", lineHeight: 1.6 }}>
        {description}
      </p>
      <Link
        href="/upgrade"
        style={{ display: "inline-block", padding: "14px 32px", background: "linear-gradient(135deg,#F59E0B,#EF9F27)", color: "#000", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: 700, boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}
      >
        Pro freischalten — 4,99€/Monat →
      </Link>
      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "12px" }}>Jederzeit kündbar</p>
    </div>
  );
}
