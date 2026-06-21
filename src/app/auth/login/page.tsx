"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-Mail oder Passwort falsch.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "var(--bg-hover)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "15px",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "20px",
          fontWeight: 500,
          color: "var(--text-primary)",
          textDecoration: "none",
          letterSpacing: "-0.5px",
          marginBottom: "48px",
        }}
      >
        forma
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "32px",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: 500, margin: "0 0 24px", color: "var(--text-primary)" }}>
          Anmelden
        </h1>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
              E-Mail
            </label>
            <input
              style={inputStyle}
              type="email"
              placeholder="du@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
              Passwort
            </label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "#E24B4A", margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: loading ? "var(--bg-hover)" : "var(--accent)",
              border: "none",
              borderRadius: "10px",
              color: loading ? "var(--text-muted)" : "#fff",
              fontSize: "15px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "Wird angemeldet..." : "Anmelden"}
          </button>
        </form>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", textAlign: "center", margin: "20px 0 0" }}>
          Noch kein Account?{" "}
          <Link href="/auth/register" style={{ color: "var(--accent-light)", textDecoration: "none" }}>
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
