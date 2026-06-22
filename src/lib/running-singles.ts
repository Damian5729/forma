export interface SingleRun {
  id: string;
  name: string;
  type: "Intervall" | "Tempo" | "Easy" | "Fartlek" | "Kraft";
  duration: number;
  distance: string;
  description: string;
  structure: string;
  effort: "Leicht" | "Mittel" | "Hart";
  icon: string;
}

export const SINGLE_RUNS: SingleRun[] = [
  {
    id: "400m-classic",
    name: "400m Klassiker",
    type: "Intervall",
    duration: 30,
    distance: "4–6 km",
    description: "Der ultimative Intervall-Klassiker. Maximale Intensität, kurze Erholung.",
    structure: "10 Min einlaufen → 6× (400m schnell + 2 Min Pause) → 10 Min auslaufen",
    effort: "Hart",
    icon: "⚡",
  },
  {
    id: "800m-repeat",
    name: "800m Wiederholungen",
    type: "Intervall",
    duration: 40,
    distance: "6–8 km",
    description: "Klassisches Mittelstrecken-Training für Geschwindigkeit und Ausdauer.",
    structure: "10 Min einlaufen → 4× (800m hart + 3 Min Pause) → 10 Min auslaufen",
    effort: "Hart",
    icon: "🔥",
  },
  {
    id: "1km-intervals",
    name: "1km Intervalle",
    type: "Intervall",
    duration: 45,
    distance: "8–10 km",
    description: "Länger, aber immer noch schnell — perfekt für 5km/10km Wettkampfvorbereitung.",
    structure: "10 Min einlaufen → 5× (1 km Wettkampftempo + 3 Min Pause) → 10 Min auslaufen",
    effort: "Hart",
    icon: "💨",
  },
  {
    id: "5km-easy",
    name: "5km Easy Run",
    type: "Easy",
    duration: 30,
    distance: "5 km",
    description: "Lockeres Dauertempo, Nase-Mund-Atmung, Unterhaltung möglich.",
    structure: "Gleichmäßiges Tempo über 5 km — Zone 2, kein Stress",
    effort: "Leicht",
    icon: "🌿",
  },
  {
    id: "10km-easy",
    name: "10km Dauerlauf",
    type: "Easy",
    duration: 60,
    distance: "10 km",
    description: "Langer aerober Grundlagenaufbau. Fettverbrennung pur.",
    structure: "Gleichmäßig über 10 km — wohles Tempo, letzte 2 km leicht steigern",
    effort: "Mittel",
    icon: "🏃",
  },
  {
    id: "tempo-20",
    name: "20min Tempolauf",
    type: "Tempo",
    duration: 35,
    distance: "5–6 km",
    description: "Kontinuierlicher Tempolauf an der Laktatschwelle — sehr effektiv.",
    structure: "7 Min einlaufen → 20 Min Wettkampftempo → 8 Min auslaufen",
    effort: "Hart",
    icon: "⏱",
  },
  {
    id: "fartlek-30",
    name: "30min Fartlek",
    type: "Fartlek",
    duration: 30,
    distance: "5–7 km",
    description: "Freies Spiel mit dem Tempo — nach Gefühl beschleunigen und erholen.",
    structure: "Abwechselnd 1–3 Min schnell, 1–2 Min locker, total 30 Min",
    effort: "Mittel",
    icon: "🎲",
  },
  {
    id: "hill-sprints",
    name: "Bergsprints",
    type: "Kraft",
    duration: 35,
    distance: "3–4 km",
    description: "Bergaufläufe aufbauen Kraft, Explosivität und Laufökonomie.",
    structure: "10 Min einlaufen → 8× (30 Sek Bergsprint + zurückgehen) → 10 Min auslaufen",
    effort: "Hart",
    icon: "⛰",
  },
  {
    id: "pyramid",
    name: "Pyramiden-Lauf",
    type: "Intervall",
    duration: 45,
    distance: "6–8 km",
    description: "Steigende und fallende Intervalle — mental herausfordernd, sehr effektiv.",
    structure: "Einlaufen → 200m / 400m / 800m / 1km / 800m / 400m / 200m (je 2 Min Pause) → Auslaufen",
    effort: "Hart",
    icon: "🔺",
  },
  {
    id: "recovery-run",
    name: "Regenerationslauf",
    type: "Easy",
    duration: 25,
    distance: "3–4 km",
    description: "Sehr langsam — fördert Regeneration nach hartem Training.",
    structure: "25 Min sehr locker, Herzfrequenz unter 65% — langsamer als du denkst",
    effort: "Leicht",
    icon: "💆",
  },
];
