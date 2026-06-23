import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("shopping_list_items")
    .select("*")
    .eq("user_id", user.id)
    .order("checked", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const items = (body.items ?? []) as { name: string; amount?: string }[];
  const recipeTitle = body.recipeTitle ?? null;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Keine Zutaten" }, { status: 400 });
  }

  const rows = items
    .filter((it) => it.name?.trim())
    .map((it) => ({
      user_id: user.id,
      name: it.name.trim(),
      amount: it.amount?.trim() ?? "",
      recipe_title: recipeTitle,
      checked: false,
    }));

  const { data, error } = await supabase.from("shopping_list_items").insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE without id -> clear checked items
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("shopping_list_items")
    .delete()
    .eq("user_id", user.id)
    .eq("checked", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cleared: true });
}
