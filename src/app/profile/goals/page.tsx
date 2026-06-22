"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Nav } from "@/components/Nav";

function calcCalories(age: number, weight: number, height: number, gender: string, activity: string, goal: string): number {
  const bmr = gender === "m"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const act = { low: 1.375, medium: 1.55, high: 1.725 }[activity as "low" | "medium" | "high"] ?? 1.55;
  const base = Math.round(bmr * act);
  if (goal === "lose") return base - 400;
  if (goal === "gain") return base + 300;
  return base;
}

interface Goals {
  daily_calories: number;
  protein_goal: number;
  carb_goal: number;
  fat_goal: number;
}

interface Profile {
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  activity?: string;
  goal?: string;
  name?: string;
}

export default function GoalsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Goals>({
    daily_calories: 1850,
    protein_goal: 140,
    carb_goal: 185,
    fat_goal: 60,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<Goals | null>(null);
  const [showRec, setShowRec] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }

      setUserId(user.id);
      setUserName(user.user_metadata?.name ?? user.email ?? "User");

      const { data } = await supabase
        .from("user_profiles")
        .select("daily_calories, protein_goal, carb_goal, fat_goal, age, weight, height, gender, activity, goal, name")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setForm({
          daily_calories: data.daily_calories ?? 1850,
          protein_goal: data.protein_goal ?? 140,
          carb_goal: data.carb_goal ?? 185,
          fat_goal: data.fat_goal ?? 60,
        });
        if (data.name) setUserName(data.name);
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const set = (k: keyof Goals, v: string) =>
    setForm((f) => ({ ...f, [k]: Number(v) || 0 }));

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("user_profiles").update({
      daily_calories: form.daily_calories,
      protein_goal: form.protein_goal,
      carb_goal: form.carb_goal,
      fat_goal: form.fat_goal,
    }).eq("id", userId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCalcRecommendation = () => {
    if (!profile?.age || !profile?.weight || !profile?.height) {
      alert("Bitte zuerst Alter, Gewicht und Größe im Profil hinterlegen.");
      return;
    }
    const kcal = calcCalories(
      Number(profile.age),
      Number(profile.weight),
      Number(profile.height),
      profile.gender ?? "m",
      profile.activity ?? "medium",
      profile.goal ?? "lose",
    );
    const rec: Goals = {
      daily_calories: kcal,
      protein_goal: Math.round(Number(profile.weight) * 1.8),
      carb_goal: Math.round((kcal * 0.4) / 4),
      fat_goal: Math.round((kcal * 0.25) / 9),
    };
    setRecommendation(rec);
    setShowRec(true);
  };

  const applyRecommendation = () => {
    if (recommendation) {
      setForm(recommendation);
      setShowRec(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "var(--bg-hover)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
  };

  const fields: { key: keyof Goals; label: string; unit: string }[] = [
    { key: "daily_calories", label: "Tägliche Kalorien", unit: "kcal" },
    { key: "protein_goal", label: "Protein", unit: "g" },
    { key: "carb_goal", label: "Kohlenhydrate", unit: "g" },
    { key: "fat_goal", label: "Fett", unit: "g" },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
        <Nav active="/profile" userName={userName} />
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Lädt…</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/profile" userName={userName} />

      <main style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "16px", display: "flex", alignItems: "center", gap: "4px" }}
          >
            ← Zurück
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 6px" }}>
            🎯 Makro-Ziele
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Setze deine täglichen Ziele manuell oder lass sie anhand deines Profils berechnen.
          </p>
        </div>

        {/* Inputs */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "14px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {fields.map(({ key, label, unit }) => (
            <div key={key}>
              <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>{label}</span>
                <span style={{ color: "var(--text-muted)" }}>{unit}</span>
              </label>
              <input
                type="number"
                min={0}
                style={inputStyle}
                value={form[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>

        {/* Recommendation panel */}
        {showRec && recommendation && (
          <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "14px", padding: "18px 20px", marginBottom: "14px" }}>
            <p style={{ fontSize: "12px", color: "var(--accent-light)", letterSpacing: "0.5px", marginBottom: "12px", fontWeight: 500 }}>
              EMPFEHLUNG AUS DEINEM PROFIL
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
              {fields.map(({ key, label, unit }) => (
                <div key={key} style={{ background: "rgba(29,158,117,0.08)", borderRadius: "10px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "3px" }}>{label}</div>
                  <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--accent-light)" }}>
                    {recommendation[key]} <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--text-muted)" }}>{unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={applyRecommendation}
                style={{ flex: 1, padding: "10px", background: "var(--accent)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
              >
                Übernehmen
              </button>
              <button
                onClick={() => setShowRec(false)}
                style={{ padding: "10px 14px", background: "transparent", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}
              >
                Schließen
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            style={{
              padding: "14px",
              background: saved ? "var(--accent-bg)" : "var(--accent)",
              border: saved ? "1px solid rgba(29,158,117,0.4)" : "none",
              borderRadius: "12px",
              color: saved ? "var(--accent-light)" : "#fff",
              fontSize: "15px",
              fontWeight: 500,
              cursor: saving || saved ? "default" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {saved ? "✓ Gespeichert!" : saving ? "Wird gespeichert…" : "Ziele speichern"}
          </button>

          <button
            onClick={handleCalcRecommendation}
            style={{
              padding: "13px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--text-secondary)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            🧮 Berechnen lassen
          </button>
        </div>

        {/* Info note */}
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "18px", lineHeight: 1.6, textAlign: "center" }}>
          Manuelle Ziele werden beim nächsten Profil-Speichern nicht überschrieben — nur bei Änderungen im Profil-Formular.
        </p>
      </main>
    </div>
  );
}
