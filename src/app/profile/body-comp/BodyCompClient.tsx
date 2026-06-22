"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userId: string;
  gender: string;
  height: number;
  weight: number;
  saved: {
    neck_cm: number | null;
    waist_cm: number | null;
    hip_cm: number | null;
    body_fat_pct: number | null;
  };
}

// Navy Body Fat Formula
function calcNavyBodyFat(gender: string, height: number, waist: number, neck: number, hip: number): number | null {
  if (!waist || !neck || height < 100) return null;
  if (gender === "m") {
    if (waist <= neck) return null;
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    return Math.max(2, Math.min(60, Math.round(bf * 10) / 10));
  } else {
    if (!hip || waist + hip <= neck) return null;
    const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    return Math.max(8, Math.min(60, Math.round(bf * 10) / 10));
  }
}

function getBfCategory(bf: number, gender: string): { label: string; color: string; desc: string } {
  if (gender === "m") {
    if (bf < 6)  return { label: "Wettkampf", color: "#E24B4A", desc: "Extremer Körperfettanteil — nur Profi-Athleten" };
    if (bf < 14) return { label: "Sportlich", color: "#1D9E75", desc: "Ausgeprägter Sixpack, klare Muskelkonturen sichtbar" };
    if (bf < 18) return { label: "Fit", color: "#1D9E75", desc: "Flacher Bauch, Muskeln erkennbar" };
    if (bf < 25) return { label: "Durchschnitt", color: "#EF9F27", desc: "Leichte Körperfülle, Muskeln wenig definiert" };
    return { label: "Übergewicht", color: "#E24B4A", desc: "Deutlicher Fettansatz, Bauchfett sichtbar" };
  } else {
    if (bf < 16) return { label: "Wettkampf", color: "#E24B4A", desc: "Extrem niedrig — nur Profi-Athletinnen" };
    if (bf < 21) return { label: "Sportlich", color: "#1D9E75", desc: "Schlanke Figur, Muskeln gut definiert" };
    if (bf < 25) return { label: "Fit", color: "#1D9E75", desc: "Schlanke Figur, weibliche Kurven" };
    if (bf < 32) return { label: "Durchschnitt", color: "#EF9F27", desc: "Durchschnittliche Körperform, wenig Muskeldefinition" };
    return { label: "Übergewicht", color: "#E24B4A", desc: "Höherer Fettanteil, Gesundheitsrisiko beachten" };
  }
}

// Visual self-assessment options
const VISUAL_OPTIONS_M = [
  { pct: 8,  label: "~8% — Wettkampf", desc: "Adern überall sichtbar, Sixpack extrem ausgeprägt" },
  { pct: 12, label: "~12% — Sehr sportlich", desc: "Klarer Sixpack, Venen an Armen sichtbar" },
  { pct: 16, label: "~16% — Sportlich", desc: "Flacher Bauch, Muskeln erkennbar" },
  { pct: 20, label: "~20% — Fit", desc: "Leicht definiert, kein Bauch" },
  { pct: 25, label: "~25% — Durchschnitt", desc: "Leichter Bauchansatz" },
  { pct: 30, label: "~30% — Etwas mehr", desc: "Deutlicher Bauch" },
  { pct: 35, label: "~35%+ — Viel", desc: "Starker Bauchansatz, kaum Muskeln sichtbar" },
];

const VISUAL_OPTIONS_F = [
  { pct: 14, label: "~14% — Wettkampf", desc: "Sehr definiert, Adern sichtbar" },
  { pct: 18, label: "~18% — Sehr sportlich", desc: "Schlanke Taille, definierte Arme" },
  { pct: 22, label: "~22% — Sportlich", desc: "Schlanke Figur, feminine Kurven" },
  { pct: 26, label: "~26% — Fit", desc: "Normaler Bauch, weiche Konturen" },
  { pct: 30, label: "~30% — Durchschnitt", desc: "Leichte Körperfülle" },
  { pct: 35, label: "~35% — Etwas mehr", desc: "Deutlichere Körperfülle" },
  { pct: 40, label: "~40%+ — Viel", desc: "Starke Körperfülle" },
];

