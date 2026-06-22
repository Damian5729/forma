"use client";

import { useEffect, useState } from "react";

interface Props {
  userName: string;
}

export function SplashScreen({ userName: fullName }: Props) {
  const [phase, setPhase] = useState<"logo" | "greeting" | "out" | "done">("logo");
  const firstName = fullName.split(" ")[0];

  const hour = new Date().getHours();
  const greeting =
    hour >= 6 && hour < 11 ? "Guten Morgen" :
    hour >= 11 && hour < 17 ? "Hey" :
    hour >= 17 && hour < 22 ? "Guten Abend" : "Hey";

  const sub =
    hour >= 6 && hour < 11 ? "Wie war dein Schlaf? Leg los! 💪" :
    hour >= 11 && hour < 17 ? "Wie läuft dein Tag so?" :
    hour >= 17 && hour < 22 ? "Wie war dein Tag heute?" :
    "Noch wach? Respect 🌙";

  useEffect(() => {
    if (sessionStorage.getItem("forma_splash_shown")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("forma_splash_shown", "1");

    const t1 = setTimeout(() => setPhase("greeting"), 900);
    const t2 = setTimeout(() => setPhase("out"), 2600);
    const t3 = setTimeout(() => setPhase("done"), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0C0C0E",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      transition: "opacity 0.55s ease",
      opacity: phase === "out" ? 0 : 1,
      pointerEvents: phase === "out" ? "none" : "all",
    }}>
      {/* Logo */}
      <div style={{
        fontSize: "48px", fontWeight: 600, letterSpacing: "-2px",
        color: "#fff",
        transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        transform: phase === "logo" ? "scale(1)" : "scale(0.72) translateY(-28px)",
        opacity: phase === "logo" ? 1 : phase === "greeting" ? 1 : 0,
      }}>
        forma
      </div>

      {/* Greeting — fades in after logo scales up */}
      <div style={{
        marginTop: "20px", textAlign: "center",
        transition: "all 0.5s ease",
        opacity: phase === "greeting" ? 1 : 0,
        transform: phase === "greeting" ? "translateY(0)" : "translateY(12px)",
      }}>
        <p style={{ fontSize: "22px", fontWeight: 500, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          {greeting}, {firstName} 👋
        </p>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
          {sub}
        </p>
      </div>

      {/* Green dot pulse */}
      <div style={{
        position: "absolute", bottom: "48px",
        width: "6px", height: "6px", borderRadius: "50%",
        background: "#1D9E75",
        animation: "pulse 1.5s infinite",
        opacity: phase === "greeting" ? 1 : 0,
        transition: "opacity 0.4s ease",
      }} />
    </div>
  );
}
