"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "forma_onboarding_done";

const SCREENS = [
  {
    icon: "🎯",
    color: "#1D9E75",
    bg: "rgba(29,158,117,0.12)",
    border: "rgba(29,158,117,0.25)",
    title: "Willkommen bei forma",
    subtitle: "Dein persönlicher Fitness-Tracker",
    description: "forma hilft dir, deine Kalorien, Makros und deinen Fortschritt zu tracken — einfach, schnell und ohne Bullshit.",
    bullets: [
      "Mahlzeiten & Kalorien loggen",
      "Makros (Protein, Carbs, Fett) verfolgen",
      "Wasseraufnahme tracken",
    ],
  },
  {
    icon: "💪",
    color: "#378ADD",
    bg: "rgba(55,138,221,0.12)",
    border: "rgba(55,138,221,0.25)",
    title: "Training & Laufen",
    subtitle: "Strukturierte Pläne für dein Ziel",
    description: "Wähle aus 8+ Trainingsplänen für Gym oder Zuhause und Laufplänen von Einsteiger bis Halbmarathon.",
    bullets: [
      "Trainingspläne nach Ziel (Muskelaufbau, Fettabbau)",
      "Laufpläne mit wöchentlicher Struktur",
      "Workouts im Live-Modus absolvieren",
    ],
  },
  {
    icon: "🍳",
    color: "#EF9F27",
    bg: "rgba(239,159,39,0.12)",
    border: "rgba(239,159,39,0.25)",
    title: "Rezepte & Ernährung",
    subtitle: "50+ gesunde Rezepte mit Nährwerten",
    description: "Alle Rezepte direkt ins Kalorienbuch loggen — mit Kochanleitungen, Einkaufslisten und Makro-Analyse.",
    bullets: [
      "Rezepte nach Tags filtern (High-Protein, Vegan…)",
      "Direkt aus Rezept Mahlzeit loggen",
      "Eigene Rezepte erstellen",
    ],
  },
  {
    icon: "🤖",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
    title: "forma Pro",
    subtitle: "Das volle Erlebnis für 4,99€/Monat",
    description: "Mit forma Pro schaltest du KI-Coach, alle Pläne, Blutbild-Scan, Körperanalyse und 50+ Rezepte frei.",
    bullets: [
      "🤖 KI-Coach mit persönlichen Empfehlungen",
      "🩸 Blutbild-Scan & KI-Auswertung",
      "📊 Körperzusammensetzung & BMI-Analyse",
    ],
    isCta: true,
  },
];

export function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [animOut, setAnimOut] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setVisible(true);
  }, []);

  const finish = () => {
    setAnimOut(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    }, 350);
  };

  const next = () => {
    if (step < SCREENS.length - 1) setStep(step + 1);
    else finish();
  };

  if (!visible) return null;

  const s = SCREENS[step];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      opacity: animOut ? 0 : 1,
      transition: "opacity 0.35s ease",
    }}>
      <div style={{
        background: "var(--bg-card)",
        border: `1px solid ${s.border}`,
        borderRadius: "24px",
        padding: "36px 28px 28px",
        maxWidth: "400px",
        width: "100%",
        position: "relative",
      }}>
        {/* Skip */}
        <button
          onClick={finish}
          style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer", padding: "4px 8px" }}
        >
          Überspringen
        </button>

        {/* Icon */}
        <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
          {s.icon}
        </div>

        {/* Text */}
        <div style={{ fontSize: "11px", letterSpacing: "1.5px", color: s.color, marginBottom: "8px" }}>
          {s.subtitle.toUpperCase()}
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
          {s.title}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 20px" }}>
          {s.description}
        </p>

        {/* Bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
          {s.bullets.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: s.color, fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{b}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {s.isCta ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={finish}
              style={{ flex: 1, padding: "13px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
            >
              Später
            </button>
            <Link
              href="/upgrade"
              onClick={() => localStorage.setItem(STORAGE_KEY, "1")}
              style={{ flex: 2, padding: "13px", background: "linear-gradient(135deg,#F59E0B,#EF9F27)", borderRadius: "12px", color: "#000", fontSize: "14px", fontWeight: 700, textDecoration: "none", textAlign: "center", boxShadow: "0 4px 16px rgba(245,158,11,0.35)" }}
            >
              Pro freischalten →
            </Link>
          </div>
        ) : (
          <button
            onClick={next}
            style={{ width: "100%", padding: "14px", background: s.color, border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
          >
            Weiter →
          </button>
        )}

        {/* Dots */}
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "20px" }}>
          {SCREENS.map((_, i) => (
            <div
              key={i}
              style={{ width: i === step ? "20px" : "6px", height: "6px", borderRadius: "99px", background: i === step ? s.color : "var(--border)", transition: "all 0.3s ease" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
