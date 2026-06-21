export interface Food {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const FOODS: Food[] = [
  // OBST
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
  { name: "Ananas", category: "Obst", calories: 50, protein: 0.5, carbs: 13, fat: 0.1 },
  { name: "Birne", category: "Obst", calories: 57, protein: 0.4, carbs: 15, fat: 0.1 },
  { name: "Pfirsich", category: "Obst", calories: 39, protein: 0.9, carbs: 10, fat: 0.3 },
  { name: "Nektarine", category: "Obst", calories: 44, protein: 1.1, carbs: 10.6, fat: 0.3 },
  { name: "Pflaume", category: "Obst", calories: 46, protein: 0.7, carbs: 11, fat: 0.3 },
  { name: "Kirsche", category: "Obst", calories: 63, protein: 1.1, carbs: 16, fat: 0.2 },
  { name: "Grapefruit", category: "Obst", calories: 42, protein: 0.8, carbs: 11, fat: 0.1 },
  { name: "Clementine", category: "Obst", calories: 47, protein: 0.9, carbs: 12, fat: 0.2 },
  { name: "Papaya", category: "Obst", calories: 43, protein: 0.5, carbs: 11, fat: 0.3 },
  { name: "Melone (Cantaloupe)", category: "Obst", calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2 },
  { name: "Feige", category: "Obst", calories: 74, protein: 0.8, carbs: 19, fat: 0.3 },
  { name: "Dattel", category: "Obst", calories: 282, protein: 2.5, carbs: 75, fat: 0.4 },
  { name: "Granatapfel", category: "Obst", calories: 83, protein: 1.7, carbs: 19, fat: 1.2 },
  { name: "Lychee", category: "Obst", calories: 66, protein: 0.8, carbs: 17, fat: 0.4 },

  // GEMÜSE
  { name: "Tomate", category: "Gemüse", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { name: "Gurke", category: "Gemüse", calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1 },
  { name: "Paprika rot", category: "Gemüse", calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  { name: "Paprika gelb", category: "Gemüse", calories: 27, protein: 1, carbs: 6.3, fat: 0.2 },
  { name: "Paprika grün", category: "Gemüse", calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2 },
  { name: "Brokkoli", category: "Gemüse", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: "Spinat", category: "Gemüse", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: "Karotte", category: "Gemüse", calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { name: "Zucchini", category: "Gemüse", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
  { name: "Zwiebel", category: "Gemüse", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
  { name: "Knoblauch", category: "Gemüse", calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
  { name: "Süßkartoffel", category: "Gemüse", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: "Kartoffel", category: "Gemüse", calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  { name: "Mais", category: "Gemüse", calories: 86, protein: 3.2, carbs: 19, fat: 1.2 },
  { name: "Erbsen", category: "Gemüse", calories: 81, protein: 5.4, carbs: 14, fat: 0.4 },
  { name: "Blumenkohl", category: "Gemüse", calories: 25, protein: 1.9, carbs: 5, fat: 0.3 },
  { name: "Rosenkohl", category: "Gemüse", calories: 43, protein: 3.4, carbs: 8.9, fat: 0.3 },
  { name: "Weißkohl", category: "Gemüse", calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1 },
  { name: "Rotkohl", category: "Gemüse", calories: 31, protein: 1.4, carbs: 7.4, fat: 0.2 },
  { name: "Wirsing", category: "Gemüse", calories: 28, protein: 2, carbs: 6.1, fat: 0.3 },
  { name: "Kopfsalat", category: "Gemüse", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  { name: "Rucola", category: "Gemüse", calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7 },
  { name: "Feldsalat", category: "Gemüse", calories: 23, protein: 2, carbs: 3.6, fat: 0.4 },
  { name: "Eisbergsalat", category: "Gemüse", calories: 14, protein: 0.9, carbs: 3, fat: 0.1 },
  { name: "Spargel", category: "Gemüse", calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 },
  { name: "Artischocke", category: "Gemüse", calories: 47, protein: 3.3, carbs: 10.5, fat: 0.2 },
  { name: "Aubergine", category: "Gemüse", calories: 25, protein: 1, carbs: 5.9, fat: 0.2 },
  { name: "Kürbis", category: "Gemüse", calories: 26, protein: 1, carbs: 6.5, fat: 0.1 },
  { name: "Kohlrabi", category: "Gemüse", calories: 27, protein: 1.7, carbs: 6.2, fat: 0.1 },
  { name: "Sellerie (Stange)", category: "Gemüse", calories: 16, protein: 0.7, carbs: 3, fat: 0.2 },
  { name: "Lauch", category: "Gemüse", calories: 61, protein: 1.5, carbs: 14, fat: 0.3 },
  { name: "Rote Bete", category: "Gemüse", calories: 43, protein: 1.6, carbs: 9.6, fat: 0.2 },
  { name: "Rettich", category: "Gemüse", calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1 },
  { name: "Champignons", category: "Gemüse", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
  { name: "Shiitake Pilze", category: "Gemüse", calories: 34, protein: 2.2, carbs: 6.8, fat: 0.5 },
  { name: "Portobello Pilze", category: "Gemüse", calories: 22, protein: 2.1, carbs: 3.9, fat: 0.3 },
  { name: "Pak Choi", category: "Gemüse", calories: 13, protein: 1.5, carbs: 2.2, fat: 0.2 },
  { name: "Ingwer", category: "Gemüse", calories: 80, protein: 1.8, carbs: 18, fat: 0.8 },

  // FLEISCH
  { name: "Hähnchenbrust", category: "Fleisch", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Hähnchenkeule", category: "Fleisch", calories: 184, protein: 27, carbs: 0, fat: 8 },
  { name: "Hähnchenflügel", category: "Fleisch", calories: 203, protein: 30, carbs: 0, fat: 8.1 },
  { name: "Putenbrust", category: "Fleisch", calories: 135, protein: 30, carbs: 0, fat: 1 },
  { name: "Putenkeule", category: "Fleisch", calories: 174, protein: 28, carbs: 0, fat: 6.3 },
  { name: "Rinderfilet", category: "Fleisch", calories: 158, protein: 26, carbs: 0, fat: 5.4 },
  { name: "Rinderhackfleisch (5% Fett)", category: "Fleisch", calories: 152, protein: 21, carbs: 0, fat: 7.5 },
  { name: "Rinderhackfleisch (20% Fett)", category: "Fleisch", calories: 254, protein: 17, carbs: 0, fat: 20 },
  { name: "Rindersteak (Entrecôte)", category: "Fleisch", calories: 271, protein: 26, carbs: 0, fat: 18 },
  { name: "Schweinelende", category: "Fleisch", calories: 143, protein: 26, carbs: 0, fat: 3.5 },
  { name: "Schweinehackfleisch", category: "Fleisch", calories: 263, protein: 16, carbs: 0, fat: 22 },
  { name: "Schweinebauch", category: "Fleisch", calories: 518, protein: 10, carbs: 0, fat: 53 },
  { name: "Lammkeule", category: "Fleisch", calories: 258, protein: 25, carbs: 0, fat: 17 },
  { name: "Lammhackfleisch", category: "Fleisch", calories: 282, protein: 19, carbs: 0, fat: 23 },
  { name: "Wildschwein", category: "Fleisch", calories: 122, protein: 22, carbs: 0, fat: 3.3 },
  { name: "Hirsch", category: "Fleisch", calories: 120, protein: 22, carbs: 0, fat: 2.4 },

  // WURST & AUFSCHNITT
  { name: "Hähnchenbrust (Aufschnitt)", category: "Wurst", calories: 100, protein: 18, carbs: 1.5, fat: 2.5 },
  { name: "Putenbrust (Aufschnitt)", category: "Wurst", calories: 89, protein: 19, carbs: 0.8, fat: 1.2 },
  { name: "Salami", category: "Wurst", calories: 425, protein: 22, carbs: 2, fat: 36 },
  { name: "Schinken (gekocht)", category: "Wurst", calories: 107, protein: 17, carbs: 1.5, fat: 3.5 },
  { name: "Rohschinken", category: "Wurst", calories: 145, protein: 21, carbs: 0, fat: 6.2 },

  // FISCH & MEERESFRÜCHTE
  { name: "Lachs", category: "Fisch", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Lachs (geräuchert)", category: "Fisch", calories: 117, protein: 18, carbs: 0, fat: 4.3 },
  { name: "Thunfisch (Dose, Wasser)", category: "Fisch", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { name: "Thunfisch (Dose, Öl)", category: "Fisch", calories: 198, protein: 24, carbs: 0, fat: 11 },
  { name: "Kabeljau", category: "Fisch", calories: 82, protein: 18, carbs: 0, fat: 0.7 },
  { name: "Tilapia", category: "Fisch", calories: 96, protein: 20, carbs: 0, fat: 1.7 },
  { name: "Forelle", category: "Fisch", calories: 141, protein: 20, carbs: 0, fat: 6.2 },
  { name: "Hering", category: "Fisch", calories: 203, protein: 18, carbs: 0, fat: 14 },
  { name: "Makrele", category: "Fisch", calories: 205, protein: 19, carbs: 0, fat: 13 },
  { name: "Dorsch", category: "Fisch", calories: 76, protein: 17, carbs: 0, fat: 0.7 },
  { name: "Seelachs", category: "Fisch", calories: 80, protein: 18, carbs: 0, fat: 0.9 },
  { name: "Garnelen", category: "Fisch", calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { name: "Muscheln", category: "Fisch", calories: 86, protein: 12, carbs: 3.7, fat: 2.2 },
  { name: "Tintenfisch", category: "Fisch", calories: 92, protein: 16, carbs: 3.1, fat: 1.4 },
  { name: "Sardinenfilet (Dose)", category: "Fisch", calories: 208, protein: 25, carbs: 0, fat: 11 },

  // EIER & MILCH
  { name: "Ei (ganzes)", category: "Eier & Milch", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: "Eiweiß", category: "Eier & Milch", calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
  { name: "Eigelb", category: "Eier & Milch", calories: 322, protein: 16, carbs: 3.6, fat: 27 },
  { name: "Vollmilch (3,5%)", category: "Eier & Milch", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: "Halbfettmilch (1,5%)", category: "Eier & Milch", calories: 46, protein: 3.4, carbs: 4.7, fat: 1.5 },
  { name: "Magermilch (0,1%)", category: "Eier & Milch", calories: 34, protein: 3.5, carbs: 4.9, fat: 0.1 },
  { name: "Griechischer Joghurt (0%)", category: "Eier & Milch", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: "Griechischer Joghurt (2%)", category: "Eier & Milch", calories: 73, protein: 9, carbs: 3.9, fat: 2 },
  { name: "Naturjoghurt (3,5%)", category: "Eier & Milch", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.5 },
  { name: "Magerquark", category: "Eier & Milch", calories: 67, protein: 12, carbs: 4, fat: 0.2 },
  { name: "Hüttenkäse", category: "Eier & Milch", calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { name: "Ricotta", category: "Eier & Milch", calories: 174, protein: 11, carbs: 3, fat: 13 },
  { name: "Mozzarella", category: "Eier & Milch", calories: 280, protein: 22, carbs: 2.2, fat: 17 },
  { name: "Mozzarella (light)", category: "Eier & Milch", calories: 149, protein: 22, carbs: 2.1, fat: 5 },
  { name: "Feta", category: "Eier & Milch", calories: 264, protein: 14, carbs: 4.1, fat: 21 },
  { name: "Gouda", category: "Eier & Milch", calories: 356, protein: 25, carbs: 2.2, fat: 27 },
  { name: "Emmentaler", category: "Eier & Milch", calories: 380, protein: 29, carbs: 1.5, fat: 29 },
  { name: "Parmesan", category: "Eier & Milch", calories: 431, protein: 38, carbs: 3.2, fat: 29 },
  { name: "Frischkäse", category: "Eier & Milch", calories: 138, protein: 5.8, carbs: 2.4, fat: 12 },
  { name: "Frischkäse (light)", category: "Eier & Milch", calories: 80, protein: 7, carbs: 2.9, fat: 4.7 },
  { name: "Skyr", category: "Eier & Milch", calories: 63, protein: 11, carbs: 4, fat: 0.2 },
  { name: "Kefir", category: "Eier & Milch", calories: 52, protein: 3.3, carbs: 4.8, fat: 1.5 },
  { name: "Buttermilch", category: "Eier & Milch", calories: 40, protein: 3.3, carbs: 4.8, fat: 0.5 },

  // FETTE & ÖLE
  { name: "Butter", category: "Fette & Öle", calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
  { name: "Olivenöl", category: "Fette & Öle", calories: 884, protein: 0, carbs: 0, fat: 100 },
  { name: "Kokosöl", category: "Fette & Öle", calories: 862, protein: 0, carbs: 0, fat: 100 },
  { name: "Rapsöl", category: "Fette & Öle", calories: 884, protein: 0, carbs: 0, fat: 100 },
  { name: "Sonnenblumenöl", category: "Fette & Öle", calories: 884, protein: 0, carbs: 0, fat: 100 },
  { name: "Margarine", category: "Fette & Öle", calories: 719, protein: 0.2, carbs: 0.4, fat: 80 },

  // KOHLENHYDRATE / GETREIDE
  { name: "Weißer Reis (gekocht)", category: "Kohlenhydrate", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Brauner Reis (gekocht)", category: "Kohlenhydrate", calories: 112, protein: 2.6, carbs: 24, fat: 0.9 },
  { name: "Basmati Reis (gekocht)", category: "Kohlenhydrate", calories: 121, protein: 2.7, carbs: 26, fat: 0.4 },
  { name: "Jasmin Reis (gekocht)", category: "Kohlenhydrate", calories: 130, protein: 2.7, carbs: 29, fat: 0.3 },
  { name: "Quinoa (gekocht)", category: "Kohlenhydrate", calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
  { name: "Haferflocken", category: "Kohlenhydrate", calories: 389, protein: 17, carbs: 66, fat: 7 },
  { name: "Haferflocken (fein)", category: "Kohlenhydrate", calories: 375, protein: 13, carbs: 67, fat: 7 },
  { name: "Pasta (Weizen, gekocht)", category: "Kohlenhydrate", calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  { name: "Vollkornnudeln (gekocht)", category: "Kohlenhydrate", calories: 149, protein: 5.3, carbs: 29, fat: 1 },
  { name: "Spaghetti (gekocht)", category: "Kohlenhydrate", calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  { name: "Vollkornbrot", category: "Kohlenhydrate", calories: 247, protein: 9, carbs: 47, fat: 3.4 },
  { name: "Weizenbrot", category: "Kohlenhydrate", calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  { name: "Toastbrot", category: "Kohlenhydrate", calories: 264, protein: 8.5, carbs: 49, fat: 3.3 },
  { name: "Roggenknäckebrot", category: "Kohlenhydrate", calories: 335, protein: 8.6, carbs: 70, fat: 2.1 },
  { name: "Kartoffel (gekocht)", category: "Kohlenhydrate", calories: 86, protein: 1.9, carbs: 20, fat: 0.1 },
  { name: "Süßkartoffel (gebacken)", category: "Kohlenhydrate", calories: 90, protein: 2, carbs: 21, fat: 0.1 },
  { name: "Buchweizen (gekocht)", category: "Kohlenhydrate", calories: 92, protein: 3.4, carbs: 20, fat: 0.6 },
  { name: "Hirse (gekocht)", category: "Kohlenhydrate", calories: 119, protein: 3.5, carbs: 24, fat: 1 },
  { name: "Graupen (gekocht)", category: "Kohlenhydrate", calories: 123, protein: 2.3, carbs: 28, fat: 0.4 },
  { name: "Polenta (gekocht)", category: "Kohlenhydrate", calories: 70, protein: 1.6, carbs: 15, fat: 0.3 },
  { name: "Couscous (gekocht)", category: "Kohlenhydrate", calories: 112, protein: 3.8, carbs: 23, fat: 0.2 },
  { name: "Bulgur (gekocht)", category: "Kohlenhydrate", calories: 83, protein: 3.1, carbs: 19, fat: 0.2 },

  // HÜLSENFRÜCHTE
  { name: "Linsen (rot, gekocht)", category: "Hülsenfrüchte", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: "Linsen (grün, gekocht)", category: "Hülsenfrüchte", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: "Kichererbsen (gekocht)", category: "Hülsenfrüchte", calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  { name: "Schwarze Bohnen (gekocht)", category: "Hülsenfrüchte", calories: 132, protein: 8.9, carbs: 24, fat: 0.5 },
  { name: "Kidneybohnen (gekocht)", category: "Hülsenfrüchte", calories: 127, protein: 8.7, carbs: 23, fat: 0.5 },
  { name: "Weiße Bohnen (gekocht)", category: "Hülsenfrüchte", calories: 139, protein: 9.7, carbs: 25, fat: 0.5 },
  { name: "Edamame", category: "Hülsenfrüchte", calories: 121, protein: 11, carbs: 8.9, fat: 5.2 },
  { name: "Tofu (fest)", category: "Hülsenfrüchte", calories: 144, protein: 17, carbs: 3, fat: 9 },
  { name: "Tempeh", category: "Hülsenfrüchte", calories: 193, protein: 19, carbs: 9, fat: 11 },
  { name: "Seitan", category: "Hülsenfrüchte", calories: 370, protein: 75, carbs: 14, fat: 1.9 },

  // NÜSSE & SAMEN
  { name: "Mandeln", category: "Nüsse & Samen", calories: 579, protein: 21, carbs: 22, fat: 50 },
  { name: "Walnüsse", category: "Nüsse & Samen", calories: 654, protein: 15, carbs: 14, fat: 65 },
  { name: "Cashews", category: "Nüsse & Samen", calories: 553, protein: 18, carbs: 30, fat: 44 },
  { name: "Pistazien", category: "Nüsse & Samen", calories: 560, protein: 20, carbs: 28, fat: 45 },
  { name: "Haselnüsse", category: "Nüsse & Samen", calories: 628, protein: 15, carbs: 17, fat: 61 },
  { name: "Macadamia", category: "Nüsse & Samen", calories: 718, protein: 7.9, carbs: 14, fat: 76 },
  { name: "Erdnüsse", category: "Nüsse & Samen", calories: 567, protein: 26, carbs: 16, fat: 49 },
  { name: "Erdnussbutter", category: "Nüsse & Samen", calories: 588, protein: 25, carbs: 20, fat: 50 },
  { name: "Mandelmus", category: "Nüsse & Samen", calories: 614, protein: 21, carbs: 22, fat: 56 },
  { name: "Chiasamen", category: "Nüsse & Samen", calories: 486, protein: 17, carbs: 42, fat: 31 },
  { name: "Leinsamen", category: "Nüsse & Samen", calories: 534, protein: 18, carbs: 29, fat: 42 },
  { name: "Hanfsamen", category: "Nüsse & Samen", calories: 553, protein: 32, carbs: 8.7, fat: 49 },
  { name: "Sonnenblumenkerne", category: "Nüsse & Samen", calories: 584, protein: 21, carbs: 20, fat: 51 },
  { name: "Kürbiskerne", category: "Nüsse & Samen", calories: 559, protein: 30, carbs: 11, fat: 49 },
  { name: "Sesam", category: "Nüsse & Samen", calories: 573, protein: 18, carbs: 23, fat: 50 },
  { name: "Tahini (Sesammus)", category: "Nüsse & Samen", calories: 595, protein: 17, carbs: 21, fat: 54 },
  { name: "Kokosnuss (geraspelt)", category: "Nüsse & Samen", calories: 660, protein: 6.9, carbs: 24, fat: 65 },

  // SUPPLEMENTS & PROTEIN
  { name: "Whey Protein", category: "Supplements", calories: 400, protein: 80, carbs: 8, fat: 5 },
  { name: "Casein Protein", category: "Supplements", calories: 370, protein: 78, carbs: 5, fat: 3 },
  { name: "Veganes Protein", category: "Supplements", calories: 380, protein: 72, carbs: 10, fat: 6 },
  { name: "Proteinriegel (Ø)", category: "Supplements", calories: 200, protein: 20, carbs: 22, fat: 5 },

  // GETRÄNKE
  { name: "Orangensaft (frisch)", category: "Getränke", calories: 45, protein: 0.7, carbs: 10, fat: 0.2 },
  { name: "Apfelsaft", category: "Getränke", calories: 47, protein: 0.1, carbs: 12, fat: 0.1 },
  { name: "Vollmilch", category: "Getränke", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: "Hafermilch", category: "Getränke", calories: 48, protein: 1, carbs: 8.4, fat: 1.5 },
  { name: "Mandelmilch (ungesüßt)", category: "Getränke", calories: 17, protein: 0.6, carbs: 1.5, fat: 1.1 },
  { name: "Sojamilch", category: "Getränke", calories: 42, protein: 3.6, carbs: 2.4, fat: 1.8 },
  { name: "Kokosmilch (Dose)", category: "Getränke", calories: 230, protein: 2.3, carbs: 5.5, fat: 24 },
  { name: "Kaffee (schwarz)", category: "Getränke", calories: 2, protein: 0.3, carbs: 0, fat: 0 },
  { name: "Grüner Tee", category: "Getränke", calories: 1, protein: 0, carbs: 0.2, fat: 0 },

  // FERTIGPRODUKTE & SONSTIGES
  { name: "Hummus", category: "Sonstiges", calories: 166, protein: 7.9, carbs: 14, fat: 10 },
  { name: "Guacamole", category: "Sonstiges", calories: 150, protein: 2, carbs: 8.5, fat: 13 },
  { name: "Tomatenmark", category: "Sonstiges", calories: 82, protein: 4.3, carbs: 16, fat: 0.5 },
  { name: "Tomatensauce (passiert)", category: "Sonstiges", calories: 29, protein: 1.7, carbs: 5.7, fat: 0.4 },
  { name: "Senf", category: "Sonstiges", calories: 66, protein: 4.4, carbs: 5.3, fat: 3.3 },
  { name: "Mayonnaise", category: "Sonstiges", calories: 680, protein: 0.9, carbs: 2.1, fat: 75 },
  { name: "Ketchup", category: "Sonstiges", calories: 112, protein: 1.6, carbs: 26, fat: 0.4 },
  { name: "Sojasoße", category: "Sonstiges", calories: 53, protein: 8.1, carbs: 4.9, fat: 0.1 },
  { name: "Honig", category: "Sonstiges", calories: 304, protein: 0.3, carbs: 82, fat: 0 },
  { name: "Ahornsirup", category: "Sonstiges", calories: 260, protein: 0, carbs: 67, fat: 0.1 },
  { name: "Hafer-Granola", category: "Sonstiges", calories: 471, protein: 10, carbs: 64, fat: 20 },
];

export function searchFoods(query: string): Food[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const terms = q.split(" ").filter((t) => t.length > 1);

  return FOODS
    .map((f) => {
      const name = f.name.toLowerCase();
      const cat = f.category.toLowerCase();

      if (name === q) return { food: f, score: 100 };
      if (name.startsWith(q)) return { food: f, score: 85 };
      if (name.includes(q)) return { food: f, score: 70 };
      if (terms.every((t) => name.includes(t) || cat.includes(t))) return { food: f, score: 55 };
      if (terms.some((t) => name.includes(t) && t.length > 3)) return { food: f, score: 35 };
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .map((x) => x!.food)
    .slice(0, 6);
}
