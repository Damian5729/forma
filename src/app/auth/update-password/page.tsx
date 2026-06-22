"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase sets session from URL hash after redirect
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwörter stimmen nicht überein."); return; }
    if (password.length < 8) { setError("Mindestens 8 Zeichen."); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", background: "var(--bg-card)",
    border: "1px solid var(--border)", borderRadius: "10px",
    color: "var(--text-primary)", fontSize: "15px", outline: "none", boxSizing: "border-box",
  };

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Lädt...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔐</div>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Neues Passwort</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>Wähle ein sicheres Passwort.</p>
        </div>

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Neues Passwort</label>
            <input style={inputStyle} type="password" placeholder="Mindestens 8 Zeichen" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Passwort bestätigen</label>
            <input style={inputStyle} type="password" placeholder="Wiederholen" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>

          {error && <p style={{ fontSize: "13px", color: "#E24B4A", margin: 0 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "12px", background: loading ? "var(--bg-hover)" : "var(--accent)", border: "none", borderRadius: "10px", color: loading ? "var(--text-muted)" : "#fff", fontSize: "15px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Wird gespeichert..." : "Passwort speichern"}
          </button>
        </form>
      </div>
    </div>
  );
}
