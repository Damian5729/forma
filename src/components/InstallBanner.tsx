"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if dismissed within 7 days
    const dismissed = localStorage.getItem("install-dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as { standalone?: boolean }).standalone;
    setIsIOS(ios);

    if (ios) {
      setShow(true);
      return;
    }

    // Android/Chrome — listen for native prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem("install-dismissed", Date.now().toString());
    setShow(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", bottom: "calc(var(--bottom-nav-height, 0px) + env(safe-area-inset-bottom) + 12px)",
      left: "12px", right: "12px", zIndex: 300,
      background: "var(--bg-card)",
      border: "1px solid rgba(29,158,117,0.35)",
      borderRadius: "16px",
      padding: "14px 16px",
      display: "flex", alignItems: "center", gap: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(29,158,117,0.1)",
      animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
        background: "linear-gradient(135deg,#1D9E75,#16835f)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px",
      }}>
        f
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "2px" }}>
          Forma installieren
        </div>
        {isIOS ? (
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Tippe auf <strong>Teilen</strong> →{" "}
            <strong>Zum Startbildschirm</strong> für App-Erlebnis
          </div>
        ) : (
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Als App installieren — schneller & offline
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        {!isIOS && (
          <button onClick={install} style={{
            padding: "8px 14px", background: "var(--accent)", border: "none",
            borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer",
          }}>
            Installieren
          </button>
        )}
        <button onClick={dismiss} style={{
          width: "28px", height: "28px", background: "var(--bg-hover)", border: "1px solid var(--border)",
          borderRadius: "8px", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        }}>
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
