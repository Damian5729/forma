"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    if (localStorage.getItem("forma_push_asked")) setAsked(true);
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  const requestPermission = async () => {
    localStorage.setItem("forma_push_asked", "1");
    setAsked(true);
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result !== "granted") return;

    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      const sub = existing ?? await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
    } catch (e) {
      console.error("Push subscribe failed:", e);
    }
  };

  if (asked || permission === "granted" || permission === "denied" || permission === "unsupported") {
    return null;
  }

  return (
    <div style={{
      position: "fixed", bottom: "80px", left: "16px", right: "16px", zIndex: 500,
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "16px", padding: "16px 18px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", gap: "14px",
      maxWidth: "460px", margin: "0 auto",
    }}>
      <span style={{ fontSize: "24px", flexShrink: 0 }}>🔔</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 2px" }}>
          Täglich erinnert bleiben?
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
          10 Erinnerungen über den Tag verteilt.
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={() => { localStorage.setItem("forma_push_asked", "1"); setAsked(true); }}
          style={{ padding: "7px 12px", background: "none", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}
        >
          Nein
        </button>
        <button
          onClick={requestPermission}
          style={{ padding: "7px 14px", background: "var(--accent)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
        >
          Ja
        </button>
      </div>
    </div>
  );
}
