import type { TrainingPlan } from "./training-plans";

export const HOME_TRAINING_PLANS: TrainingPlan[] = [
  {
    id: "home-beginner",
    name: "Zuhause Einsteiger",
    description: "Kein Equipment nötig — Bodyweight-Training für den Einstieg. 3× pro Woche, 30 Minuten, für alle Fitnesslevel.",
    level: "Anfänger",
    daysPerWeek: 3,
    goal: "Allgemein",
    duration: "25–35 Min",
    location: "Zuhause",
    days: [
      {
        name: "Tag A – Oberkörper",
        focus: "Brust, Schultern, Trizeps",
        exercises: [
          { exerciseId: "push-up", name: "Liegestütz", sets: 3, reps: "8–12", rest: "60 Sek", notes: "Knie auf Boden OK für Einsteiger" },
          { exerciseId: "push-up", name: "Pike Push-Up", sets: 3, reps: "8–10", rest: "60 Sek", notes: "Hüfte hoch, Schultern belasten" },
          { exerciseId: "dips-chest", name: "Dips (Stuhl)", sets: 3, reps: "8–10", rest: "60 Sek" },
          { exerciseId: "plank", name: "Planke", sets: 3, reps: "30 Sek", rest: "45 Sek" },
          { exerciseId: "crunch", name: "Crunch", sets: 3, reps: "15", rest: "30 Sek" },
        ],
      },
      {
        name: "Tag B – Unterkörper",
        focus: "Beine, Gesäß, Core",
        exercises: [
          { exerciseId: "squat", name: "Kniebeuge (Körpergewicht)", sets: 4, reps: "15", rest: "60 Sek" },
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 3, reps: "10 pro Bein", rest: "60 Sek" },
          { exerciseId: "glute-bridge", name: "Glute Bridge", sets: 3, reps: "15", rest: "45 Sek" },
          { exerciseId: "squat", name: "Sumo Squat", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "plank", name: "Side Plank", sets: 2, reps: "25 Sek pro Seite", rest: "30 Sek" },
        ],
      },
      {
        name: "Tag C – Ganzkörper",
        focus: "Alle Muskelgruppen + Ausdauer",
        exercises: [
          { exerciseId: "squat", name: "Jump Squat", sets: 3, reps: "12", rest: "60 Sek", notes: "Explosiv hochspringen" },
          { exerciseId: "push-up", name: "Liegestütz", sets: 3, reps: "10", rest: "45 Sek" },
          { exerciseId: "lunge", name: "Ausfallschritt", sets: 3, reps: "10 pro Bein", rest: "45 Sek" },
          { exerciseId: "crunch", name: "Bicycle Crunch", sets: 3, reps: "20 gesamt", rest: "30 Sek" },
          { exerciseId: "glute-bridge", name: "Glute Bridge (1 Bein)", sets: 2, reps: "12 pro Bein", rest: "45 Sek" },
          { exerciseId: "plank", name: "Mountain Climber", sets: 3, reps: "30 Sek", rest: "45 Sek" },
        ],
      },
    ],
  },
  {
    id: "home-hiit-fatburn",
    name: "Zuhause HIIT Fettverbrennung",
    description: "Hochintensives Intervall-Training ohne Equipment — maximale Fettverbrennung in 30 Minuten. Ideal für Abnehm-Ziel.",
    level: "Mittel",
    daysPerWeek: 4,
    goal: "Fettabbau",
    duration: "25–35 Min",
    location: "Zuhause",
    days: [
      {
        name: "HIIT A – Lower Body Burn",
        focus: "Beine + Ausdauer",
        exercises: [
          { exerciseId: "squat", name: "Squat Pulse (20 Sek)", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–", notes: "Tabata-Stil: 4 Runden" },
          { exerciseId: "lunge", name: "Jump Lunge", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "glute-bridge", name: "Glute Bridge Pulse", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "squat", name: "Wall Sit", sets: 3, reps: "30 Sek", rest: "30 Sek" },
          { exerciseId: "calf-raise", name: "Jump Rope (simuliert)", sets: 1, reps: "2 Min", rest: "–", notes: "Seilspringen oder Platz-Joggen" },
        ],
      },
      {
        name: "HIIT B – Upper + Core",
        focus: "Oberkörper + Bauch",
        exercises: [
          { exerciseId: "push-up", name: "Push-Up (schnell)", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "crunch", name: "Crunch", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "push-up", name: "Burpee (ohne Sprung)", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "plank", name: "Plank to Downdog", sets: 3, reps: "10", rest: "30 Sek" },
          { exerciseId: "russian-twist", name: "Russian Twist", sets: 3, reps: "20 gesamt", rest: "30 Sek" },
        ],
      },
      {
        name: "HIIT C – Ganzkörper Blast",
        focus: "Alle Muskelgruppen",
        exercises: [
          { exerciseId: "squat", name: "Jump Squat", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "push-up", name: "Liegestütz", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "lunge", name: "Reverse Lunge", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "plank", name: "Mountain Climber", sets: 4, reps: "20 Sek / 10 Sek Pause", rest: "–" },
          { exerciseId: "cycling", name: "Platz-Joggen", sets: 1, reps: "3 Min", rest: "–", notes: "Knie hoch, Tempo moderat" },
        ],
      },
      {
        name: "Active Recovery – Mobility",
        focus: "Beweglichkeit & Regeneration",
        exercises: [
          { exerciseId: "plank", name: "Cat-Cow Stretch", sets: 2, reps: "10", rest: "30 Sek" },
          { exerciseId: "lunge", name: "Hip Flexor Stretch", sets: 2, reps: "30 Sek pro Seite", rest: "–" },
          { exerciseId: "glute-bridge", name: "Piriformis Stretch", sets: 2, reps: "30 Sek pro Seite", rest: "–" },
          { exerciseId: "plank", name: "Child's Pose", sets: 2, reps: "45 Sek", rest: "–" },
          { exerciseId: "rowing", name: "Schulter-Rotation", sets: 2, reps: "10 pro Richtung", rest: "–" },
        ],
      },
    ],
  },
  {
    id: "home-muscle-dumbbell",
    name: "Zuhause Muskelaufbau (Kurzhanteln)",
    description: "Effektiver Muskelaufbau mit nur einem Kurzhantelpaar. 4 Tage, klassische Splits — auch mit Widerstandsbändern möglich.",
    level: "Mittel",
    daysPerWeek: 4,
    goal: "Muskelaufbau",
    duration: "40–50 Min",
    location: "Zuhause",
    days: [
      {
        name: "Brust & Trizeps",
        focus: "Oberkörper Push",
        exercises: [
          { exerciseId: "bench-press", name: "Kurzhantel Flyes (Boden)", sets: 4, reps: "12", rest: "75 Sek", notes: "Auf Boden legen, breite Griffweite" },
          { exerciseId: "push-up", name: "Liegestütz (gewichtet)", sets: 3, reps: "10–15", rest: "60 Sek", notes: "Rucksack auf Rücken als Gewicht" },
          { exerciseId: "bench-press", name: "Kurzhantel Bankdrücken (Boden)", sets: 4, reps: "10", rest: "75 Sek" },
          { exerciseId: "dips-chest", name: "Trizeps-Kickback", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "push-up", name: "Diamond Push-Up", sets: 3, reps: "10", rest: "60 Sek" },
        ],
      },
      {
        name: "Rücken & Bizeps",
        focus: "Oberkörper Pull",
        exercises: [
          { exerciseId: "rowing", name: "Einarmiges Rudern (KH)", sets: 4, reps: "12 pro Seite", rest: "75 Sek", notes: "Stuhl als Stütze nutzen" },
          { exerciseId: "pull-up", name: "Klimmzug (Türrahmen)", sets: 3, reps: "6–10", rest: "90 Sek", notes: "Türrahmen-Stange falls vorhanden" },
          { exerciseId: "bicep-curl", name: "Bizeps-Curl (KH)", sets: 4, reps: "12", rest: "60 Sek" },
          { exerciseId: "rowing", name: "Bent-Over Row (KH)", sets: 3, reps: "12", rest: "75 Sek" },
          { exerciseId: "bicep-curl", name: "Hammer Curl", sets: 3, reps: "12", rest: "60 Sek" },
        ],
      },
      {
        name: "Schultern & Core",
        focus: "Schultern, Bauch",
        exercises: [
          { exerciseId: "overhead-press", name: "Schulterdrücken (KH, sitzend)", sets: 4, reps: "12", rest: "75 Sek" },
          { exerciseId: "lateral-raise", name: "Seitheben (KH)", sets: 3, reps: "15", rest: "60 Sek" },
          { exerciseId: "lateral-raise", name: "Front Raise (KH)", sets: 3, reps: "12", rest: "60 Sek" },
          { exerciseId: "plank", name: "Planke", sets: 3, reps: "45 Sek", rest: "45 Sek" },
          { exerciseId: "russian-twist", name: "Russian Twist (KH)", sets: 3, reps: "20 gesamt", rest: "45 Sek" },
          { exerciseId: "crunch", name: "Crunch (KH auf Brust)", sets: 3, reps: "15", rest: "45 Sek" },
        ],
      },
      {
        name: "Beine & Gesäß",
        focus: "Unterkörper",
        exercises: [
          { exerciseId: "squat", name: "Goblet Squat (KH)", sets: 4, reps: "15", rest: "75 Sek", notes: "KH vor der Brust halten" },
          { exerciseId: "romanian-deadlift", name: "Romanian Deadlift (KH)", sets: 4, reps: "12", rest: "75 Sek" },
          { exerciseId: "lunge", name: "Kurzhantel Ausfallschritt", sets: 3, reps: "12 pro Bein", rest: "60 Sek" },
          { exerciseId: "glute-bridge", name: "Hip Thrust (KH auf Hüfte)", sets: 4, reps: "15", rest: "60 Sek" },
          { exerciseId: "calf-raise", name: "Calf Raises (einbeinig)", sets: 3, reps: "15 pro Bein", rest: "45 Sek" },
        ],
      },
    ],
  },
];
