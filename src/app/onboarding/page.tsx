"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const steps = ["Profil", "Ziel", "Aktivität", "Fertig"];

function calcCalories(
  age: number,
  weight: number,
  height: number,
  gender: "m" | "f",
  activity: string,
  goal: string
): number {
  const bmr =
    gender === "m"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const actFactor = { low: 1.375, medium: 1.55, high: 1.725 }[activity] ?? 1.55;
  const base = Math.round(bmr * actFactor);

  if (goal === "lose") return base - 400;
  if (goal === "gain") return base + 300;
  return base;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return "Guten Morgen! Lass uns dein Profil einrichten.";
  if (hour >= 11 && hour < 17) return "Hey! Starte jetzt durch.";
  return "Guten Abend! Gleich bist du startklar.";
}

interface StepperProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}

function Stepper({ value, min, max, step, onChange }: StepperProps) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 10) / 10));
  const inc = () => onChange(Math.min(max, Math.round((value + step) * 10) / 10));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
      <button onClick={dec} style={{ padding: "12px 18px", background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>−</button>
      <div style={{ flex: 1, textAlign: "center", fontSize: "28px", fontWeight: 500, color: "var(--text-primary)", padding: "8px 0" }}>{value}</div>
      <button onClick={inc} style={{ padding: "12px 18px", background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>+</button>
    </div>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: 75,
    height: 175,
    gender: "m" as "m" | "f",
    goal: "lose",
    activity: "medium",
  });

  const set = (key: string, val: string | number) => setForm((f) => ({ ...f, [key]: val }));

  const goNext = () => { setDirection("forward"); setStep((s) => s + 1); };
  const goBack = () => { setDirection("back"); setStep((s) => s - 1); };

  const kcal = calcCalories(
    Number(form.age) || 25,
    form.weight,
    form.height,
    form.gender,
    form.activity,
    form.goal
  );

  const proteinGoal = Math.round(form.weight * 1.8);
  const carbGoal = Math.round((kcal * 0.4) / 4);
  const fatGoal = Math.round((kcal * 0.25) / 9);

  const handleFinish = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("user_profiles").upsert({
        id: user.id,
        name: form.name || user.user_metadata?.name,
        age: Number(form.age),
        weight: form.weight,
        height: form.height,
        gender: form.gender,
        goal: form.goal,
        activity: form.activity,
        daily_calories: kcal,
        protein_goal: proteinGoal,
        carb_goal: carbGoal,
        fat_goal: fatGoal,
        updated_at: new Date().toISOString(),
      });
    }

    setSaving(false);
    router.push("/dashboard");
    router.refresh();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginBottom: "6px",
    display: "block",
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "12px 16px",
    background: active ? "var(--accent-bg)" : "var(--bg-card)",
    border: active ? "1px solid rgba(29,158,117,0.5)" : "1px solid var(--border)",
    borderRadius: "10px",
    color: active ? "var(--accent-light)" : "var(--text-secondary)",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "center",
  });

  const progressPct = (step / (steps.length - 1)) * 100;
  const animClass = direction === "forward" ? "slide-in-right" : "slide-in-left";

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-in-right { animation: slideInRight 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        .slide-in-left  { animation: slideInLeft  0.32s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: confettiFall 2.4s ease-in forwards;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-primary)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <Link href="/" style={{ fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none", letterSpacing: "-0.5px", marginBottom: "40px" }}>
          forma
        </Link>

        {/* Progress bar */}
        <div style={{ width: "100%", maxWidth: "400px", height: "4px", background: "var(--bg-card)", borderRadius: "99px", marginBottom: "32px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--accent)", borderRadius: "99px", transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>

        <div style={{ width: "100%", maxWidth: "400px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", overflow: "hidden", position: "relative" }}>

          {/* Step 0: Profil */}
          {step === 0 && (
            <div key="step-0" className={animClass} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>👋 Hallo!</div>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>{getGreeting()}</p>
              </div>
              <div>
                <label style={labelStyle}>Name</label>
                <input style={inputStyle} placeholder="Wie heißt du?" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Alter</label>
                <input style={inputStyle} type="number" placeholder="25" value={form.age} onChange={(e) => set("age", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Gewicht (kg)</label>
                <Stepper value={form.weight} min={40} max={200} step={0.5} onChange={(v) => set("weight", v)} />
              </div>
              <div>
                <label style={labelStyle}>Größe (cm)</label>
                <Stepper value={form.height} min={140} max={220} step={1} onChange={(v) => set("height", v)} />
              </div>
              <div>
                <label style={labelStyle}>Geschlecht</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={chipStyle(form.gender === "m")} onClick={() => set("gender", "m")}>Männlich</button>
                  <button style={chipStyle(form.gender === "f")} onClick={() => set("gender", "f")}>Weiblich</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Ziel */}
          {step === 1 && (
            <div key="step-1" className={animClass} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>Was ist dein Ziel?</h2>
              {[
                { val: "lose", label: "Abnehmen", desc: "400 kcal Defizit · mehr Protein" },
                { val: "maintain", label: "Gewicht halten", desc: "Ausgewogene Ernährung" },
                { val: "gain", label: "Zunehmen / Aufbauen", desc: "300 kcal Überschuss · Muskelaufbau" },
              ].map((g) => (
                <button key={g.val} onClick={() => set("goal", g.val)} style={{ padding: "16px 20px", background: form.goal === g.val ? "var(--accent-bg)" : "var(--bg-hover)", border: form.goal === g.val ? "1px solid rgba(29,158,117,0.5)" : "1px solid var(--border)", borderRadius: "12px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: form.goal === g.val ? "var(--accent-light)" : "var(--text-primary)" }}>{g.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>{g.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Aktivität */}
          {step === 2 && (
            <div key="step-2" className={animClass} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>Wie aktiv bist du?</h2>
              {[
                { val: "low", label: "Wenig aktiv", desc: "Bürojob, kaum Sport" },
                { val: "medium", label: "Mäßig aktiv", desc: "2–3× Sport pro Woche" },
                { val: "high", label: "Sehr aktiv", desc: "5+ Trainings pro Woche" },
              ].map((a) => (
                <button key={a.val} onClick={() => set("activity", a.val)} style={{ padding: "16px 20px", background: form.activity === a.val ? "var(--accent-bg)" : "var(--bg-hover)", border: form.activity === a.val ? "1px solid rgba(29,158,117,0.5)" : "1px solid var(--border)", borderRadius: "12px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: form.activity === a.val ? "var(--accent-light)" : "var(--text-primary)" }}>{a.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>{a.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Fertig + Konfetti */}
          {step === 3 && (
            <div key="step-3" className={animClass} style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "center", position: "relative" }}>
              {/* Konfetti */}
              {[
                { color: "#1D9E75", left: "10%", delay: "0s" },
                { color: "#EF9F27", left: "25%", delay: "0.15s" },
                { color: "#5B8DD9", left: "50%", delay: "0.05s" },
                { color: "#E24B4A", left: "70%", delay: "0.3s" },
                { color: "#5DCAA5", left: "85%", delay: "0.2s" },
                { color: "#EF9F27", left: "40%", delay: "0.4s" },
              ].map((c, i) => (
                <div key={i} className="confetti-piece" style={{ background: c.color, left: c.left, top: "0px", animationDelay: c.delay }} />
              ))}

              <div style={{ fontSize: "48px" }}>🎉</div>
              <h2 style={{ fontSize: "20px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>Dein Plan ist bereit</h2>
              <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "12px", padding: "20px" }}>
                <div style={{ fontSize: "36px", fontWeight: 500, color: "var(--accent-light)" }}>{kcal} kcal</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Tägliches Kalorienziel</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {[
                  { label: "Protein", val: `${proteinGoal}g`, color: "var(--accent-light)" },
                  { label: "Carbs", val: `${carbGoal}g`, color: "var(--text-primary)" },
                  { label: "Fett", val: `${fatGoal}g`, color: "var(--text-primary)" },
                ].map((m) => (
                  <div key={m.label} style={{ background: "var(--bg-hover)", borderRadius: "8px", padding: "10px" }}>
                    <div style={{ fontSize: "16px", fontWeight: 500, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
            {step > 0 ? (
              <button onClick={goBack} style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-secondary)", fontSize: "14px", cursor: "pointer" }}>
                Zurück
              </button>
            ) : <div />}
            {step < 3 ? (
              <button onClick={goNext} style={{ padding: "10px 24px", background: "var(--accent)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                Weiter
              </button>
            ) : (
              <button onClick={handleFinish} disabled={saving} style={{ padding: "10px 24px", background: saving ? "var(--bg-hover)" : "var(--accent)", border: "none", borderRadius: "8px", color: saving ? "var(--text-muted)" : "#fff", fontSize: "14px", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Wird gespeichert…" : "Zum Dashboard"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
