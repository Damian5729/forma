import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { CookMode } from "./CookMode";

export default async function CookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: recipe } = await supabase
    .from("recipes")
    .select("id, title, calories, protein, carbs, fat, duration, ingredients, steps")
    .eq("id", id)
    .single();

  if (!recipe) notFound();

  return (
    <CookMode
      id={recipe.id}
      title={recipe.title}
      calories={recipe.calories}
      protein={recipe.protein}
      duration={recipe.duration}
      ingredients={recipe.ingredients as { name: string; amount: string }[]}
      steps={recipe.steps as string[]}
      userId={user.id}
    />
  );
}
