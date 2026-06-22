import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import { BodyCompClient } from "./BodyCompClient";
import { ProPaywall } from "@/components/ProPaywall";

export default async function BodyCompPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name, gender, height, weight, neck_cm, waist_cm, hip_cm, body_fat_pct, subscription_status")
    .eq("id", user.id)
    .single();

  if (!profile?.weight || !profile?.height) redirect("/profile");

  const isPro = profile?.subscription_status?.toLowerCase() === "pro";
  const userName = profile?.name ?? user.user_metadata?.name ?? user.email ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="/profile" userName={userName} />

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/profile" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Profil</Link>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "var(--text-primary)", marginTop: "12px" }}>
            Körperzusammensetzung
          </h1>
        </div>

        {!isPro ? (
          <ProPaywall
            icon="📊"
            title="Körperzusammensetzung & BMI"
            description="Körperfettanteil, BMI-Analyse und detaillierte Körpermessungen sind exklusiv für forma Pro."
          />
        ) : (
          <>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "-12px", marginBottom: "24px" }}>
              {profile.weight} kg · {profile.height} cm · BMI {Math.round((profile.weight / ((profile.height / 100) ** 2)) * 10) / 10}
            </p>
            <BodyCompClient
              userId={user.id}
              gender={profile.gender ?? "m"}
              height={profile.height}
              weight={profile.weight}
              saved={{
                neck_cm: profile.neck_cm ?? null,
                waist_cm: profile.waist_cm ?? null,
                hip_cm: profile.hip_cm ?? null,
                body_fat_pct: profile.body_fat_pct ?? null,
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
