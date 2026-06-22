import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Untergewicht", color: "#378ADD" };
  if (bmi < 25)   return { label: "Normalgewicht", color: "#1D9E75" };
  if (bmi < 30)   return { label: "Übergewicht",   color: "#EF9F27" };
  return              { label: "Adipositas",        color: "#E24B4A" };
}

// Map BMI 14–40 to 0–100% on the scale bar
function bmiToPercent(bmi: number) {
  return Math.min(100, Math.max(0, ((bmi - 14) / 26) * 100));
}

export default async function BmiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("weight, height, age, gender, goal, daily_calories, protein_goal, carb_goal, fat_goal, name")
    .eq("id", user.id)
    .single();

  const weight = profile?.weight ?? null;
  const height = profile?.height ?? null;

  const bmi = weight && height
    ? Math.round((weight / ((height / 100) ** 2)) * 10) / 10
    : null;

  const bmiInfo = bmi ? getBmiCategory(bmi) : null;
  const markerPercent = bmi ? bmiToPercent(bmi) : null;

  // Ideal weight range (BMI 18.5–24.9)
  const idealMin = height ? Math.round(18.5 * ((height / 100) ** 2) * 10) / 10 : null;
  const idealMax = height ? Math.round(24.9 * ((height / 100) ** 2) * 10) / 10 : null;

  const goalLabel: Record<string, string> = {
    abnehmen: "Abnehmen",
    zunehmen: "Zunehmen",
    halten:   "Gewicht halten",
  };

  const genderLabel: Record<string, string> = {
    male:   "Männlich",
    female: "Weiblich",
    other:  "Divers",
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "20px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "var(--text-muted)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "4px",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 500,
    color: "var(--text-primary)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/profile" userName={profile?.name ?? user.email ?? "User"} />

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 4px", color: "var(--text-primary)" }}>
          BMI & Körperwerte
        </h1>

        {/* BMI Card */}
        <div style={{ ...cardStyle }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "52px", fontWeight: 700, color: bmiInfo?.color ?? "var(--text-secondary)", lineHeight: 1 }}>
              {bmi ?? "–"}
            </span>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>BMI</div>
              {bmiInfo && (
                <div style={{ fontSize: "15px", fontWeight: 500, color: bmiInfo.color }}>
                  {bmiInfo.label}
                </div>
              )}
            </div>
          </div>

          {/* BMI Scale Bar */}
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <div style={{
              height: "10px",
              borderRadius: "6px",
              background: "linear-gradient(to right, #378ADD 0%, #378ADD 17%, #1D9E75 17%, #1D9E75 42%, #EF9F27 42%, #EF9F27 62%, #E24B4A 62%, #E24B4A 100%)",
            }} />
            {markerPercent !== null && (
              <div style={{
                position: "absolute",
                top: "-4px",
                left: `${markerPercent}%`,
                transform: "translateX(-50%)",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: bmiInfo?.color ?? "var(--accent)",
                border: "3px solid var(--bg-card)",
                boxShadow: "0 0 0 2px " + (bmiInfo?.color ?? "var(--accent)"),
              }} />
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px" }}>
            <span>14</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "var(--text-muted)" }}>
            <span style={{ color: "#378ADD" }}>Unter</span>
            <span style={{ color: "#1D9E75" }}>Normal</span>
            <span style={{ color: "#EF9F27" }}>Über</span>
            <span style={{ color: "#E24B4A" }}>Adip.</span>
          </div>
        </div>

        {/* Idealgewicht */}
        {idealMin && idealMax && (
          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px" }}>
              Idealgewicht für {height} cm
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 600, color: "#1D9E75" }}>
                {idealMin}–{idealMax} <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 400 }}>kg</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                (BMI 18.5 – 24.9)
              </div>
            </div>
            {weight && (
              <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                {weight < idealMin
                  ? `Du bist ${Math.round((idealMin - weight) * 10) / 10} kg unter dem Idealbereich`
                  : weight > idealMax
                  ? `Du bist ${Math.round((weight - idealMax) * 10) / 10} kg über dem Idealbereich`
                  : "Dein Gewicht liegt im idealen Bereich"}
              </div>
            )}
          </div>
        )}

        {/* Körpermasse Grid */}
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "14px" }}>
            Körpermasse
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { label: "Gewicht", value: weight ? `${weight} kg` : "–" },
              { label: "Größe",   value: height ? `${height} cm` : "–" },
              { label: "Alter",   value: profile?.age ? `${profile.age} Jahre` : "–" },
              { label: "Geschlecht", value: profile?.gender ? (genderLabel[profile.gender] ?? profile.gender) : "–" },
              { label: "Ziel",    value: profile?.goal ? (goalLabel[profile.goal] ?? profile.goal) : "–" },
            ].map((item) => (
              <div key={item.label}>
                <div style={labelStyle}>{item.label}</div>
                <div style={valueStyle}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Kalorienbedarf */}
        {profile?.daily_calories && (
          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "14px" }}>
              Täglicher Bedarf
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
              {[
                { label: "Kalorien", value: `${profile.daily_calories}`, unit: "kcal", color: "var(--accent-light)" },
                { label: "Protein",  value: `${profile.protein_goal ?? "–"}`,  unit: "g", color: "#E26B4A" },
                { label: "Kohlenh.", value: `${profile.carb_goal ?? "–"}`,     unit: "g", color: "#EF9F27" },
                { label: "Fett",     value: `${profile.fat_goal ?? "–"}`,      unit: "g", color: "#378ADD" },
              ].map((m) => (
                <div key={m.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: "4px" }}>{m.label}</div>
                  <div style={{ fontSize: "20px", fontWeight: 600, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{m.unit}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!profile && (
          <div style={{ ...cardStyle, textAlign: "center", color: "var(--text-muted)", padding: "40px 20px" }}>
            Kein Profil gefunden. Bitte fülle zuerst deine Profildaten aus.
          </div>
        )}
      </main>
    </div>
  );
}
