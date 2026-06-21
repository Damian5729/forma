"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userId: string;
  initial: Record<string, unknown> | null;
}

function calcCalories(age: number, weight: number, height: number, gender: string, activity: string, goal: string): number {
  const bmr = gender === "m"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const act = { low: 1.375, medium: 1.55, high: 1.725 }[activity] ?? 1.55;
  const base = Math.round(bmr * act);
  if (goal === "lose") return base - 400;
  if (goal === "gain") return base + 300;
  return base;
}

export function ProfileForm({ userId, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: (initial?.name as string) ?? "",
    age: String(initial?.age ?? ""),
    weight: String(initial?.weight ?? ""),
    height: String(initial?.height ?? ""),
    gender: (initial?.gender as string) ?? "m",
    goal: (initial?.goal as string) ?? "lose",
    activity: (initial?.activity as string) ?? "medium",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const previewCalories = form.age && form.weight && form.height
    ? calcCalories(Number(form.age), Number(form.weight), Number(form.height), form.gender, form.activity, form.goal)
    : null;

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const kcal = calcCalories(Number(form.age), Number(form.weight), Number(form.height), form.gender, form.activity, form.goal);
    const protein = Math.round(Number(form.weight) * 1.8);
    const carbs = Math.round((kcal * 0.4) / 4);
    const fat = Math.round((kcal * 0.25) / 9);

    await supabase.from("user_profiles").upsert({
      id: userId,
      name: form.name,
      age: Number(form.age),
      weight: Number(form.weight),
      height: Number(form.height),
      gender: form.gender,
      goal: form.goal,
      activity: form.activity,
      daily_calories: kcal,
      protein_goal: protein,
      carb_goal: carbs,
      fat_goal: fat,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.refresh(); }, 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "var(--bg-hover)", border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none",
  };

  const chip = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: "10px 12px",
    background: active ? "var(--accent-bg)" : "var(--bg-hover)",
    border: active ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)",
    borderRadius: "8px", color: active ? "var(--accent-light)" : "var(--text-secondary)",
    fontSize: "13px", cursor: "pointer", textAlign: "center",
  });

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Name</label>
        <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Dein Name" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        {[
          { key: "age", label: "Alter", placeholder: "25" },
          { key: "weight", label: "Gewicht (kg)", placeholder: "75" },
          { key: "height", label: "Größe (cm)", placeholder: "175" },
        ].map((f) => (
          <div key={f.key}>
            <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>{f.label}</label>
            <input style={inputStyle} type="number" placeholder={f.placeholder} value={form[f.key as keyof typeof form]} onChange={(e) => set(f.key, e.target.value)} />
          </div>
        ))}
      </div>

      <div>
        <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>Geschlecht</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={chip(form.gender === "m")} onClick={() => set("gender", "m")}>Männlich</button>
          <button style={chip(form.gender === "f")} onClick={() => set("gender", "f")}>Weiblich</button>
        </div>
      </div>

      <div>
        <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>Ziel</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[{ v: "lose", l: "Abnehmen" }, { v: "maintain", l: "Halten" }, { v: "gain", l: "Aufbauen" }].map((g) => (
            <button key={g.v} style={chip(form.goal === g.v)} onClick={() => set("goal", g.v)}>{g.l}</button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>Aktivität</label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[{ v: "low", l: "Wenig" }, { v: "medium", l: "Mäßig" }, { v: "high", l: "Sehr aktiv" }].map((a) => (
            <button key={a.v} style={chip(form.activity === a.v)} onClick={() => set("activity", a.v)}>{a.l}</button>
          ))}
        </div>
      </div>

      {previewCalories && (
        <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.25)", borderRadius: "10px", padding: "14px 16px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Neues Kalorienziel: </span>
          <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--accent-light)" }}>{previewCalories} kcal/Tag</span>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || saved}
        style={{ padding: "12px", background: saved ? "var(--accent-bg)" : "var(--accent)", border: "none", borderRadius: "10px", color: saved ? "var(--accent-light)" : "#fff", fontSize: "15px", fontWeight: 500, cursor: saving || saved ? "default" : "pointer" }}
      >
        {saved ? "✓ Gespeichert!" : saving ? "Wird gespeichert…" : "Profil speichern"}
      </button>
    </div>
  );
}
