export interface Food {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const FOODS: Food[] = [
  { name: "Apfel", category: "Obst", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: "Banane", category: "Obst", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Orange", category: "Obst", calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
  { name: "Erdbeeren", category: "Obst", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  { name: "Heidelbeeren", category: "Obst", calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  { name: "Himbeeren", category: "Obst", calories: 52, protein: 1.2, carbs: 12, fat: 0.7 },
  { name: "Mango", category: "Obst", calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
  { name: "Weintrauben", category: "Obst", calories: 69, protein: 0.7, carbs: 18, fat: 0.2 },
  { name: "Kiwi", category: "Obst", calories: 61, protein: 1.1, carbs: 15, fat: 0.5 },
  { name: "Wassermelone", category: "Obst", calories: 30, protein: 0.6, carbs: 8, fat: 0.2 },
  { name: "Avocado", category: "Obst", calories: 160, protein: 2, carbs: 9, fat: 15 },
  { name: "Tomate", category: "Gemüse", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { name: "Gurke", category: "Gemüse", calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1 },
  { name: "Paprika rot", category: "Gemüse", calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  { name: "Paprika gelb", category: "Gemüse", calories: 27, protein: 1, carbs: 6.3, fat: 0.2 },
  { name: "Brokkoli", category: "Gemüse", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: "Spinat", category: "Gemüse", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: "Karotte", category: "Gemüse", calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { name: "Zucchini", category: "Gemüse", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
  { name: "Zwiebel", category: "Gemüse", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
  { name: "Knoblauch", category: "Gemüse", calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
  { name: "Süßkartoffel", category: "Gemüse", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: "Kartoffel", category: "Gemüse", calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  { name: "Mais", category: "Gemüse", calories: 86, protein: 3.2, carbs: 19, fat: 1.2 },
  { name: "Erbsen", category: "Hülsenfrüchte", calories: 81, protein: 5.4, carbs: 14, fat: 0.4 },
  { name: "Hähnchenbrust", category: "Fleisch", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Hähnchenkeule", category: "Fleisch", calories: 184, protein: 27, carbs: 0, fat: 8 },
  { name: "Rinderhackfleisch (20% Fett)", category: "Fleisch", calories: 254, protein: 17, carbs: 0, fat: 20 },
  { name: "Rinderfilet", category: "Fleisch", calories: 158, protein: 26, carbs: 0, fat: 5.4 },
  { name: "Putenbrust", category: "Fleisch", calories: 135, protein: 30, carbs: 0, fat: 1 },
  { name: "Schweinelende", category: "Fleisch", calories: 143, protein: 26, carbs: 0, fat: 3.5 },
  { name: "Lachs", category: "Fisch", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Thunfisch (Dose, in Wasser)", category: "Fisch", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { name: "Kabeljau", category: "Fisch", calories: 82, protein: 18, carbs: 0, fat: 0.7 },
  { name: "Garnelen", category: "Fisch", calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { name: "Makrele", category: "Fisch", calories: 205, protein: 19, carbs: 0, fat: 13 },
  { name: "Eier", category: "Eier & Milch", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: "Eiweiß (1 Ei)", category: "Eier & Milch", calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1 },
  { name: "Vollmilch", category: "Eier & Milch", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: "Griechischer Joghurt (0%)", category: "Eier & Milch", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: "Griechischer Joghurt (2%)", category: "Eier & Milch", calories: 73, protein: 9, carbs: 3.9, fat: 2 },
  { name: "Magerquark", category: "Eier & Milch", calories: 67, protein: 12, carbs: 4, fat: 0.2 },
  { name: "Hüttenkäse", category: "Eier & Milch", calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { name: "Mozzarella", category: "Eier & Milch", calories: 280, protein: 22, carbs: 2.2, fat: 17 },
  { name: "Feta", category: "Eier & Milch", calories: 264, protein: 14, carbs: 4.1, fat: 21 },
  { name: "Butter", category: "Fette & Öle", calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
  { name: "Olivenöl", category: "Fette & Öle", calories: 884, protein: 0, carbs: 0, fat: 100 },
  { name: "Kokosöl", category: "Fette & Öle", calories: 862, protein: 0, carbs: 0, fat: 100 },
  { name: "Weißer Reis (gekocht)", category: "Kohlenhydrate", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Brauner Reis (gekocht)", category: "Kohlenhydrate", calories: 112, protein: 2.6, carbs: 24, fat: 0.9 },
  { name: "Quinoa (gekocht)", category: "Kohlenhydrate", calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
  { name: "Haferflocken", category: "Kohlenhydrate", calories: 389, protein: 17, carbs: 66, fat: 7 },
  { name: "Vollkornbrot", category: "Kohlenhydrate", calories: 247, protein: 9, carbs: 47, fat: 3.4 },
  { name: "Weizenbrot", category: "Kohlenhydrate", calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  { name: "Pasta (gekocht)", category: "Kohlenhydrate", calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  { name: "Vollkornnudeln (gekocht)", category: "Kohlenhydrate", calories: 149, protein: 5.3, carbs: 29, fat: 1 },
  { name: "Süßkartoffel (gebacken)", category: "Kohlenhydrate", calories: 90, protein: 2, carbs: 21, fat: 0.1 },
  { name: "Linsen (gekocht)", category: "Hülsenfrüchte", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: "Kichererbsen (gekocht)", category: "Hülsenfrüchte", calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  { name: "Schwarze Bohnen (gekocht)", category: "Hülsenfrüchte", calories: 132, protein: 8.9, carbs: 24, fat: 0.5 },
  { name: "Edamame", category: "Hülsenfrüchte", calories: 121, protein: 11, carbs: 8.9, fat: 5.2 },
  { name: "Mandeln", category: "Nüsse & Samen", calories: 579, protein: 21, carbs: 22, fat: 50 },
  { name: "Walnüsse", category: "Nüsse & Samen", calories: 654, protein: 15, carbs: 14, fat: 65 },
  { name: "Cashews", category: "Nüsse & Samen", calories: 553, protein: 18, carbs: 30, fat: 44 },
  { name: "Erdnussbutter", category: "Nüsse & Samen", calories: 588, protein: 25, carbs: 20, fat: 50 },
  { name: "Chiasamen", category: "Nüsse & Samen", calories: 486, protein: 17, carbs: 42, fat: 31 },
  { name: "Leinsamen", category: "Nüsse & Samen", calories: 534, protein: 18, carbs: 29, fat: 42 },
  { name: "Proteinpulver Whey", category: "Supplements", calories: 400, protein: 80, carbs: 8, fat: 5 },
  { name: "Proteinpulver Casein", category: "Supplements", calories: 370, protein: 78, carbs: 5, fat: 3 },
  { name: "Hummus", category: "Fertigprodukte", calories: 166, protein: 7.9, carbs: 14, fat: 10 },
  { name: "Tofu (fest)", category: "Vegetarisch", calories: 144, protein: 17, carbs: 3, fat: 9 },
  { name: "Tempeh", category: "Vegetarisch", calories: 193, protein: 19, carbs: 9, fat: 11 },
];

export function searchFoods(query: string): Food[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  return FOODS
    .map((f) => {
      const name = f.name.toLowerCase();
      if (name === q) return { food: f, score: 100 };
      if (name.startsWith(q)) return { food: f, score: 80 };
      if (name.includes(q)) return { food: f, score: 60 };
      if (q.split(" ").some((w) => name.includes(w) && w.length > 2)) return { food: f, score: 40 };
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .map((x) => x!.food)
    .slice(0, 5);
}
