import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "damian.gunter1@gmail.com";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const supabase = adminClient();
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, name, subscription_status");

  const result = users.map((u) => {
    const profile = profiles?.find((p) => p.id === u.id);
    return {
      id: u.id,
      email: u.email ?? "–",
      name: profile?.name ?? u.user_metadata?.full_name ?? "–",
      subscription_status: profile?.subscription_status ?? "free",
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const supabase = adminClient();

  // verify caller is admin
  const { data: { user } } = await supabase.auth.getUser(
    req.headers.get("x-user-token") ?? ""
  );
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, status } = await req.json();
  if (!["free", "pro"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({ subscription_status: status })
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
