"use client";

import { useState } from "react";
import Link from "next/link";

const FREE_FEATURES = [
  "Kalorien & Makros tracken",
  "Wassertracker",
  "Gewichtsverlauf",
  "10 Rezepte",
  "1 Trainingsplan",
  "Streak & Fortschritt",
];

const PRO_FEATURES = [
  { icon: "🤖", label: "KI-Coach mit persönlichen Empfehlungen" },
  { icon: "🩸", label: "Blutbild-Scan & KI-Auswertung" },
  { icon: "💊", label: "Supplement Plan & Tagesplan" },
  { icon: "🏃", label: "Alle Laufpläne & Einzelläufe" },
  { icon: "🍳", label: "Alle 50+ Rezepte" },
  { icon: "💪", label: "Alle 8+ Trainingspläne" },
  { icon: "📊", label: "Körperzusammensetzung & BMI-Analyse" },
  { icon: "🧾", label: "Automatische Rechnung per E-Mail" },
];

export function UpgradeClient({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Fehler beim Checkout: " + (data.error ?? "Unbekannter Fehler"));
        setLoading(false);
      }
    } catch (err) {
      alert("Netzwerkfehler: " + String(err));
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px 80px" }}>

      {isPro ? (
        <div style={{ textAlign: "center", padding: "48px 24px", background: "linear-gradient(135deg,rgba(29,158,117,0.12),rgba(29,158,117,0.04))", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>👑</div>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px" }}>Du bist forma Pro!</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: "0 0 24px" }}>Alle Features sind freigeschaltet. Danke für deine Unterstützung!</p>
          <Link href="/dashboard" style={{ padding: "12px 28px", background: "var(--accent)", color: "#fff", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>Zum Dashboard</Link>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", letterSpacing: "2px", color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "5px 14px", borderRadius: "99px", border: "1px solid rgba(245,158,11,0.25)", marginBottom: "20px" }}>
              ✦ FORMA PRO
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-1px", margin: "0 0 10px" }}>
              Alles freischalten.<br />4,99€ im Monat.
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>Kündige jederzeit. Keine versteckten Kosten.</p>
          </div>

          {/* Pro features */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#F59E0B", marginBottom: "14px" }}>PRO ENTHÄLT</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {PRO_FEATURES.map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>{f.icon}</span>
                  <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Free features */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "1.5px", color: "var(--text-muted)", marginBottom: "14px" }}>KOSTENLOS BLEIBT</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {FREE_FEATURES.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--accent-light)", fontSize: "12px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{ width: "100%", padding: "16px", background: loading ? "var(--bg-hover)" : "linear-gradient(135deg,#F59E0B,#EF9F27)", border: "none", borderRadius: "12px", color: "#000", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "-0.2px", boxShadow: loading ? "none" : "0 4px 24px rgba(245,158,11,0.35)" }}
          >
            {loading ? "Wird geladen..." : "forma Pro starten — 4,99€/Monat →"}
          </button>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "10px" }}>
            Zahlung via Stripe · Rechnung per E-Mail · Jederzeit kündbar
          </p>
        </>
      )}
    </main>
  );
}
