"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type User = {
  id: string;
  email: string;
  name: string;
  subscription_status: string;
};

export function AdminClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
    sb.auth.getSession().then(({ data }) => {
      setToken(data.session?.access_token ?? null);
    });
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); });
  }, []);

  const toggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "pro" ? "free" : "pro";
    setToggling(userId);
    await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-token": token ?? "",
      },
      body: JSON.stringify({ userId, status: newStatus }),
    });
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, subscription_status: newStatus } : u)
    );
    setToggling(null);
  };

  return (
    <main style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "24px" }}>
        👑 Admin — User-Verwaltung
      </h1>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Lädt...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {users.map((u) => (
            <div key={u.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "14px 18px",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {u.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {u.email}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 600, letterSpacing: "1px",
                  padding: "3px 10px", borderRadius: "99px",
                  background: u.subscription_status === "pro"
                    ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.06)",
                  color: u.subscription_status === "pro" ? "#F59E0B" : "var(--text-muted)",
                  border: `1px solid ${u.subscription_status === "pro" ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
                }}>
                  {u.subscription_status === "pro" ? "PRO" : "FREE"}
                </span>
                <button
                  onClick={() => toggle(u.id, u.subscription_status)}
                  disabled={toggling === u.id}
                  style={{
                    padding: "7px 16px", borderRadius: "8px", border: "none",
                    background: u.subscription_status === "pro"
                      ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,#F59E0B,#EF9F27)",
                    color: u.subscription_status === "pro" ? "var(--text-secondary)" : "#000",
                    fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    opacity: toggling === u.id ? 0.5 : 1,
                  }}
                >
                  {toggling === u.id ? "..." : u.subscription_status === "pro" ? "→ Free" : "→ Pro"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
