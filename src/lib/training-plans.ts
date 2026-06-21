export interface PlanExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface PlanDay {
  name: string;
  focus: string;
  exercises: PlanExercise[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  level: "Anfänger" | "Mittel" | "Fortgeschritten";
  daysPerWeek: number;
  goal: "Muskelaufbau" | "Fettabbau" | "Kraft" | "Allgemein";
  duration: string;
  days: PlanDay[];
}

export const TRAINING_PLANS: TrainingPlan[] = [
  {
    id: "fullbody-beginner",
    name: "Ganzkörper Einsteiger",
    description: "Perfekt für den Start — 3× pro Woche, alle Muskelgruppen, keine Erfahrung nötig.",
    level: "Anfänger",
    daysPerWeek: 3,
    goal: "Allgemein",
    duration: "45–60 Min",
    days: [
      {
        name: "Tag A",
        focus: "Ganzkörper",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 3, reps: "8–10", rest: "90 Sek", notes: "Körpergewicht oder leichte Hantel" },
          { exerciseId: "push-up", name: "Liegestütz", sets: 3, reps: "8–12", rest: "60 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "plank", name: "Planke", sets: 3, reps: "30 Sek", rest: "60 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 3, reps: "12–15", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag B",
        focus: "Ganzkörper",
        exercises: [
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 3, reps: "10 pro Bein", rest: "90 Sek" },
          { exerciseId: "rowing", name: "Rudern (Kabelzug)", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl", sets: 3, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "crunch", name: "Crunch", sets: 3, reps: "15–20", rest: "45 Sek" },
        ],
      },
      {
        name: "Tag C",
        focus: "Ganzkörper + Kardio",
        exercises: [
          { exerciseId: "glute-bridge", name: "Glute Bridge", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "push-up", name: "Liegestütz", sets: 3, reps: "10–15", rest: "60 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "russian-twist", name: "Russian Twist", sets: 3, reps: "20 gesamt", rest: "45 Sek" },
          { exerciseId: "cycling", name: "Ergometer/Fahrrad", sets: 1, reps: "15 Min", rest: "–" },
        ],
      },
    ],
  },
  {
    id: "ppl-intermediate",
    name: "Push Pull Legs",
    description: "Der Klassiker für Fortgeschrittene — 6 Tage, klare Muskelgruppen-Trennung.",
    level: "Mittel",
    daysPerWeek: 6,
    goal: "Muskelaufbau",
    duration: "60–75 Min",
    days: [
      {
        name: "Push (Brust, Schultern, Trizeps)",
        focus: "Drückende Muskeln",
        exercises: [
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 4, reps: "6–10", rest: "2–3 Min", notes: "Hauptübung — maximales Gewicht" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "8–12", rest: "90 Sek" },
          { exerciseId: "cable-fly", name: "Kabelfliegende", sets: 3, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 3, reps: "15–20", rest: "45 Sek" },
          { exerciseId: "tricep-pushdown", name: "Trizeps-Pushdown", sets: 3, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "dips-chest", name: "Dips", sets: 3, reps: "Bis Versagen", rest: "90 Sek" },
        ],
      },
      {
        name: "Pull (Rücken, Bizeps)",
        focus: "Ziehende Muskeln",
        exercises: [
          { exerciseId: "deadlift", name: "Kreuzheben", sets: 4, reps: "4–6", rest: "3 Min", notes: "Hauptübung — schwer" },
          { exerciseId: "pull-up", name: "Klimmzug", sets: 3, reps: "6–10", rest: "2 Min" },
          { exerciseId: "rowing", name: "Rudern mit Langhantel", sets: 3, reps: "8–12", rest: "90 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug (weit)", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl", sets: 3, reps: "10–12", rest: "60 Sek" },
          { exerciseId: "face-pull", name: "Face Pulls", sets: 3, reps: "15–20", rest: "45 Sek" },
        ],
      },
      {
        name: "Legs (Beine, Gesäß)",
        focus: "Unterkörper",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 4, reps: "6–10", rest: "2–3 Min", notes: "Hauptübung" },
          { exerciseId: "romanian-deadlift", name: "Rumänisches Kreuzheben", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "leg-press", name: "Beinpresse", sets: 3, reps: "10–15", rest: "90 Sek" },
          { exerciseId: "hip-thrust", name: "Hip Thrust", sets: 3, reps: "12–15", rest: "90 Sek" },
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 3, reps: "10 pro Bein", rest: "90 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 4, reps: "15–20", rest: "60 Sek" },
        ],
      },
      {
        name: "Push (Wiederholung)",
        focus: "Drückende Muskeln",
        exercises: [
          { exerciseId: "bench-press", name: "Bankdrücken (Schrägbank)", sets: 4, reps: "8–12", rest: "2 Min" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "cable-fly", name: "Kabelfliegende (hoch)", sets: 3, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 4, reps: "15–20", rest: "45 Sek" },
          { exerciseId: "tricep-pushdown", name: "Trizeps-Pushdown (Seil)", sets: 3, reps: "12–15", rest: "60 Sek" },
        ],
      },
      {
        name: "Pull (Wiederholung)",
        focus: "Ziehende Muskeln",
        exercises: [
          { exerciseId: "pull-up", name: "Klimmzug", sets: 4, reps: "Max", rest: "2 Min" },
          { exerciseId: "rowing", name: "Rudern mit Langhantel", sets: 3, reps: "8–10", rest: "90 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug (eng)", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "bicep-curl", name: "Konzentrations-Curl", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "face-pull", name: "Face Pulls", sets: 3, reps: "20", rest: "45 Sek" },
        ],
      },
      {
        name: "Legs (Wiederholung)",
        focus: "Unterkörper",
        exercises: [
          { exerciseId: "squat", name: "Front Squat / Goblet Squat", sets: 4, reps: "8–12", rest: "2 Min" },
          { exerciseId: "romanian-deadlift", name: "Rumänisches Kreuzheben", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "leg-press", name: "Beinpresse (enger Stand)", sets: 3, reps: "12–15", rest: "90 Sek" },
          { exerciseId: "hip-thrust", name: "Hip Thrust (einbeinig)", sets: 3, reps: "12 pro Seite", rest: "90 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben (Maschine)", sets: 4, reps: "15–20", rest: "60 Sek" },
        ],
      },
    ],
  },
  {
    id: "upper-lower",
    name: "Upper / Lower Split",
    description: "4 Tage — Oberkörper und Unterkörper abwechselnd. Ideal für Aufbau und Kraft.",
    level: "Mittel",
    daysPerWeek: 4,
    goal: "Muskelaufbau",
    duration: "60 Min",
    days: [
      {
        name: "Oberkörper A (Kraft)",
        focus: "Brust, Rücken, Schultern",
        exercises: [
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 4, reps: "4–6", rest: "3 Min" },
          { exerciseId: "rowing", name: "Rudern mit Langhantel", sets: 4, reps: "4–6", rest: "3 Min" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "6–8", rest: "2 Min" },
          { exerciseId: "pull-up", name: "Klimmzug", sets: 3, reps: "Max", rest: "2 Min" },
          { exerciseId: "tricep-pushdown", name: "Trizeps-Pushdown", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl", sets: 3, reps: "10–12", rest: "90 Sek" },
        ],
      },
      {
        name: "Unterkörper A (Kraft)",
        focus: "Quadrizeps, Gesäß",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 4, reps: "4–6", rest: "3 Min" },
          { exerciseId: "romanian-deadlift", name: "Rumänisches Kreuzheben", sets: 3, reps: "6–8", rest: "2 Min" },
          { exerciseId: "leg-press", name: "Beinpresse", sets: 3, reps: "8–10", rest: "2 Min" },
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 3, reps: "8 pro Bein", rest: "90 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 4, reps: "12–15", rest: "60 Sek" },
        ],
      },
      {
        name: "Oberkörper B (Hypertrophie)",
        focus: "Brust, Rücken, Schultern",
        exercises: [
          { exerciseId: "cable-fly", name: "Kabelfliegende", sets: 4, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 4, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 4, reps: "15–20", rest: "45 Sek" },
          { exerciseId: "face-pull", name: "Face Pulls", sets: 3, reps: "15–20", rest: "45 Sek" },
          { exerciseId: "dips-chest", name: "Dips", sets: 3, reps: "12–15", rest: "90 Sek" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl (Kabel)", sets: 3, reps: "15–20", rest: "45 Sek" },
        ],
      },
      {
        name: "Unterkörper B (Hypertrophie)",
        focus: "Hamstrings, Gesäß",
        exercises: [
          { exerciseId: "deadlift", name: "Kreuzheben", sets: 4, reps: "6–8", rest: "2–3 Min" },
          { exerciseId: "hip-thrust", name: "Hip Thrust", sets: 4, reps: "12–15", rest: "90 Sek" },
          { exerciseId: "romanian-deadlift", name: "Rumänisches Kreuzheben", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "lunge", name: "Ausfallschritt (Walking)", sets: 3, reps: "12 pro Bein", rest: "90 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 4, reps: "15–20", rest: "60 Sek" },
        ],
      },
    ],
  },
  {
    id: "fatburn-hiit",
    name: "Fettabbau & Kondition",
    description: "4 Tage — Kombination aus Krafttraining und HIIT für maximale Fettverbrennung.",
    level: "Mittel",
    daysPerWeek: 4,
    goal: "Fettabbau",
    duration: "45 Min",
    days: [
      {
        name: "Oberkörper + HIIT",
        focus: "Brust, Rücken + Kardio",
        exercises: [
          { exerciseId: "push-up", name: "Liegestütz", sets: 4, reps: "12–15", rest: "45 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 3, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "tricep-pushdown", name: "Trizeps-Pushdown", sets: 3, reps: "15", rest: "45 Sek" },
          { exerciseId: "hiit", name: "HIIT (Burpees)", sets: 4, reps: "20 Sek an / 10 Sek Pause", rest: "1 Min nach Runde" },
        ],
      },
      {
        name: "Unterkörper + Ausdauer",
        focus: "Beine, Gesäß + Kardio",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 4, reps: "15–20", rest: "60 Sek" },
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 3, reps: "12 pro Bein", rest: "60 Sek" },
          { exerciseId: "hip-thrust", name: "Glute Bridge", sets: 3, reps: "20", rest: "45 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 3, reps: "20", rest: "45 Sek" },
          { exerciseId: "cycling", name: "Ergometer", sets: 1, reps: "15 Min (Intervall)", rest: "–" },
        ],
      },
      {
        name: "Ganzkörper Zirkel",
        focus: "Alle Muskelgruppen",
        exercises: [
          { exerciseId: "push-up", name: "Liegestütz", sets: 3, reps: "15", rest: "30 Sek" },
          { exerciseId: "squat", name: "Kniebeuge (KG)", sets: 3, reps: "20", rest: "30 Sek" },
          { exerciseId: "rowing", name: "Rudern", sets: 3, reps: "12", rest: "30 Sek" },
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 3, reps: "10 pro Bein", rest: "30 Sek" },
          { exerciseId: "plank", name: "Planke", sets: 3, reps: "45 Sek", rest: "30 Sek" },
          { exerciseId: "hiit", name: "Jumping Jacks / Seilspringen", sets: 3, reps: "60 Sek", rest: "30 Sek" },
        ],
      },
      {
        name: "Aktive Erholung + Stretching",
        focus: "Mobilität, Regeneration",
        exercises: [
          { exerciseId: "cycling", name: "Leichtes Fahrrad", sets: 1, reps: "20 Min (niedrig)", rest: "–" },
          { exerciseId: "plank", name: "Planke (alle Varianten)", sets: 3, reps: "30 Sek", rest: "30 Sek" },
          { exerciseId: "glute-bridge", name: "Glute Bridge (langsam)", sets: 3, reps: "15", rest: "45 Sek" },
        ],
      },
    ],
  },
];
