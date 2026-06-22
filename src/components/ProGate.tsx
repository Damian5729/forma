import Link from "next/link";

interface Props {
  feature: string;
  icon?: string;
  children: React.ReactNode;
  isPro: boolean;
}

export function ProGate({ feature, icon = "⭐", children, isPro }: Props) {
  if (isPro) return <>{children}</>;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none", opacity: 0.4 }}>
        {children}
      </div>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "rgba(12,12,14,0.75)", backdropFilter: "blur(2px)",
        borderRadius: "16px", padding: "24px", textAlign: "center",
      }}>
        <span style={{ fontSize: "32px", marginBottom: "10px" }}>{icon}</span>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 6px" }}>
          {feature}
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px" }}>
          Nur mit forma Pro verfügbar.
        </p>
        <Link href="/upgrade" style={{
          padding: "10px 24px", background: "linear-gradient(135deg,#F59E0B,#EF9F27)",
          color: "#000", borderRadius: "10px", textDecoration: "none",
          fontSize: "13px", fontWeight: 700,
        }}>
          Pro freischalten →
        </Link>
      </div>
    </div>
  );
}
