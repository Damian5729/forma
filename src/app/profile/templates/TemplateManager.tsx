"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Template {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
}

interface Props {
  userId: string;
  initialTemplates: Template[];
}

const mealTypes = [
  { val: "breakfast", label: "Frühstück" },
  { val: "lunch", label: "Mittagessen" },
  { val: "dinner", label: "Abendessen" },
  { val: "snack", label: "Snack" },
];

export function TemplateManager({ userId, initialTemplates }: Props) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "", meal_type: "lunch" });
  const [saving, setSaving] = useState(false);
  const [logging, setLogging] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    if (!form.name || !form.calories) return;
    setSaving(true);
    const supabase = createClient();
    const { data } = await supabase.from("meal_templates").insert({
      user_id: userId,
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      meal_type: form.meal_type,
    }).select().single();
    if (data) setTemplates((p) => [data as Template, ...p]);
    setSaving(false);
    setShowForm(false);
    setForm({ name: "", calories: "", protein: "", carbs: "", fat: "", meal_type: "lunch" });
  };

  const handleLog = async (t: Template) => {
    setLogging(t.id);
    const supabase = createClient();
    await supabase.from("meal_logs").insert({
      user_id: userId,
      name: t.name,
      calories: t.calories,
      protein: t.protein,
      carbs: t.carbs,
      fat: t.fat,
      meal_type: t.meal_type,
    });
    setLogging(null);
    router.push("/dashboard");
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("meal_templates").delete().eq("id", id);
    setTemplates((p) => p.filter((t) => t.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    background: "var(--bg-hover)", border: "1px solid var(--border)",
    borderRadius: "8px", color: "var(--text-primary)", fontSize: "14px", outline: "none",
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ width: "100%", padding: "12px", background: "var(--accent)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer", marginBottom: "16px" }}
      >
        + Neue Vorlage erstellen
      </button>

      {showForm && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input style={inputStyle} placeholder="Name (z.B. Mein Frühstück)" value={form.name} onChange={(e) => set("name", e.target.value)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <input style={inputStyle} type="number" placeholder="Kalorien" value={form.calories} onChange={(e) => set("calories", e.target.value)} />
              <input style={inputStyle} type="number" placeholder="Protein (g)" value={form.protein} onChange={(e) => set("protein", e.target.value)} />
              <input style={inputStyle} type="number" placeholder="Carbs (g)" value={form.carbs} onChange={(e) => set("carbs", e.target.value)} />
              <input style={inputStyle} type="number" placeholder="Fett (g)" value={form.fat} onChange={(e) => set("fat", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {mealTypes.map((t) => (
                <button key={t.val} onClick={() => set("meal_type", t.val)} style={{ flex: 1, padding: "7px 4px", fontSize: "11px", background: form.meal_type === t.val ? "var(--accent-bg)" : "var(--bg-hover)", border: form.meal_type === t.val ? "1px solid rgba(29,158,117,0.4)" : "1px solid var(--border)", borderRadius: "6px", color: form.meal_type === t.val ? "var(--accent-light)" : "var(--text-secondary)", cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-secondary)", fontSize: "14px", cursor: "pointer" }}>
                Abbrechen
              </button>
              <button onClick={handleCreate} disabled={saving} style={{ flex: 2, padding: "10px", background: "var(--accent)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: saving ? "default" : "pointer" }}>
                {saving ? "Wird gespeichert…" : "Vorlage speichern"}
              </button>
            </div>
          </div>
        </div>
      )}

      {templates.length === 0 && !showForm && (
        <p style={{ fontSize: "14px", color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>
          Noch keine Vorlagen. Erstelle dein erstes Lieblings-Gericht!
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {templates.map((t) => (
          <div key={t.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.name}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "var(--accent-light)" }}>{t.calories} kcal</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>P: {t.protein}g</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{mealTypes.find((m) => m.val === t.meal_type)?.label}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
              <button
                onClick={() => handleLog(t)}
                disabled={logging === t.id}
                style={{ padding: "7px 14px", background: "var(--accent)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px", fontWeight: 500, cursor: logging === t.id ? "default" : "pointer" }}
              >
                {logging === t.id ? "…" : "+ Loggen"}
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                style={{ padding: "7px 10px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
