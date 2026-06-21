"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  id: string;
  title: string;
  calories: number;
  protein: number;
  duration: number;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  userId: string;
}

export function CookMode({ id, title, calories, protein, duration, ingredients, steps, userId }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(-1); // -1 = Zutaten-Übersicht
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (running) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const isLast = currentStep === steps.length - 1;
  const progress = currentStep < 0 ? 0 : ((currentStep + 1) / steps.length) * 100;

  const handleFinish = async () => {
    setLogging(true);
    const supabase = createClient();
    await supabase.from("meal_logs").insert({
      user_id: userId,
      name: title,
      calories,
      protein,
      carbs: 0,
      fat: 0,
      meal_type: "lunch",
    });
    setLogging(false);
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🍽️</div>
        <h1 style={{ fontSize: "28px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "10px" }}>Guten Appetit!</h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "8px" }}>{title} wurde in deinen Kalorien geloggt.</p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "32px" }}>Kochzeit: {formatTime(seconds)}</p>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ padding: "14px 32px", background: "var(--accent)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: "pointer" }}
        >
          Zum Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-primary)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer", padding: 0 }}
          >
            ← Zurück
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "monospace" }}>
              {formatTime(seconds)}
            </span>
            <button
              onClick={() => setRunning((r) => !r)}
              style={{ padding: "6px 14px", background: running ? "var(--bg-hover)" : "var(--accent)", border: "none", borderRadius: "8px", color: running ? "var(--text-secondary)" : "#fff", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}
            >
              {running ? "⏸ Pause" : currentStep < 0 ? "▶ Start" : "▶ Weiter"}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {currentStep >= 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--accent-light)", fontWeight: 500 }}>
                Schritt {currentStep + 1} von {steps.length}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: "4px", background: "var(--bg-hover)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent)", borderRadius: "99px", transition: "width 0.3s ease" }} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "24px 20px", display: "flex", flexDirection: "column" }}>

        {/* Zutaten-Übersicht (Step -1) */}
        {currentStep === -1 && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "12px", color: "var(--accent-light)", letterSpacing: "1px", marginBottom: "6px" }}>REZEPT</p>
              <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.3 }}>{title}</h1>
              <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>◷ {duration} Min</span>
                <span style={{ fontSize: "13px", color: "var(--accent-light)" }}>◎ {calories} kcal</span>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{protein}g Protein</span>
              </div>
            </div>

            <h2 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "14px" }}>
              Zutaten für diese Mahlzeit
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {ingredients.map((ing, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 0",
                    borderBottom: i < ingredients.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "var(--text-primary)" }}>{ing.name}</span>
                  <span style={{ fontSize: "15px", color: "var(--accent-light)", fontWeight: 500 }}>{ing.amount}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setCurrentStep(0); setRunning(true); }}
              style={{
                width: "100%", marginTop: "32px", padding: "16px",
                background: "var(--accent)", border: "none", borderRadius: "14px",
                color: "#fff", fontSize: "17px", fontWeight: 500, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              }}
            >
              <span>▶</span> Kochen starten
            </button>
          </div>
        )}

        {/* Step view */}
        {currentStep >= 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Step number */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
              {steps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1, height: "4px", borderRadius: "99px",
                    background: i <= currentStep ? "var(--accent)" : "var(--bg-hover)",
                    transition: "background 0.3s",
                    cursor: "pointer",
                  }}
                  onClick={() => setCurrentStep(i)}
                />
              ))}
            </div>

            {/* Main step */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "var(--accent)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px", fontWeight: 500,
                  color: "#fff", marginBottom: "20px",
                }}
              >
                {currentStep + 1}
              </div>

              <p style={{ fontSize: "22px", color: "var(--text-primary)", lineHeight: 1.6, fontWeight: 400 }}>
                {steps[currentStep]}
              </p>
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((s) => s - 1)}
                  style={{ flex: 1, padding: "14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "15px", cursor: "pointer" }}
                >
                  ← Zurück
                </button>
              )}
              {!isLast ? (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  style={{ flex: 2, padding: "14px", background: "var(--accent)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 500, cursor: "pointer" }}
                >
                  Weiter →
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={logging}
                  style={{ flex: 2, padding: "14px", background: logging ? "var(--bg-hover)" : "#1D9E75", border: "none", borderRadius: "12px", color: logging ? "var(--text-muted)" : "#fff", fontSize: "15px", fontWeight: 500, cursor: logging ? "default" : "pointer" }}
                >
                  {logging ? "Wird gespeichert…" : "✓ Fertig — Mahlzeit loggen"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
