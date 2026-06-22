"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Supplement {
  id: string;
  name: string;
  dose: string | null;
  time_of_day: string;
  emoji: string;
  notes: string | null;
}

interface CompletionKey {
  supplement_id: string;
}

interface Props {
  userId: string;
  initialPlan: Supplement[];
  todayCompletions: CompletionKey[];
  today: string;
  isPro?: boolean;
}

const TIME_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  morning:   { label: "Morgens",    emoji: "🌅", color: "#EF9F27" },
  afternoon: { label: "Mittags",    emoji: "☀️",  color: "#5DCAA5" },
  evening:   { label: "Abends",     emoji: "🌆", color: "#8B5CF6" },
  night:     { label: "Nachts",     emoji: "🌙", color: "#378ADD" },
};

const COMMON_SUPPLEMENTS = [
  { name: "Ashwagandha",  emoji: "🌿", dose: "300mg",  time: "evening" },
  { name: "Vitamin D3",   emoji: "☀️",  dose: "2000 IE", time: "morning" },
  { name: "Zink",         emoji: "⚡",  dose: "15mg",   time: "evening" },
  { name: "Magnesium",    emoji: "💙",  dose: "300mg",  time: "night" },
  { name: "Omega-3",      emoji: "🐟",  dose: "2g",     time: "morning" },
  { name: "Vitamin C",    emoji: "🍊",  dose: "500mg",  time: "morning" },
  { name: "Kreatin",      emoji: "💪",  dose: "5g",     time: "morning" },
  { name: "B12",          emoji: "🔴",  dose: "1000µg", time: "morning" },
  { name: "Eisen",        emoji: "🩸",  dose: "14mg",   time: "morning" },
  { name: "Melatonin",    emoji: "😴",  dose: "0.5mg",  time: "night" },
  { name: "L-Theanin",   emoji: "🍵",  dose: "200mg",  time: "evening" },
  { name: "Probiotika",   emoji: "🦠",  dose: "1 Kap.", time: "morning" },
];