export function BodyCompClient({ userId, gender, height, weight, saved }: Props) {
  const router = useRouter();
  const [neck, setNeck] = useState(saved.neck_cm ? String(saved.neck_cm) : "");
  const [waist, setWaist] = useState(saved.waist_cm ? String(saved.waist_cm) : "");
  const [hip, setHip] = useState(saved.hip_cm ? String(saved.hip_cm) : "");
  const [visualPct, setVisualPct] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved2, setSaved2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"measure" | "visual">("measure");

  const navyBf = calcNavyBodyFat(gender, height, Number(waist), Number(neck), Number(hip));
  const finalBf = tab === "measure" ? navyBf : visualPct;
  const fatMass = finalBf && weight ? Math.round((finalBf / 100) * weight * 10) / 10 : null;
  const leanMass = fatMass && weight ? Math.round((weight - fatMass) * 10) / 10 : null;
  const cat = finalBf ? getBfCategory(finalBf, gender) : null;
  const visualOptions = gender === "f" ? VISUAL_OPTIONS_F : VISUAL_OPTIONS_M;

  const handleSave = async () => {
    if (!finalBf) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from("user_profiles").update({
      body_fat_pct: finalBf,
      neck_cm: neck ? Number(neck) : null,
      waist_cm: waist ? Number(waist) : null,
      hip_cm: hip ? Number(hip) : null,
    }).eq("id", userId);
    if (err) { setError(err.message); setSaving(false); return; }
    setSaving(false);
    setSaved2(true);
    setTimeout(() => router.push("/profile"), 1500);
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "var(--bg-hover)", border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Tab switch */}
      <div style={{ display: "flex", gap: "8px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "4px" }}>
        {(["measure", "visual"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500,
            background: tab === t ? "var(--accent)" : "transparent",
            color: tab === t ? "#fff" : "var(--text-secondary)",
          }}>
            {t === "measure" ? "📏 Messen (genauer)" : "👁 Visuell schätzen"}
          </button>
        ))}
      </div>

      {tab === "measure" ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Navy-Methode: Umfänge mit einem Maßband messen (entspannt, nicht einziehen).
          </p>

          <div style={{ display: "grid", gridTemplateColumns: gender === "f" ? "1fr 1fr 1fr" : "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>HALSUMFANG (cm)</label>
              <input style={inp} type="number" placeholder="z.B. 38" value={neck} onChange={(e) => setNeck(e.target.value)} />
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Unterhalb Kehlkopf</p>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>BAUCHUMFANG (cm)</label>
              <input style={inp} type="number" placeholder="z.B. 95" value={waist} onChange={(e) => setWaist(e.target.value)} />
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Auf Nabelhöhe</p>
            </div>
            {gender === "f" && (
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>HÜFTUMFANG (cm)</label>
                <input style={inp} type="number" placeholder="z.B. 100" value={hip} onChange={(e) => setHip(e.target.value)} />
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Breiteste Stelle</p>
              </div>
            )}
          </div>

          {navyBf && (
            <div style={{ background: "var(--accent-bg)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "var(--text-secondary)" }}>
              Navy-Formel ergibt: <span style={{ color: cat?.color, fontWeight: 600, fontSize: "15px" }}>{navyBf}% KF</span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Wähle die Beschreibung die am besten zu dir passt:
          </p>
          {visualOptions.map((o) => (
            <button key={o.pct} onClick={() => setVisualPct(o.pct)} style={{
              padding: "12px 14px", borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left",
              background: visualPct === o.pct ? "var(--accent-bg)" : "var(--bg-hover)",
              borderLeft: visualPct === o.pct ? "3px solid var(--accent)" : "3px solid transparent",
            }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: visualPct === o.pct ? "var(--accent-light)" : "var(--text-primary)" }}>{o.label}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{o.desc}</div>
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {finalBf && cat && (
        <div style={{ background: "var(--bg-card)", border: `1.5px solid ${cat.color}40`, borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>Deine Körperzusammensetzung</h3>
            <span style={{ fontSize: "11px", color: cat.color, background: `${cat.color}20`, padding: "3px 10px", borderRadius: "99px", fontWeight: 500 }}>{cat.label}</span>
          </div>

          {/* Big number */}
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "52px", fontWeight: 700, color: cat.color, lineHeight: 1 }}>{finalBf}%</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px" }}>Körperfettanteil</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>{cat.desc}</div>
          </div>

          {/* Bar */}
          <div>
            <div style={{ height: "8px", borderRadius: "99px", background: "linear-gradient(to right, #1D9E75, #EF9F27, #E24B4A)", position: "relative", marginBottom: "4px" }}>
              <div style={{
                position: "absolute", top: "-4px",
                left: `${Math.min(95, Math.max(2, gender === "m" ? ((finalBf - 4) / 36) * 100 : ((finalBf - 10) / 40) * 100))}%`,
                width: "16px", height: "16px", borderRadius: "50%",
                background: cat.color, border: "2px solid var(--bg-card)",
                transform: "translateX(-50%)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)" }}>
              <span>Sportlich</span><span>Fit</span><span>Durchschnitt</span><span>Übergewicht</span>
            </div>
          </div>

          {/* Stats grid */}
          {fatMass && leanMass && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {[
                { label: "Gesamtgewicht", val: `${weight} kg`, color: "var(--text-primary)" },
                { label: "Fettmasse", val: `${fatMass} kg`, color: "#E24B4A" },
                { label: "Muskelmasse", val: `${leanMass} kg`, color: "#1D9E75" },
              ].map((s) => (
                <div key={s.label} style={{ background: "var(--bg-hover)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 600, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          <div style={{ background: "var(--bg-surface)", borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--accent-light)", marginBottom: "6px" }}>Empfehlung für dich</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {finalBf > (gender === "m" ? 25 : 32)
                ? `Mit ${finalBf}% KF empfehlen wir: Kaloriendefizit ~400 kcal/Tag, 3–4× Krafttraining + 2× Kardio. Ziel: Fettabbau bei Muskelerhalt durch hohen Proteinanteil (${leanMass ? Math.round(leanMass * 2) : "~150"}g/Tag).`
                : finalBf < (gender === "m" ? 14 : 20)
                ? `Mit ${finalBf}% KF bist du sehr schlank. Muskelaufbau ist jetzt optimal — Kalorienüberschuss ~300 kcal mit hohem Protein (${leanMass ? Math.round(leanMass * 2.2) : "~160"}g/Tag).`
                : `Mit ${finalBf}% KF bist du im guten Bereich. Body Recomposition möglich — Kalorien halten, Protein hoch (${leanMass ? Math.round(leanMass * 2) : "~150"}g/Tag), 4× Krafttraining.`}
            </div>
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving || saved2} style={{
            padding: "12px", background: saved2 ? "var(--accent-bg)" : "var(--accent)",
            border: "none", borderRadius: "10px", color: saved2 ? "var(--accent-light)" : "#fff",
            fontSize: "15px", fontWeight: 500, cursor: saving || saved2 ? "default" : "pointer",
          }}>
            {saved2 ? "✓ Gespeichert!" : saving ? "Wird gespeichert…" : "Werte speichern"}
          </button>
          {error && <div style={{ fontSize: "12px", color: "#E24B4A" }}>{error}</div>}
        </div>
      )}
    </div>
  );
}
