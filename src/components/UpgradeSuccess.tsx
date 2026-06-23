"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function UpgradeSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [animOut, setAnimOut] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgrade") === "success") {
      setVisible(true);
      const t = setTimeout(() => {
        setAnimOut(true);
        setTimeout(() => {
          setVisible(false);
          router.replace("/dashboard");
        }, 500);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [searchParams, router]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      opacity: animOut ? 0 : 1,
      transition: "opacity 0.5s ease",
    }}>
      <div style={{ textAlign: "center", maxWidth: "340px" }}>
        <div style={{ fontSize: "72px", marginBottom: "20px", animation: "bounce 0.6s ease" }}>👑</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", letterSpacing: "2px", color: "#F59E0B", background: "rgba(245,158,11,0.15)", padding: "5px 16px", borderRadius: "99px", border: "1px solid rgba(245,158,11,0.3)", marginBottom: "20px" }}>
          ✦ FORMA PRO
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Willkommen bei<br />forma Pro!
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: "0 0 28px", lineHeight: 1.6 }}>
          Alle Features sind jetzt freigeschaltet.<br />Danke für deine Unterstützung! 🙌
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
          {["🤖 KI-Coach freigeschaltet", "🩸 Blutbild-Scan freigeschaltet", "💪 Alle Trainingspläne freigeschaltet", "🍳 Alle 50+ Rezepte freigeschaltet"].map((f) => (
            <div key={f} style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "8px", padding: "8px 14px" }}>
              {f}
            </div>
          ))}
        </div>
        <div style={{ width: "200px", height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "99px", margin: "0 auto", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#F59E0B", borderRadius: "99px", animation: "progress 3.5s linear forwards" }} />
        </div>
        <style>{`
          @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
          @keyframes progress { from{width:0%} to{width:100%} }
        `}</style>
      </div>
    </div>
  );
}