export function PlanClient({ userId, initialPlan, todayCompletions, today, isPro = false }: Props) {
  const [plan, setPlan] = useState<Supplement[]>(initialPlan);
  const [done, setDone] = useState<Set<string>>(new Set(todayCompletions.map((c) => c.supplement_id)));
  const [showAdd, setShowAdd] = useState(false);
  const [showBloodtest, setShowBloodtest] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ findings: string[]; supplements: { name: string; dose: string; time: string; reason: string; emoji: string }[] } | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newSupp, setNewSupp] = useState({ name: "", dose: "", time_of_day: "morning", emoji: "💊" });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const toggle = async (id: string) => {
    const isNowDone = !done.has(id);
    setDone((prev) => {
      const next = new Set(prev);
      isNowDone ? next.add(id) : next.delete(id);
      return next;
    });
    if (isNowDone) {
      await supabase.from("supplement_logs").insert({ user_id: userId, supplement_id: id, logged_date: today });
    } else {
      await supabase.from("supplement_logs").delete().eq("user_id", userId).eq("supplement_id", id).eq("logged_date", today);
    }
  };

  const addSupp = async (s?: { name: string; dose: string; time_of_day: string; emoji: string }) => {
    const data = s ?? newSupp;
    if (!data.name) return;
    setSaving(true);
    const { data: row, error } = await supabase.from("supplement_plans").insert({
      user_id: userId,
      name: data.name,
      dose: data.dose || null,
      time_of_day: data.time_of_day,
      emoji: data.emoji || "💊",
    }).select().single();
    setSaving(false);
    if (!error && row) {
      setPlan((prev) => [...prev, row]);
      setNewSupp({ name: "", dose: "", time_of_day: "morning", emoji: "💊" });
      setShowAdd(false);
    }
  };

  const deleteSupp = async (id: string) => {
    setDeleting(id);
    await supabase.from("supplement_plans").delete().eq("id", id);
    setPlan((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  };

  const handleBloodtest = async (file: File) => {
    setScanning(true);
    setScanResult(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      const mimeType = file.type;
      const res = await fetch("/api/bloodtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const data = await res.json();
      setScanResult(data);
      setScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const addFromScan = async (s: { name: string; dose: string; time: string; emoji: string }) => {
    setAdding(s.name);
    await addSupp({ name: s.name, dose: s.dose, time_of_day: s.time, emoji: s.emoji });
    setAdding(null);
    router.refresh();
  };

  const grouped = Object.keys(TIME_LABELS).reduce((acc, time) => {
    acc[time] = plan.filter((s) => s.time_of_day === time);
    return acc;
  }, {} as Record<string, Supplement[]>);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: "var(--bg-hover)", border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none",
  };

  return (
    <div>
      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ flex: 1, padding: "10px", background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "10px", color: "var(--accent-light)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
          + Supplement hinzufügen
        </button>
        {isPro ? (
          <button onClick={() => setShowBloodtest(!showBloodtest)}
            style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.05))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", color: "#A78BFA", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            🩸 Blutbild scannen
          </button>
        ) : (
          <a href="/upgrade"
            style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,rgba(245,158,11,0.1),rgba(245,158,11,0.05))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", color: "#F59E0B", fontSize: "13px", fontWeight: 500, cursor: "pointer", textAlign: "center", textDecoration: "none", display: "block" }}>
            🩸 Blutbild scannen <span style={{ fontSize: "10px", background: "rgba(245,158,11,0.2)", padding: "1px 6px", borderRadius: "99px", marginLeft: "4px" }}>PRO</span>
          </a>
        )}
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.8px", marginBottom: "12px" }}>SUPPLEMENT HINZUFÜGEN</p>

          {/* Quick picks */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
            {COMMON_SUPPLEMENTS.filter((c) => !plan.find((p) => p.name.toLowerCase() === c.name.toLowerCase())).map((c) => (
              <button key={c.name} onClick={() => addSupp({ name: c.name, dose: c.dose, time_of_day: c.time, emoji: c.emoji })}
                style={{ padding: "5px 10px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "99px", color: "var(--text-secondary)", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input placeholder="Name *" value={newSupp.name} onChange={(e) => setNewSupp((p) => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, flex: 2 }} />
            <input placeholder="Emoji" value={newSupp.emoji} onChange={(e) => setNewSupp((p) => ({ ...p, emoji: e.target.value }))} style={{ ...inputStyle, flex: 0.5, textAlign: "center" }} />
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input placeholder="Dosis (z.B. 400mg)" value={newSupp.dose} onChange={(e) => setNewSupp((p) => ({ ...p, dose: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
            <select value={newSupp.time_of_day} onChange={(e) => setNewSupp((p) => ({ ...p, time_of_day: e.target.value }))}
              style={{ ...inputStyle, flex: 1 }}>
              {Object.entries(TIME_LABELS).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <button onClick={() => addSupp()} disabled={!newSupp.name || saving}
            style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg,#1D9E75,#16835f)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Speichert…" : "Hinzufügen"}
          </button>
        </div>
      )}

      {/* Blood test scanner */}
      {showBloodtest && (
        <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.08),rgba(139,92,246,0.03))", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "14px", padding: "18px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "#A78BFA", letterSpacing: "0.8px", marginBottom: "8px" }}>🩸 KI-BLUTBILD ANALYSE</p>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: 1.5 }}>
            Lade dein Blutbild hoch — die KI analysiert Mängel und schlägt passende Supplements vor.
          </p>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBloodtest(f); }} />
          <button onClick={() => fileRef.current?.click()} disabled={scanning}
            style={{ width: "100%", padding: "12px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", color: "#A78BFA", fontSize: "14px", fontWeight: 500, cursor: "pointer", opacity: scanning ? 0.7 : 1 }}>
            {scanning ? "🔍 Analysiere Blutbild…" : "📷 Foto hochladen"}
          </button>

          {scanResult && (
            <div style={{ marginTop: "16px" }}>
              {scanResult.findings?.length > 0 && (
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "12px", marginBottom: "12px" }}>
                  <p style={{ fontSize: "10px", color: "#A78BFA", letterSpacing: "0.5px", marginBottom: "8px" }}>BEFUNDE</p>
                  {scanResult.findings.map((f, i) => (
                    <p key={i} style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 4px", lineHeight: 1.5 }}>• {f}</p>
                  ))}
                </div>
              )}
              {scanResult.supplements?.length > 0 && (
                <div>
                  <p style={{ fontSize: "10px", color: "#A78BFA", letterSpacing: "0.5px", marginBottom: "10px" }}>EMPFEHLUNGEN</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {scanResult.supplements.map((s) => {
                      const alreadyInPlan = plan.some((p) => p.name.toLowerCase() === s.name.toLowerCase());
                      return (
                        <div key={s.name} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "12px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "20px", flexShrink: 0 }}>{s.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{s.name} <span style={{ fontSize: "11px", color: "#A78BFA", fontWeight: 400 }}>{s.dose}</span></div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{s.reason} · {TIME_LABELS[s.time]?.label ?? s.time}</div>
                          </div>
                          {alreadyInPlan ? (
                            <span style={{ fontSize: "11px", color: "var(--accent-light)", flexShrink: 0 }}>✓ Im Plan</span>
                          ) : (
                            <button onClick={() => addFromScan(s)} disabled={adding === s.name}
                              style={{ flexShrink: 0, padding: "5px 12px", background: "#8B5CF6", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px", fontWeight: 500, cursor: "pointer", opacity: adding === s.name ? 0.6 : 1 }}>
                              {adding === s.name ? "…" : "+ Hinzufügen"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {(!scanResult.supplements || scanResult.supplements.length === 0) && !scanResult.findings?.length && (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "12px 0" }}>Keine Empfehlungen — Blutbild sieht gut aus oder Bild konnte nicht ausgewertet werden.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Plan list */}
      {plan.length === 0 && !showAdd && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>💊</div>
          <p style={{ fontSize: "14px" }}>Noch kein Supplement-Plan.</p>
          <p style={{ fontSize: "12px", marginTop: "4px" }}>Füge Supplements manuell hinzu oder lass dein Blutbild analysieren.</p>
        </div>
      )}

      {Object.entries(TIME_LABELS).map(([time, { label, emoji, color }]) => {
        const items = grouped[time];
        if (!items?.length) return null;
        const doneCount = items.filter((s) => done.has(s.id)).length;
        return (
          <div key={time} style={{ marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px" }}>{emoji}</span>
              <h2 style={{ fontSize: "12px", fontWeight: 600, color, letterSpacing: "0.5px", margin: 0 }}>{label.toUpperCase()}</h2>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "auto" }}>{doneCount}/{items.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {items.map((s) => {
                const isDone = done.has(s.id);
                return (
                  <div key={s.id} style={{ background: isDone ? "rgba(29,158,117,0.06)" : "var(--bg-card)", border: `1px solid ${isDone ? "rgba(29,158,117,0.25)" : "var(--border)"}`, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s", opacity: deleting === s.id ? 0.4 : 1 }}>
                    <button onClick={() => toggle(s.id)}
                      style={{ width: "22px", height: "22px", borderRadius: "50%", background: isDone ? "#1D9E75" : "transparent", border: `2px solid ${isDone ? "#1D9E75" : "var(--border)"}`, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", transition: "all 0.2s" }}>
                      {isDone ? "✓" : ""}
                    </button>
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>{s.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "14px", color: isDone ? "var(--text-muted)" : "var(--text-primary)", fontWeight: 500, textDecoration: isDone ? "line-through" : "none" }}>{s.name}</span>
                      {s.dose && <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "6px" }}>{s.dose}</span>}
                    </div>
                    <button onClick={() => deleteSupp(s.id)} disabled={deleting === s.id}
                      style={{ width: "22px", height: "22px", borderRadius: "6px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
