import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { UpgradeClient } from "./UpgradeClient";

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name, subscription_status")
    .eq("id", user.id)
    .single();

  const userName = profile?.name ?? user.email ?? "User";
  const isPro = profile?.subscription_status === "pro";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav active="" userName={userName} />
      <UpgradeClient isPro={isPro} />
    </div>
  );
}
