"use client";

import { useState } from "react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customer-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Fehler: " + (data.error ?? "Unbekannt"));
        setLoading(false);
      }
    } catch {
      alert("Netzwerkfehler");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePortal}
      disabled={loading}
      style={{ padding: "6px 12px", background: "none", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "8px", color: "#F59E0B", fontSize: "11px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, whiteSpace: "nowrap" }}
    >
      {loading ? "..." : "Abo verwalten"}
    </button>
  );
}
