// Direct Unsplash photo IDs, matched most-specific first
const MAP: { match: string[]; id: string }[] = [
  // ── Geflügel ─────────────────────────────────────────────────────────────
  { match: ["hähnchen-gyros", "gyros", "kebab"],         id: "1544025162-d76538680892" },
  { match: ["hähnchen-wrap", "hähnchen-taco", "chicken wrap", "caesar wrap"], id: "1565299507177-b0ac66763828" },
  { match: ["chicken caesar", "caesar salat"],            id: "1512621776951-a57141f2eefd" },
  { match: ["hähnchenbrust", "putenbrustfilet", "putenbrust", "hähnchenschenkel", "hähnchen-stir"], id: "1532550884905-4a50f682b6" },
  { match: ["süßkartoffel-hähnchen", "hähnchen-curry"], id: "1546069901-ba9599a7e63c" },
  { match: ["hühnereintopf", "putengulasch"],            id: "1414235077428-338989a2e8c0" },
  // ── Fisch & Meeresfrüchte ────────────────────────────────────────────────
  { match: ["lachs"],                                     id: "1467003909585-2f8a72700288" },
  { match: ["forelle"],                                   id: "1519708227418-c8fd9a32b7a2" },
  { match: ["thunfisch"],                                 id: "1484723091739-30e71fd3ae90" },
  { match: ["makrele", "sardine"],                        id: "1476224203421-9ac39bcb3327" },
  { match: ["garnelen", "shrimp"],                        id: "1565557623262-b51c2513a641" },
  // ── Eier ─────────────────────────────────────────────────────────────────
  { match: ["shakshuka"],                                 id: "1603046891744-1f2b7b759ef5" },
  { match: ["omelette", "frittata", "rührei", "spiegelei", "ei"], id: "1525351484163-7529414344d8" },
  // ── Frühstück ─────────────────────────────────────────────────────────────
  { match: ["eiweißpfannkuchen", "pfannkuchen", "crepe"], id: "1528207776546-365bb710ee93" },
  { match: ["overnight oats", "protein-porridge", "porridge", "haferbrei"], id: "1495147466023-ac5c588e2e94" },
  { match: ["smoothie bowl", "açaí", "bowl"],             id: "1490645935967-10de6ba17061" },
  { match: ["avocado-toast", "avocado"],                  id: "1603046891744-1f2b7b759ef5" },
  { match: ["joghurt", "skyr", "magerquark", "hüttenkäse", "quark"], id: "1488477181946-6428a0291777" },
  // ── Fleisch ───────────────────────────────────────────────────────────────
  { match: ["rinderfilet", "rindersteak", "steak"],       id: "1414235077428-338989a2e8c0" },
  { match: ["rinderhackfleisch", "hackfleisch", "bolognese", "chili con carne"], id: "1558030006-450675393462" },
  { match: ["seitan-gulasch", "seitan"],                  id: "1540189799578-5ad0d0ba0f14" },
  // ── Veggie & Vegan ────────────────────────────────────────────────────────
  { match: ["gebratener tofu", "tofu"],                   id: "1512058564366-18510be2db19" },
  { match: ["tempeh"],                                    id: "1512058564366-18510be2db19" },
  { match: ["edamame"],                                   id: "1473093226795-af9932fe5856" },
  { match: ["schwarze bohnen taco", "vegane taco"],       id: "1565299585323-38d6b0865b47" },
  { match: ["kichererbsen-curry", "kichererbsen"],        id: "1455619452474-d2be8b1e70cd" },
  { match: ["rote linsen-dal", "linsen-suppe", "linsen-curry", "linsen"], id: "1547592166-23ac45744acd" },
  { match: ["quinoa-salat", "quinoa bowl", "quinoa"],     id: "1543339552-4b9a2c73a90a" },
  // ── Gemüse & Salat ───────────────────────────────────────────────────────
  { match: ["brokkoli-cremesuppe"],                       id: "1482049016688-2d3e1b311543" },
  { match: ["tomaten-suppe", "kürbissuppe", "gemüsesuppe"], id: "1547592166-23ac45744acd" },
  { match: ["gemüseeintopf", "eintopf"],                  id: "1540189799578-5ad0d0ba0f14" },
  { match: ["bunter salat", "gemischter salat", "salat"], id: "1473093226795-af9932fe5856" },
  { match: ["brokkoli", "blumenkohl", "spinat"],          id: "1482049016688-2d3e1b311543" },
  { match: ["süßkartoffel"],                              id: "1546069901-ba9599a7e63c" },
  // ── Kohlenhydrate ────────────────────────────────────────────────────────
  { match: ["pasta", "vollkorn-pasta", "spaghetti", "penne"], id: "1621996346565-e3dbc353d2e5" },
  { match: ["kartoffel"],                                 id: "1567620905-9924b7dce5a2" },
  { match: ["reis", "reissalat"],                         id: "1543339552-4b9a2c73a90a" },
  { match: ["brot", "toast", "vollkornbrot"],             id: "1484723091739-30e71fd3ae90" },
  // ── Sonstiges ─────────────────────────────────────────────────────────────
  { match: ["mediterran"],                                id: "1504674900247-0877df9cc836" },
  { match: ["curry"],                                     id: "1455619452474-d2be8b1e70cd" },
];

// 14 diverse food fallbacks — varied visually
const FALLBACKS = [
  "1546069901-ba9599a7e63c", // bowl orange
  "1504674900247-0877df9cc836", // food spread
  "1512621776951-a57141f2eefd", // green salad
  "1490645935967-10de6ba17061", // smoothie bowl
  "1495147466023-ac5c588e2e94", // oats
  "1414235077428-338989a2e8c0", // grilled
  "1473093226795-af9932fe5856", // fresh greens
  "1543339552-4b9a2c73a90a",   // rice bowl
  "1532550884905-4a50f682b6",  // protein plate
  "1558030006-450675393462",   // meat dish
  "1482049016688-2d3e1b311543",// vibrant veggies
  "1540189799578-5ad0d0ba0f14",// plated food
  "1565557623262-b51c2513a641",// shrimp
  "1621996346565-e3dbc353d2e5",// pasta
];

function hashTitle(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

export function getRecipeImage(title: string): string {
  const lower = title.toLowerCase();
  for (const entry of MAP) {
    if (entry.match.some((m) => lower.includes(m))) {
      return `https://images.unsplash.com/photo-${entry.id}?w=600&h=350&fit=crop&q=80&auto=format`;
    }
  }
  const id = FALLBACKS[hashTitle(title) % FALLBACKS.length];
  return `https://images.unsplash.com/photo-${id}?w=600&h=350&fit=crop&q=80&auto=format`;
}
