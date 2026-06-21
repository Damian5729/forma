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

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "m" as "m" | "f",
    goal: "lose",
    activity: "medium",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const kcal = calcCalories(
    Number(form.age) || 25,
    Number(form.weight) || 75,
    Number(form.height) || 175,
    form.gender,
    form.activity,
    form.goal
  );

  const proteinGoal = Math.round((Number(form.weight) || 75) * 1.8);
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
        weight: Number(form.weight),
        height: Number(form.height),
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

  return (
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
      <Link href="/" style={{ fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none", letterSpacing: "-0.5px", marginBottom: "48px" }}>
        forma
      </Link>

      <div style={{ display: "flex", gap: "8px", marginBottom: "40px" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: i <= step ? "var(--accent)" : "var(--bg-card)",
                border: i <= step ? "none" : "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px",
                color: i <= step ? "#fff" : "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: "40px", height: "1px", background: i < step ? "var(--accent)" : "var(--border)" }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: "400px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px" }}>
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>Dein Profil</h2>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} placeholder="Wie heißt du?" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Alter</label>
                <input style={inputStyle} type="number" placeholder="25" value={form.age} onChange={(e) => set("age", e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Gewicht (kg)</label>
                <input style={inputStyle} type="number" placeholder="75" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Größe (cm)</label>
              <input style={inputStyle} type="number" placeholder="175" value={form.height} onChange={(e) => set("height", e.target.value)} />
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

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", color: "var(--accent)" }}>◎</div>
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
            <button onClick={() => setStep((s) => s - 1)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-secondary)", fontSize: "14px", cursor: "pointer" }}>
              Zurück
            </button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={() => setStep((s) => s + 1)} style={{ padding: "10px 24px", background: "var(--accent)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
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
  );
}
