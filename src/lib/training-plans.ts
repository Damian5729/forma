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
  location: "Gym" | "Zuhause";
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
    location: "Gym",
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
    location: "Gym",
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
    location: "Gym",
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
    location: "Gym",
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
  {
    id: "stronglifts-5x5",
    name: "Stronglifts 5×5",
    description: "Das bewährteste Kraftprogramm für Anfänger und Intermediates. 3× pro Woche, 5 Grundübungen, progressive Überlastung jede Einheit.",
    level: "Mittel",
    daysPerWeek: 3,
    goal: "Kraft",
    location: "Gym",
    duration: "45–60 Min",
    days: [
      {
        name: "Tag A",
        focus: "Kniebeuge, Bankdrücken, Rudern",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 5, reps: "5", rest: "90 Sek", notes: "Jede Einheit +2,5 kg" },
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 5, reps: "5", rest: "90 Sek", notes: "Jede A-Einheit +2,5 kg" },
          { exerciseId: "rowing", name: "Langhantelrudern", sets: 5, reps: "5", rest: "90 Sek", notes: "Jede A-Einheit +2,5 kg" },
        ],
      },
      {
        name: "Tag B",
        focus: "Kniebeuge, Schulterdrücken, Kreuzheben",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 5, reps: "5", rest: "90 Sek" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 5, reps: "5", rest: "90 Sek", notes: "Jede B-Einheit +2,5 kg" },
          { exerciseId: "deadlift", name: "Kreuzheben", sets: 1, reps: "5", rest: "3 Min", notes: "1 Arbeitssatz — jede B-Einheit +5 kg" },
        ],
      },
      {
        name: "Tag A (Wiederholung)",
        focus: "Kniebeuge, Bankdrücken, Rudern",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 5, reps: "5", rest: "90 Sek" },
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 5, reps: "5", rest: "90 Sek" },
          { exerciseId: "rowing", name: "Langhantelrudern", sets: 5, reps: "5", rest: "90 Sek" },
        ],
      },
    ],
  },
  {
    id: "calisthenics-starter",
    name: "Calisthenics Einsteiger",
    description: "Körpergewichts-Training ohne Geräte — perfekt für zuhause oder outdoor. Aufbau von Grundkraft mit Liegestütz, Klimmzug und Dips.",
    level: "Anfänger",
    daysPerWeek: 3,
    goal: "Allgemein",
    location: "Gym",
    duration: "30–45 Min",
    days: [
      {
        name: "Push",
        focus: "Brust, Schultern, Trizeps",
        exercises: [
          { exerciseId: "push-up", name: "Liegestütz", sets: 4, reps: "10–15", rest: "60 Sek" },
          { exerciseId: "dips-chest", name: "Dips (Stuhl)", sets: 3, reps: "10", rest: "60 Sek" },
          { exerciseId: "push-up", name: "Pike Push-Up", sets: 3, reps: "10", rest: "60 Sek", notes: "Hüfte hoch, Schultern belasten" },
          { exerciseId: "push-up", name: "Diamond Push-Up", sets: 3, reps: "8", rest: "60 Sek", notes: "Hände eng zusammen" },
        ],
      },
      {
        name: "Pull",
        focus: "Rücken, Bizeps",
        exercises: [
          { exerciseId: "pull-up", name: "Klimmzug (Assistiert)", sets: 4, reps: "5–8", rest: "90 Sek", notes: "Band oder Partner-Hilfe" },
          { exerciseId: "rowing", name: "Rudern unter Tisch", sets: 3, reps: "12", rest: "60 Sek", notes: "Tischkante greifen, Brust hochziehen" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl (Widerstandsband)", sets: 3, reps: "15", rest: "45 Sek" },
        ],
      },
      {
        name: "Legs & Core",
        focus: "Beine, Gesäß, Rumpf",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge (KG)", sets: 4, reps: "15", rest: "60 Sek" },
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "glute-bridge", name: "Glute Bridge", sets: 3, reps: "15", rest: "45 Sek" },
          { exerciseId: "plank", name: "Planke", sets: 3, reps: "45 Sek", rest: "45 Sek" },
          { exerciseId: "crunch", name: "Crunch", sets: 3, reps: "20", rest: "30 Sek" },
        ],
      },
    ],
  },
  {
    id: "womens-shape",
    name: "Women's Shape & Tone",
    description: "Speziell für Frauen: Fokus auf Gesäß, Beine und Core — kombiniert Kraft mit Cardio-Elementen für optimale Body Composition.",
    level: "Anfänger",
    daysPerWeek: 4,
    goal: "Allgemein",
    location: "Gym",
    duration: "45–55 Min",
    days: [
      {
        name: "Lower A",
        focus: "Gesäß & Beine",
        exercises: [
          { exerciseId: "hip-thrust", name: "Hip Thrust", sets: 4, reps: "12", rest: "90 Sek", notes: "Hauptübung — Gesäß aktivieren" },
          { exerciseId: "romanian-deadlift", name: "Romanian Deadlift", sets: 3, reps: "12", rest: "90 Sek" },
          { exerciseId: "squat", name: "Kniebeuge (KG)", sets: 4, reps: "15", rest: "60 Sek" },
          { exerciseId: "leg-press", name: "Leg Press", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "glute-bridge", name: "Glute Bridge", sets: 3, reps: "20", rest: "45 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben (Beine)", sets: 3, reps: "15", rest: "45 Sek", notes: "Kabelzug oder Band, seitlich" },
        ],
      },
      {
        name: "Upper",
        focus: "Schultern & Arme",
        exercises: [
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "12", rest: "90 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "tricep-pushdown", name: "Trizeps Push-Down", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 3, reps: "12", rest: "90 Sek" },
        ],
      },
      {
        name: "Lower B",
        focus: "Beine & Core",
        exercises: [
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 4, reps: "12", rest: "60 Sek" },
          { exerciseId: "romanian-deadlift", name: "Romanian Deadlift", sets: 3, reps: "10", rest: "90 Sek" },
          { exerciseId: "leg-press", name: "Leg Curl", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "calf-raise", name: "Calf Raises", sets: 3, reps: "20", rest: "45 Sek" },
          { exerciseId: "plank", name: "Planke", sets: 3, reps: "45 Sek", rest: "45 Sek" },
          { exerciseId: "russian-twist", name: "Russian Twist", sets: 3, reps: "20 gesamt", rest: "30 Sek" },
        ],
      },
      {
        name: "Full Body Cardio",
        focus: "Ganzkörper + Ausdauer",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "rowing", name: "Rudern", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "cycling", name: "Ergometer", sets: 1, reps: "20 Min", rest: "–", notes: "Moderates Tempo" },
        ],
      },
    ],
  },
  {
    id: "gvt",
    name: "German Volume Training",
    description: "10 Sätze × 10 Wiederholungen — die härteste Methode für maximalen Muskelaufbau. Nur für Fortgeschrittene.",
    level: "Fortgeschritten",
    daysPerWeek: 4,
    goal: "Muskelaufbau",
    location: "Gym",
    duration: "75–90 Min",
    days: [
      {
        name: "Brust & Rücken",
        focus: "Antagonisten-Paar",
        exercises: [
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 10, reps: "10", rest: "90 Sek", notes: "60 % des 1RM — kein Gewicht erhöhen bis alle 10×10 klappen" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 10, reps: "10", rest: "90 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 3, reps: "15", rest: "60 Sek" },
        ],
      },
      {
        name: "Beine & Core",
        focus: "Unterkörper",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 10, reps: "10", rest: "90 Sek", notes: "60 % des 1RM" },
          { exerciseId: "romanian-deadlift", name: "Romanian Deadlift", sets: 10, reps: "10", rest: "90 Sek" },
          { exerciseId: "crunch", name: "Crunch", sets: 3, reps: "20", rest: "45 Sek" },
        ],
      },
      {
        name: "Schultern & Arme",
        focus: "Kleinere Muskelgruppen",
        exercises: [
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 10, reps: "10", rest: "90 Sek" },
          { exerciseId: "rowing", name: "Rudern", sets: 10, reps: "10", rest: "90 Sek" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl", sets: 3, reps: "10", rest: "60 Sek" },
          { exerciseId: "tricep-pushdown", name: "Trizeps Push-Down", sets: 3, reps: "10", rest: "60 Sek" },
        ],
      },
      {
        name: "Oberkörper Hypertrophie",
        focus: "Brust & Rücken (Variation)",
        exercises: [
          { exerciseId: "bench-press", name: "Schrägbankdrücken", sets: 10, reps: "10", rest: "90 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug (eng)", sets: 10, reps: "10", rest: "90 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 3, reps: "15", rest: "60 Sek" },
        ],
      },
    ],
  },
  {
    id: "ppl-6day-advanced",
    name: "Push Pull Legs (6 Tage)",
    description: "Volles Hypertrophie-Programm — 6 Tage, hohes Volumen pro Muskelgruppe für maximalen Aufbau.",
    level: "Fortgeschritten",
    daysPerWeek: 6,
    goal: "Muskelaufbau",
    location: "Gym",
    duration: "60–75 Min",
    days: [
      {
        name: "Tag 1 — Push",
        focus: "Brust, Schultern, Trizeps",
        exercises: [
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 4, reps: "6–8", rest: "120 Sek" },
          { exerciseId: "incline-dumbbell-press", name: "Schrägbankdrücken (KH)", sets: 4, reps: "8–10", rest: "90 Sek" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "8–10", rest: "90 Sek" },
          { exerciseId: "cable-fly", name: "Kabel-Fly", sets: 3, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 4, reps: "12–15", rest: "45 Sek" },
          { exerciseId: "tricep-pushdown", name: "Trizeps Push-Down", sets: 3, reps: "12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 2 — Pull",
        focus: "Rücken & Bizeps",
        exercises: [
          { exerciseId: "deadlift", name: "Kreuzheben", sets: 4, reps: "5–6", rest: "150 Sek" },
          { exerciseId: "pull-up", name: "Klimmzüge", sets: 4, reps: "8–10", rest: "90 Sek" },
          { exerciseId: "seated-cable-row", name: "Rudern am Kabel", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "face-pull", name: "Face Pull", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl", sets: 3, reps: "10–12", rest: "60 Sek" },
          { exerciseId: "hammer-curl", name: "Hammer-Curl", sets: 3, reps: "12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 3 — Legs",
        focus: "Beine & Waden",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 4, reps: "6–8", rest: "150 Sek" },
          { exerciseId: "romanian-deadlift", name: "Rumänisches Kreuzheben", sets: 3, reps: "8–10", rest: "120 Sek" },
          { exerciseId: "leg-press", name: "Beinpresse", sets: 3, reps: "12", rest: "90 Sek" },
          { exerciseId: "leg-curl", name: "Beinbeuger", sets: 3, reps: "12–15", rest: "60 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 4, reps: "15–20", rest: "45 Sek" },
        ],
      },
      {
        name: "Tag 4 — Push",
        focus: "Brust, Schultern, Trizeps",
        exercises: [
          { exerciseId: "incline-bench-press", name: "Schrägbankdrücken (LH)", sets: 4, reps: "6–8", rest: "120 Sek" },
          { exerciseId: "machine-chest-press", name: "Brustpresse (Maschine)", sets: 3, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "arnold-press", name: "Arnold Press", sets: 3, reps: "10", rest: "90 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 4, reps: "15", rest: "45 Sek" },
          { exerciseId: "skull-crusher", name: "Skull Crusher", sets: 3, reps: "10–12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 5 — Pull",
        focus: "Rücken & Bizeps",
        exercises: [
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 4, reps: "10", rest: "90 Sek" },
          { exerciseId: "t-bar-row", name: "T-Bar Rudern", sets: 4, reps: "8–10", rest: "90 Sek" },
          { exerciseId: "single-arm-db-row", name: "Einarmiges KH-Rudern", sets: 3, reps: "10–12", rest: "75 Sek" },
          { exerciseId: "rear-delt-fly", name: "Reverse Fly", sets: 3, reps: "15", rest: "45 Sek" },
          { exerciseId: "preacher-curl", name: "Scott-Curl", sets: 3, reps: "10–12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 6 — Legs",
        focus: "Beine & Gesäß",
        exercises: [
          { exerciseId: "front-squat", name: "Frontkniebeuge", sets: 4, reps: "8", rest: "120 Sek" },
          { exerciseId: "hip-thrust", name: "Hip Thrust", sets: 4, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "bulgarian-split-squat", name: "Bulgarian Split Squat", sets: 3, reps: "10 pro Bein", rest: "75 Sek" },
          { exerciseId: "leg-extension", name: "Beinstrecker", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 4, reps: "20", rest: "45 Sek" },
        ],
      },
    ],
  },
  {
    id: "fullbody-3day-strength",
    name: "Ganzkörper Kraft (3 Tage)",
    description: "Effizientes Ganzkörper-Krafttraining mit Grundübungen — ideal bei wenig Zeit, 3× pro Woche.",
    level: "Mittel",
    daysPerWeek: 3,
    goal: "Kraft",
    location: "Gym",
    duration: "50–60 Min",
    days: [
      {
        name: "Tag A",
        focus: "Kniebeuge-Fokus",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 4, reps: "5", rest: "150 Sek" },
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 4, reps: "5", rest: "120 Sek" },
          { exerciseId: "rowing", name: "Langhantelrudern", sets: 3, reps: "8", rest: "90 Sek" },
          { exerciseId: "plank", name: "Planke", sets: 3, reps: "45 Sek", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag B",
        focus: "Kreuzheben-Fokus",
        exercises: [
          { exerciseId: "deadlift", name: "Kreuzheben", sets: 4, reps: "5", rest: "180 Sek" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 4, reps: "6", rest: "120 Sek" },
          { exerciseId: "pull-up", name: "Klimmzüge", sets: 3, reps: "8", rest: "90 Sek" },
          { exerciseId: "leg-raise", name: "Beinheben", sets: 3, reps: "12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag C",
        focus: "Bankdrücken-Fokus",
        exercises: [
          { exerciseId: "incline-bench-press", name: "Schrägbankdrücken", sets: 4, reps: "6", rest: "120 Sek" },
          { exerciseId: "front-squat", name: "Frontkniebeuge", sets: 4, reps: "6", rest: "150 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 3, reps: "10", rest: "90 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 3, reps: "15", rest: "45 Sek" },
        ],
      },
    ],
  },
  {
    id: "arnold-split",
    name: "Arnold Split (6 Tage)",
    description: "Klassischer Bodybuilding-Split nach Arnold — Brust/Rücken, Schultern/Arme, Beine, je 2×.",
    level: "Fortgeschritten",
    daysPerWeek: 6,
    goal: "Muskelaufbau",
    location: "Gym",
    duration: "70–90 Min",
    days: [
      {
        name: "Tag 1 — Brust & Rücken",
        focus: "Brust & Rücken",
        exercises: [
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 4, reps: "8–10", rest: "90 Sek" },
          { exerciseId: "incline-dumbbell-press", name: "Schräg-KH-Drücken", sets: 4, reps: "10", rest: "90 Sek" },
          { exerciseId: "pull-up", name: "Klimmzüge", sets: 4, reps: "8–10", rest: "90 Sek" },
          { exerciseId: "t-bar-row", name: "T-Bar Rudern", sets: 4, reps: "10", rest: "90 Sek" },
          { exerciseId: "dumbbell-fly", name: "KH-Fliegende", sets: 3, reps: "12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 2 — Schultern & Arme",
        focus: "Schultern & Arme",
        exercises: [
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 4, reps: "8–10", rest: "90 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 4, reps: "15", rest: "45 Sek" },
          { exerciseId: "ez-bar-curl", name: "SZ-Curl", sets: 4, reps: "10", rest: "60 Sek" },
          { exerciseId: "close-grip-bench", name: "Enges Bankdrücken", sets: 4, reps: "10", rest: "75 Sek" },
          { exerciseId: "hammer-curl", name: "Hammer-Curl", sets: 3, reps: "12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 3 — Beine",
        focus: "Beine komplett",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 5, reps: "8–10", rest: "120 Sek" },
          { exerciseId: "leg-press", name: "Beinpresse", sets: 4, reps: "12", rest: "90 Sek" },
          { exerciseId: "leg-curl", name: "Beinbeuger", sets: 4, reps: "12", rest: "60 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 5, reps: "20", rest: "45 Sek" },
        ],
      },
      {
        name: "Tag 4 — Brust & Rücken",
        focus: "Brust & Rücken (Variation)",
        exercises: [
          { exerciseId: "incline-bench-press", name: "Schrägbankdrücken", sets: 4, reps: "8", rest: "90 Sek" },
          { exerciseId: "machine-chest-press", name: "Brustpresse", sets: 3, reps: "12", rest: "75 Sek" },
          { exerciseId: "seated-cable-row", name: "Kabelrudern", sets: 4, reps: "10", rest: "90 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 4, reps: "12", rest: "75 Sek" },
        ],
      },
      {
        name: "Tag 5 — Schultern & Arme",
        focus: "Schultern & Arme (Variation)",
        exercises: [
          { exerciseId: "arnold-press", name: "Arnold Press", sets: 4, reps: "10", rest: "90 Sek" },
          { exerciseId: "upright-row", name: "Aufrechtes Rudern", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "preacher-curl", name: "Scott-Curl", sets: 4, reps: "10", rest: "60 Sek" },
          { exerciseId: "overhead-tricep-extension", name: "Trizeps über Kopf", sets: 4, reps: "12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 6 — Beine",
        focus: "Beine & Gesäß",
        exercises: [
          { exerciseId: "front-squat", name: "Frontkniebeuge", sets: 4, reps: "10", rest: "120 Sek" },
          { exerciseId: "romanian-deadlift", name: "Rumänisches Kreuzheben", sets: 4, reps: "10", rest: "90 Sek" },
          { exerciseId: "leg-extension", name: "Beinstrecker", sets: 4, reps: "15", rest: "60 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 5, reps: "20", rest: "45 Sek" },
        ],
      },
    ],
  },
  {
    id: "fatloss-circuit",
    name: "Fettabbau Zirkel",
    description: "Ganzkörper-Zirkeltraining mit kurzen Pausen — verbrennt maximal Kalorien, 4× pro Woche.",
    level: "Mittel",
    goal: "Fettabbau",
    location: "Gym",
    duration: "40–50 Min",
    daysPerWeek: 4,
    days: [
      {
        name: "Tag A — Ganzkörper",
        focus: "Kraft-Ausdauer Zirkel",
        exercises: [
          { exerciseId: "goblet-squat", name: "Goblet Squat", sets: 4, reps: "15", rest: "30 Sek" },
          { exerciseId: "push-up", name: "Liegestütz", sets: 4, reps: "15", rest: "30 Sek" },
          { exerciseId: "seated-cable-row", name: "Kabelrudern", sets: 4, reps: "15", rest: "30 Sek" },
          { exerciseId: "mountain-climber", name: "Mountain Climber", sets: 4, reps: "40", rest: "30 Sek" },
          { exerciseId: "rowing-machine", name: "Rudergerät", sets: 1, reps: "10 Min", rest: "–" },
        ],
      },
      {
        name: "Tag B — Unterkörper + HIIT",
        focus: "Beine & Kardio",
        exercises: [
          { exerciseId: "leg-press", name: "Beinpresse", sets: 4, reps: "20", rest: "30 Sek" },
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 4, reps: "12 pro Bein", rest: "30 Sek" },
          { exerciseId: "hip-thrust", name: "Hip Thrust", sets: 3, reps: "15", rest: "30 Sek" },
          { exerciseId: "hiit", name: "HIIT Intervalle", sets: 1, reps: "12 Min", rest: "–" },
        ],
      },
      {
        name: "Tag C — Oberkörper + Kardio",
        focus: "Oberkörper & Kardio",
        exercises: [
          { exerciseId: "machine-chest-press", name: "Brustpresse", sets: 4, reps: "15", rest: "30 Sek" },
          { exerciseId: "lat-pulldown", name: "Latzug", sets: 4, reps: "15", rest: "30 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 3, reps: "20", rest: "30 Sek" },
          { exerciseId: "burpee", name: "Burpees", sets: 4, reps: "12", rest: "30 Sek" },
          { exerciseId: "stair-climber", name: "Stairmaster", sets: 1, reps: "10 Min", rest: "–" },
        ],
      },
      {
        name: "Tag D — Core + Kardio",
        focus: "Bauch & Ausdauer",
        exercises: [
          { exerciseId: "cable-crunch", name: "Kabel-Crunch", sets: 4, reps: "20", rest: "30 Sek" },
          { exerciseId: "russian-twist", name: "Russian Twist", sets: 4, reps: "30", rest: "30 Sek" },
          { exerciseId: "plank", name: "Planke", sets: 4, reps: "45 Sek", rest: "30 Sek" },
          { exerciseId: "cycling", name: "Fahrrad-Ergometer", sets: 1, reps: "20 Min", rest: "–" },
        ],
      },
    ],
  },
  {
    id: "glute-builder",
    name: "Glute & Bein Aufbau",
    description: "Gezieltes Training für Gesäß und Beine — perfekt für Form und Kraft, 3× pro Woche.",
    level: "Mittel",
    goal: "Muskelaufbau",
    location: "Gym",
    duration: "50–60 Min",
    daysPerWeek: 3,
    days: [
      {
        name: "Tag 1 — Gesäß-Fokus",
        focus: "Gesäß & hintere Kette",
        exercises: [
          { exerciseId: "hip-thrust", name: "Hip Thrust", sets: 4, reps: "10–12", rest: "90 Sek" },
          { exerciseId: "romanian-deadlift", name: "Rumänisches Kreuzheben", sets: 4, reps: "10", rest: "90 Sek" },
          { exerciseId: "bulgarian-split-squat", name: "Bulgarian Split Squat", sets: 3, reps: "12 pro Bein", rest: "75 Sek" },
          { exerciseId: "cable-kickback", name: "Kickbacks am Kabel", sets: 3, reps: "15", rest: "45 Sek" },
          { exerciseId: "abductor-machine", name: "Abduktoren-Maschine", sets: 4, reps: "20", rest: "45 Sek" },
        ],
      },
      {
        name: "Tag 2 — Quadrizeps-Fokus",
        focus: "Vordere Oberschenkel",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 4, reps: "8–10", rest: "120 Sek" },
          { exerciseId: "leg-press", name: "Beinpresse", sets: 4, reps: "12", rest: "90 Sek" },
          { exerciseId: "leg-extension", name: "Beinstrecker", sets: 4, reps: "15", rest: "60 Sek" },
          { exerciseId: "step-up", name: "Step-Ups", sets: 3, reps: "12 pro Bein", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 3 — Gesäß & Waden",
        focus: "Gesäß & Waden",
        exercises: [
          { exerciseId: "sumo-deadlift", name: "Sumo-Kreuzheben", sets: 4, reps: "8", rest: "120 Sek" },
          { exerciseId: "glute-bridge", name: "Glute Bridge", sets: 4, reps: "15", rest: "60 Sek" },
          { exerciseId: "sumo-squat", name: "Sumo-Kniebeuge", sets: 3, reps: "15", rest: "75 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 5, reps: "20", rest: "45 Sek" },
        ],
      },
    ],
  },
  {
    id: "upper-lower-4day",
    name: "Upper/Lower (4 Tage)",
    description: "Bewährter 4-Tage-Split — 2× Oberkörper, 2× Unterkörper, gute Balance aus Kraft und Volumen.",
    level: "Mittel",
    goal: "Muskelaufbau",
    location: "Gym",
    duration: "55–65 Min",
    daysPerWeek: 4,
    days: [
      {
        name: "Tag 1 — Oberkörper Kraft",
        focus: "Oberkörper (schwer)",
        exercises: [
          { exerciseId: "bench-press", name: "Bankdrücken", sets: 4, reps: "5–6", rest: "120 Sek" },
          { exerciseId: "rowing", name: "Langhantelrudern", sets: 4, reps: "6–8", rest: "120 Sek" },
          { exerciseId: "overhead-press", name: "Schulterdrücken", sets: 3, reps: "8", rest: "90 Sek" },
          { exerciseId: "pull-up", name: "Klimmzüge", sets: 3, reps: "8", rest: "90 Sek" },
        ],
      },
      {
        name: "Tag 2 — Unterkörper Kraft",
        focus: "Beine (schwer)",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge", sets: 4, reps: "5–6", rest: "150 Sek" },
          { exerciseId: "romanian-deadlift", name: "Rumänisches Kreuzheben", sets: 3, reps: "8", rest: "120 Sek" },
          { exerciseId: "leg-press", name: "Beinpresse", sets: 3, reps: "12", rest: "90 Sek" },
          { exerciseId: "calf-raise", name: "Wadenheben", sets: 4, reps: "15", rest: "45 Sek" },
        ],
      },
      {
        name: "Tag 3 — Oberkörper Volumen",
        focus: "Oberkörper (Pump)",
        exercises: [
          { exerciseId: "incline-dumbbell-press", name: "Schräg-KH-Drücken", sets: 4, reps: "10–12", rest: "75 Sek" },
          { exerciseId: "seated-cable-row", name: "Kabelrudern", sets: 4, reps: "12", rest: "75 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben", sets: 4, reps: "15", rest: "45 Sek" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "tricep-pushdown", name: "Trizeps Push-Down", sets: 3, reps: "12", rest: "60 Sek" },
        ],
      },
      {
        name: "Tag 4 — Unterkörper Volumen",
        focus: "Beine (Pump)",
        exercises: [
          { exerciseId: "front-squat", name: "Frontkniebeuge", sets: 4, reps: "10", rest: "90 Sek" },
          { exerciseId: "hip-thrust", name: "Hip Thrust", sets: 4, reps: "12", rest: "75 Sek" },
          { exerciseId: "leg-curl", name: "Beinbeuger", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "leg-extension", name: "Beinstrecker", sets: 3, reps: "15", rest: "60 Sek" },
        ],
      },
    ],
  },
];
