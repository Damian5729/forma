import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("custom_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, level, days_per_week, goal, duration, location, days } = body;

  if (!name?.trim()) return NextResponse.json({ error: "Name fehlt" }, { status: 400 });
  if (!Array.isArray(days) || days.length === 0) return NextResponse.json({ error: "Mindestens 1 Trainingstag" }, { status: 400 });

  const { data, error } = await supabase
    .from("custom_plans")
    .insert({
      user_id: user.id,
      name: name.trim(),
      description: description?.trim() ?? "",
      level: level ?? "Anfänger",
      days_per_week: days_per_week ?? days.length,
      goal: goal ?? "Allgemein",
      duration: duration?.trim() ?? "45–60 Min",
      location: location ?? "Gym",
      days,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
