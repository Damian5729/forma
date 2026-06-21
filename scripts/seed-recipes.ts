import { createClient } from "@supabase/supabase-js";
import { RECIPES } from "../src/lib/recipes-data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function seed() {
  console.log(`Seeding ${RECIPES.length} recipes...`);

  const { error } = await supabase.from("recipes").upsert(
    RECIPES.map((r) => ({
      title: r.title,
      description: r.description,
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fat: r.fat,
      duration: r.duration,
      servings: r.servings,
      tags: r.tags,
      ingredients: r.ingredients,
      steps: r.steps,
    }))
  );

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  console.log("Done! Recipes inserted.");
}

seed();
