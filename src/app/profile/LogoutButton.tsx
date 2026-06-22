"use client";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "14px",
          background: "transparent",
          border: "1px solid rgba(226,75,74,0.3)",
          borderRadius: "12px",
          color: "#E24B4A",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(226,75,74,0.08)"; }}
        onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
      >
        Abmelden
      </button>
    </div>
  );
}
