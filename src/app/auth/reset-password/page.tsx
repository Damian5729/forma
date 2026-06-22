"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", background: "var(--bg-card)",
    border: "1px solid var(--border)", borderRadius: "10px",
    color: "var(--text-primary)", fontSize: "15px", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔑</div>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Passwort zurücksetzen</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
            Wir schicken dir einen Link per E-Mail.
          </p>
        </div>

        {sent ? (
          <div style={{ background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>✉️</div>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 6px" }}>E-Mail gesendet!</p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 20px" }}>
              Schau in deinen Posteingang bei <strong>{email}</strong> und klicke den Link.
            </p>
            <Link href="/auth/login" style={{ fontSize: "13px", color: "var(--accent-light)", textDecoration: "none" }}>← Zurück zum Login</Link>
          </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>E-Mail</label>
              <input style={inputStyle} type="email" placeholder="du@beispiel.de" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {error && <p style={{ fontSize: "13px", color: "#E24B4A", margin: 0 }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{ padding: "12px", background: loading ? "var(--bg-hover)" : "var(--accent)", border: "none", borderRadius: "10px", color: loading ? "var(--text-muted)" : "#fff", fontSize: "15px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Wird gesendet..." : "Link senden"}
            </button>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", textAlign: "center", margin: 0 }}>
              <Link href="/auth/login" style={{ color: "var(--text-muted)", textDecoration: "none" }}>← Zurück zum Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
