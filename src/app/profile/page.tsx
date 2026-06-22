import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ProfileForm } from "./ProfileForm";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export default async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userName = user.user_metadata?.name ?? user.email ?? "User";

  // Compute BMI if we have data
  const bmi = profile?.weight && profile?.height
    ? Math.round((profile.weight / ((profile.height / 100) ** 2)) * 10) / 10
    : null;

  const bmiCategory = bmi
    ? bmi < 18.5 ? "Untergewicht" : bmi < 25 ? "Normalgewicht" : bmi < 30 ? "Übergewicht" : "Adipositas"
    : null;

  const bmiColor = bmi
    ? bmi < 18.5 ? "#378ADD" : bmi < 25 ? "#1D9E75" : bmi < 30 ? "#EF9F27" : "#E24B4A"
    : "var(--text-secondary)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/profile" userName={userName} />

      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 28px", color: "var(--text-primary)" }}>
          Mein Profil
        </h1>

        {/* Stats */}
        {profile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Kalorienziel", val: `${profile.daily_calories ?? 1850}`, unit: "kcal" },
              { label: "Protein-Ziel", val: `${profile.protein_goal ?? "–"}`, unit: "g" },
              { label: "BMI", val: bmi ? `${bmi}` : "–", unit: bmiCategory ?? "", color: bmiColor },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.4px" }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: "22px", fontWeight: 500, color: (s as { color?: string }).color ?? "var(--accent-light)" }}>{s.val}</div>
                {s.unit && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{s.unit}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
          {[
            { href: "/profile/measurements", label: "Körpermaße", icon: "📏", desc: "Taille, Hüfte, Arme tracken" },
            { href: "/profile/templates", label: "Vorlagen", icon: "📋", desc: "Lieblingsmahlzeiten speichern" },
            { href: "/profile/bmi", label: "BMI & Körper", icon: "⚖️", desc: "BMI, Idealgewicht & Werte" },
            { href: "/fitness/plan", label: "Trainingspläne", icon: "🏋️", desc: "Empfohlen für dein Ziel" },
            { href: "/profile/goals", label: "Makro-Ziele", icon: "🎯", desc: "Kalorien & Makros anpassen" },
            { href: "/profile/body-comp", label: "Körperzusammensetzung", icon: "🧬", desc: "Körperfett % & Muskelmasse" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px", textDecoration: "none", display: "block" }}>
              <div style={{ fontSize: "18px", color: "var(--accent)", marginBottom: "6px" }}>{l.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "2px" }}>{l.label}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{l.desc}</div>
            </Link>
          ))}
        </div>

        {/* Form */}
        <ProfileForm userId={user.id} initial={profile} />

        <LogoutButton />
      </main>
    </div>
  );
}
