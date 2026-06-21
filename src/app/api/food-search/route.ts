import { NextResponse } from "next/server";
import { searchFoods } from "@/lib/foods";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  // 1. Eigene kuratierte Datenbank zuerst
  const local = searchFoods(query).map((f) => ({
    name: f.name,
    brand: f.category,
    calories: f.calories,
    protein: f.protein,
    carbs: f.carbs,
    fat: f.fat,
    source: "local",
  }));

  // 2. Open Food Facts nur für Markenprodukte (parallel)
  let offProducts: typeof local = [];
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=12&fields=product_name,brands,nutriments&cc=de&lc=de`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Forma-App/1.0" },
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      offProducts = (data.products ?? [])
        .filter((p: Record<string, unknown>) => {
          const n = p.nutriments as Record<string, number>;
          return (
            p.product_name &&
            p.brands &&
            n &&
            (n["energy-kcal_100g"] ?? 0) > 0 &&
            (n["proteins_100g"] ?? 0) >= 0
          );
        })
        .map((p: Record<string, unknown>) => {
          const n = p.nutriments as Record<string, number>;
          return {
            name: p.product_name as string,
            brand: (p.brands as string).split(",")[0].trim(),
            calories: Math.round(n["energy-kcal_100g"] ?? 0),
            protein: Math.round((n["proteins_100g"] ?? 0) * 10) / 10,
            carbs: Math.round((n["carbohydrates_100g"] ?? 0) * 10) / 10,
            fat: Math.round((n["fat_100g"] ?? 0) * 10) / 10,
            source: "off",
          };
        })
        .slice(0, 5);
    }
  } catch {
    // OFF timeout — local results reichen
  }

  // Lokale zuerst, dann OFF-Produkte, max 8 gesamt
  const products = [...local, ...offProducts].slice(0, 8);

  return NextResponse.json({ products });
}
