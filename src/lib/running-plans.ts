export interface RunningWorkout {
  name: string;
  type: "Intervall" | "Tempo" | "Langer Lauf" | "Easy Run" | "Fartlek" | "Bergläufe";
  duration: number;
  distance?: string;
  description: string;
  structure: string;
  effort: "Leicht" | "Mittel" | "Hart";
  goal: "Ausdauer" | "Schnelligkeit" | "Fettverbrennung" | "Wettkampf";
}

export interface RunningPlan {
  id: string;
  name: string;
  description: string;
  level: "Einsteiger" | "Mittel" | "Fortgeschritten";
  weeksTotal: number;
  daysPerWeek: number;
  goal: "5km" | "10km" | "Halbmarathon" | "Abnehmen" | "Allgemein";
  weeks: {
    week: number;
    theme: string;
    workouts: RunningWorkout[];
  }[];
}

export const RUNNING_PLANS: RunningPlan[] = [
  {
    id: "run-5k-beginner",
    name: "5km Einsteiger",
    description: "Von 0 auf 5km in 6 Wochen — sanfter Einstieg mit Geh-Lauf-Intervallen, die wöchentlich gesteigert werden.",
    level: "Einsteiger",
    weeksTotal: 6,
    daysPerWeek: 3,
    goal: "5km",
    weeks: [
      {
        week: 1,
        theme: "Erste Schritte",
        workouts: [
          {
            name: "Geh-Lauf-Start",
            type: "Easy Run",
            duration: 25,
            distance: "2–3 km",
            description: "Wechsel zwischen Gehen und Laufen — kein Druck, Rhythmus finden.",
            structure: "5 Min gehen → 6× (1 Min laufen + 2 Min gehen) → 2 Min gehen",
            effort: "Leicht",
            goal: "Ausdauer",
          },
          {
            name: "Aktive Erholung",
            type: "Easy Run",
            duration: 20,
            distance: "1,5–2 km",
            description: "Sehr langsames Laufen oder zügiges Gehen — Beine locker machen.",
            structure: "20 Min gleichmäßiges, sehr langsames Tempo — Gespräch möglich",
            effort: "Leicht",
            goal: "Ausdauer",
          },
          {
            name: "Wochenlauf",
            type: "Easy Run",
            duration: 28,
            distance: "2,5–3 km",
            description: "Etwas mehr Laufanteil als Montag.",
            structure: "5 Min gehen → 7× (1 Min laufen + 2 Min gehen) → 2 Min gehen",
            effort: "Leicht",
            goal: "Ausdauer",
          },
        ],
      },
      {
        week: 2,
        theme: "Ausdauer aufbauen",
        workouts: [
          {
            name: "Längere Intervalle",
            type: "Easy Run",
            duration: 28,
            distance: "2,5–3 km",
            description: "Laufphasen werden länger, Gehpausen kürzer.",
            structure: "5 Min gehen → 5× (2 Min laufen + 1,5 Min gehen) → 3 Min gehen",
            effort: "Leicht",
            goal: "Ausdauer",
          },
          {
            name: "Easy Jog",
            type: "Easy Run",
            duration: 25,
            distance: "2–3 km",
            description: "Entspanntes Dauerlaufen in Wohlfühltempo.",
            structure: "Gleichmäßiges Laufen ohne Pause — so langsam wie nötig",
            effort: "Leicht",
            goal: "Ausdauer",
          },
          {
            name: "Ausdauer-Test",
            type: "Easy Run",
            duration: 30,
            distance: "3 km",
            description: "Versuch 10 Minuten am Stück zu laufen.",
            structure: "5 Min gehen → 10 Min laufen → 3 Min gehen → 5 Min laufen → 2 Min gehen",
            effort: "Mittel",
            goal: "Ausdauer",
          },
        ],
      },
      {
        week: 3,
        theme: "Erster Dauerlauf",
        workouts: [
          {
            name: "15-Minuten-Lauf",
            type: "Easy Run",
            duration: 30,
            distance: "3–4 km",
            description: "Erster echter Dauerlauf ohne Gehpausen.",
            structure: "5 Min gehen → 15 Min laufen → 5 Min gehen → 5 Min auslaufen",
            effort: "Mittel",
            goal: "Ausdauer",
          },
          {
            name: "Erholung",
            type: "Easy Run",
            duration: 25,
            distance: "2,5 km",
            description: "Langsames Erholungslaufen.",
            structure: "25 Min sehr langsam laufen — Tempo darf ruhig reduziert werden",
            effort: "Leicht",
            goal: "Ausdauer",
          },
          {
            name: "Langer Samstag",
            type: "Langer Lauf",
            duration: 35,
            distance: "3,5–4 km",
            description: "Etwas längerer Lauf am Wochenende.",
            structure: "5 Min gehen → 20 Min laufen → 3 Min gehen → 5 Min laufen → 2 Min gehen",
            effort: "Mittel",
            goal: "Ausdauer",
          },
        ],
      },
      {
        week: 4,
        theme: "Erste Intervalle",
        workouts: [
          {
            name: "Tempo-Einheiten",
            type: "Intervall",
            duration: 35,
            distance: "4 km",
            description: "Erste kurze Tempoeinheiten um den Körper ans schnellere Laufen zu gewöhnen.",
            structure: "10 Min einlaufen → 4× (2 Min etwas schneller + 2 Min locker) → 5 Min auslaufen",
            effort: "Mittel",
            goal: "Schnelligkeit",
          },
          {
            name: "Erholungs-Jog",
            type: "Easy Run",
            duration: 25,
            distance: "2,5–3 km",
            description: "Lockeres Laufen nach den Intervallen.",
            structure: "25 Min gleichmäßig langsam — regenerieren",
            effort: "Leicht",
            goal: "Ausdauer",
          },
          {
            name: "25-Minuten-Dauerlauf",
            type: "Easy Run",
            duration: 35,
            distance: "4 km",
            description: "Erstes Mal 25 Minuten am Stück!",
            structure: "5 Min gehen → 25 Min laufen → 5 Min auslaufen",
            effort: "Mittel",
            goal: "Ausdauer",
          },
        ],
      },
      {
        week: 5,
        theme: "Annäherung an 5km",
        workouts: [
          {
            name: "Intervall-Block",
            type: "Intervall",
            duration: 38,
            distance: "4–5 km",
            description: "Intensivere Intervalle für mehr Speed.",
            structure: "10 Min einlaufen → 5× (3 Min Tempo + 2 Min Pause) → 8 Min auslaufen",
            effort: "Hart",
            goal: "Schnelligkeit",
          },
          {
            name: "30-Minuten-Lauf",
            type: "Easy Run",
            duration: 35,
            distance: "4–5 km",
            description: "30 Minuten am Stück — du schaffst es!",
            structure: "5 Min einlaufen → 30 Min Dauerlauf → cool-down",
            effort: "Mittel",
            goal: "Ausdauer",
          },
          {
            name: "Pre-Race-Lauf",
            type: "Easy Run",
            duration: 30,
            distance: "3–4 km",
            description: "Lockerer Lauf vor dem ersten 5km-Versuch.",
            structure: "30 Min locker laufen — Beine schonen",
            effort: "Leicht",
            goal: "Ausdauer",
          },
        ],
      },
      {
        week: 6,
        theme: "5km Ziel erreichen",
        workouts: [
          {
            name: "Leichter Start",
            type: "Easy Run",
            duration: 25,
            distance: "3 km",
            description: "Kurzer lockerer Lauf zu Beginn der Finalwoche.",
            structure: "25 Min entspanntes Laufen",
            effort: "Leicht",
            goal: "Ausdauer",
          },
          {
            name: "Vorbereitung",
            type: "Easy Run",
            duration: 20,
            distance: "2 km",
            description: "Kurz und locker — Energie sparen.",
            structure: "20 Min sehr locker, kein Druck",
            effort: "Leicht",
            goal: "Ausdauer",
          },
          {
            name: "5km Finale!",
            type: "Langer Lauf",
            duration: 40,
            distance: "5 km",
            description: "Dein erster 5km-Lauf am Stück. Tempo egal — ankommen ist alles.",
            structure: "5 Min gehen → 5 km am Stück laufen → 5 Min auslaufen — Glückwunsch!",
            effort: "Mittel",
            goal: "Ausdauer",
          },
        ],
      },
    ],
  },

  {
    id: "run-10k",
    name: "10km Plan",
    description: "Systematischer 8-Wochen-Plan für deinen ersten 10km-Lauf mit Tempo- und Ausdauereinheiten.",
    level: "Mittel",
    weeksTotal: 8,
    daysPerWeek: 4,
    goal: "10km",
    weeks: [
      {
        week: 1,
        theme: "Basis legen",
        workouts: [
          { name: "Einlauf-Easy", type: "Easy Run", duration: 30, distance: "4–5 km", description: "Grundlage aufbauen.", structure: "30 Min gleichmäßiges Laufen — komfortables Tempo", effort: "Leicht", goal: "Ausdauer" },
          { name: "Tempo-Basis", type: "Tempo", duration: 35, distance: "5 km", description: "Leicht erhöhtes Tempo.", structure: "10 Min einlaufen → 15 Min zügiges Tempo → 10 Min auslaufen", effort: "Mittel", goal: "Schnelligkeit" },
          { name: "Erholungslauf", type: "Easy Run", duration: 25, distance: "3–4 km", description: "Lockere Erholung.", structure: "25 Min sehr locker laufen", effort: "Leicht", goal: "Ausdauer" },
          { name: "Langer Sonntag", type: "Langer Lauf", duration: 45, distance: "6–7 km", description: "Langer langsamer Lauf.", structure: "45 Min in konstantem, langsamem Tempo — kein Stopp", effort: "Mittel", goal: "Ausdauer" },
        ],
      },
      {
        week: 2,
        theme: "Umfang steigern",
        workouts: [
          { name: "Easy Jog", type: "Easy Run", duration: 30, distance: "4–5 km", description: "Gleichtempo wie Woche 1.", structure: "30 Min locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "Intervalle 400m", type: "Intervall", duration: 40, distance: "5–6 km", description: "Erste 400m-Intervalle.", structure: "10 Min einlaufen → 6× (400m schnell + 90 Sek traben) → 10 Min auslaufen", effort: "Hart", goal: "Schnelligkeit" },
          { name: "Erholung", type: "Easy Run", duration: 25, distance: "3 km", description: "Erholen nach Intervallen.", structure: "25 Min sehr locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "Langer Lauf", type: "Langer Lauf", duration: 50, distance: "7–8 km", description: "+1km zum Vorwochenlauf.", structure: "50 Min konstant langsam", effort: "Mittel", goal: "Ausdauer" },
        ],
      },
      {
        week: 3,
        theme: "Tempohärte",
        workouts: [
          { name: "Easy Run", type: "Easy Run", duration: 35, distance: "5 km", description: "Etwas mehr Umfang.", structure: "35 Min gleichmäßig", effort: "Leicht", goal: "Ausdauer" },
          { name: "Tempo-Lauf", type: "Tempo", duration: 40, distance: "6 km", description: "Wettkampftempo einüben.", structure: "10 Min einlaufen → 20 Min Wettkampftempo → 10 Min auslaufen", effort: "Hart", goal: "Wettkampf" },
          { name: "Recovery", type: "Easy Run", duration: 30, distance: "4 km", description: "Erholung vom Tempolauf.", structure: "30 Min sehr locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "Long Run", type: "Langer Lauf", duration: 55, distance: "8–9 km", description: "Längster Lauf bisher.", structure: "55 Min konstant langsam — Wasser mitnehmen", effort: "Mittel", goal: "Ausdauer" },
        ],
      },
      {
        week: 4,
        theme: "Erholungswoche",
        workouts: [
          { name: "Leichter Lauf", type: "Easy Run", duration: 25, distance: "3–4 km", description: "Erholungswoche — Umfang reduzieren.", structure: "25 Min sehr locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "Kurze Intervalle", type: "Intervall", duration: 30, distance: "4 km", description: "Kürzere Intervalleinheit.", structure: "10 Min einlaufen → 4× (400m schnell + 90 Sek) → 8 Min auslaufen", effort: "Mittel", goal: "Schnelligkeit" },
          { name: "Easy Run", type: "Easy Run", duration: 25, distance: "3 km", description: "Locker bleiben.", structure: "25 Min sehr locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "Mittellanger Lauf", type: "Langer Lauf", duration: 40, distance: "6 km", description: "Kürzerer langer Lauf in der Erholungswoche.", structure: "40 Min gleichmäßig langsam", effort: "Leicht", goal: "Ausdauer" },
        ],
      },
      {
        week: 5,
        theme: "Intensität hoch",
        workouts: [
          { name: "Easy Lauf", type: "Easy Run", duration: 35, distance: "5 km", description: "Aufbauwoche beginnt.", structure: "35 Min locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "800m Intervalle", type: "Intervall", duration: 45, distance: "7 km", description: "Längere Intervalle für 10km-Vorbereitung.", structure: "10 Min einlaufen → 5× (800m Tempo + 2 Min traben) → 10 Min auslaufen", effort: "Hart", goal: "Wettkampf" },
          { name: "Erholung", type: "Easy Run", duration: 30, distance: "4 km", description: "Locker nach Intervallen.", structure: "30 Min sehr locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "9km Lauf", type: "Langer Lauf", duration: 60, distance: "9 km", description: "Erster Fast-10km!", structure: "60 Min konstant — letzten Kilometer etwas schneller wenn möglich", effort: "Mittel", goal: "Ausdauer" },
        ],
      },
      {
        week: 6,
        theme: "Fartlek & Spaß",
        workouts: [
          { name: "Fartlek-Lauf", type: "Fartlek", duration: 40, distance: "6 km", description: "Freies Tempospiel nach Gefühl.", structure: "10 Min einlaufen → 20 Min Fartlek (spontane Tempowechsel nach Gefühl) → 10 Min auslaufen", effort: "Mittel", goal: "Schnelligkeit" },
          { name: "Tempo-Run", type: "Tempo", duration: 45, distance: "7 km", description: "25 Minuten Wettkampftempo.", structure: "10 Min einlaufen → 25 Min 10km-Tempo → 10 Min auslaufen", effort: "Hart", goal: "Wettkampf" },
          { name: "Easy Recovery", type: "Easy Run", duration: 30, distance: "4 km", description: "Erholung.", structure: "30 Min sehr locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "Long Run", type: "Langer Lauf", duration: 65, distance: "9–10 km", description: "Nah an der Wettkampfdistanz.", structure: "65 Min gleichmäßig — gern mit dem letzten Kilometer schneller", effort: "Mittel", goal: "Ausdauer" },
        ],
      },
      {
        week: 7,
        theme: "Taper beginnt",
        workouts: [
          { name: "Easy Run", type: "Easy Run", duration: 30, distance: "4–5 km", description: "Umfang sinkt.", structure: "30 Min locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "Kurze Intervalle", type: "Intervall", duration: 35, distance: "5 km", description: "Tempo halten, Umfang reduzieren.", structure: "10 Min einlaufen → 4× (400m schnell + 2 Min) → 10 Min auslaufen", effort: "Mittel", goal: "Schnelligkeit" },
          { name: "Erholung", type: "Easy Run", duration: 25, distance: "3 km", description: "Locker laufen.", structure: "25 Min sehr locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "7km Lauf", type: "Langer Lauf", duration: 50, distance: "7 km", description: "Kürzerer langer Lauf — Energie sparen.", structure: "50 Min gleichmäßig", effort: "Leicht", goal: "Ausdauer" },
        ],
      },
      {
        week: 8,
        theme: "10km Rennen!",
        workouts: [
          { name: "Easy Aktivierung", type: "Easy Run", duration: 20, distance: "3 km", description: "Kurz und locker — Beine frisch halten.", structure: "20 Min sehr locker", effort: "Leicht", goal: "Ausdauer" },
          { name: "Strides", type: "Intervall", duration: 20, distance: "2–3 km", description: "Kurze Beschleunigungen um Beine zu aktivieren.", structure: "10 Min einlaufen → 4× (20 Sek Sprint + 60 Sek Pause) → 5 Min auslaufen", effort: "Mittel", goal: "Schnelligkeit" },
          { name: "Ruhetag Jogging", type: "Easy Run", duration: 15, distance: "2 km", description: "Nur wenn du dich gut fühlst.", structure: "15 Min sehr locker — optional", effort: "Leicht", goal: "Ausdauer" },
          { name: "10km RACE DAY!", type: "Langer Lauf", duration: 60, distance: "10 km", description: "Dein großes Ziel — du bist bereit. Genieße jeden Kilometer.", structure: "Erste 2km ruhig starten → gleichmäßiges Tempo halten → letzten 500m alles geben!", effort: "Hart", goal: "Wettkampf" },
        ],
      },
    ],
  },

  {
    id: "run-fatburn",
    name: "Fettverbrennung Laufen",
    description: "4-Wochen-Plan für maximale Fettverbrennung — lange Easy Runs im Fettstoffwechselbereich kombiniert mit Fartlek-Einheiten.",
    level: "Mittel",
    weeksTotal: 4,
    daysPerWeek: 4,
    goal: "Abnehmen",
    weeks: [
      {
        week: 1,
        theme: "Fettstoffwechsel aktivieren",
        workouts: [
          { name: "Nüchternlauf", type: "Easy Run", duration: 40, distance: "5–6 km", description: "Morgens vor dem Frühstück — maximale Fettverbrennung.", structure: "40 Min sehr langsam — Puls unter 130 bpm, nur Wasser vorher", effort: "Leicht", goal: "Fettverbrennung" },
          { name: "Fartlek Basis", type: "Fartlek", duration: 35, distance: "5 km", description: "Freies Tempospiel aktiviert mehr Kalorien.", structure: "10 Min einlaufen → 15 Min Fartlek (30 Sek schnell, 90 Sek locker, Wiederholungen) → 10 Min auslaufen", effort: "Mittel", goal: "Fettverbrennung" },
          { name: "Langer Easy Run", type: "Langer Lauf", duration: 55, distance: "7–8 km", description: "Langer Lauf im Fettverbrennungsbereich.", structure: "55 Min konstant langsam — Unterhaltung möglich, kein Keuchen", effort: "Leicht", goal: "Fettverbrennung" },
          { name: "Recovery Jog", type: "Easy Run", duration: 25, distance: "3 km", description: "Leichte Aktivierung.", structure: "25 Min sehr locker", effort: "Leicht", goal: "Fettverbrennung" },
        ],
      },
      {
        week: 2,
        theme: "Intensität mischen",
        workouts: [
          { name: "Nüchternlauf Extended", type: "Easy Run", duration: 45, distance: "6–7 km", description: "5 Minuten länger als letzte Woche.", structure: "45 Min nüchtern sehr langsam", effort: "Leicht", goal: "Fettverbrennung" },
          { name: "Tempo-Intervalle", type: "Intervall", duration: 40, distance: "5–6 km", description: "Tempowechsel verbrennen mehr Kalorien auch nach dem Lauf (EPOC).", structure: "10 Min einlaufen → 6× (1 Min hart + 2 Min locker) → 10 Min auslaufen", effort: "Hart", goal: "Fettverbrennung" },
          { name: "Langer Sonntag", type: "Langer Lauf", duration: 60, distance: "8–9 km", description: "Langer Fettverbrennungslauf.", structure: "60 Min in ruhigem Tempo — kein Stopp, Puls stabil", effort: "Leicht", goal: "Fettverbrennung" },
          { name: "Easy Recovery", type: "Easy Run", duration: 30, distance: "4 km", description: "Aktive Erholung.", structure: "30 Min sehr locker", effort: "Leicht", goal: "Fettverbrennung" },
        ],
      },
      {
        week: 3,
        theme: "Peak Woche",
        workouts: [
          { name: "Langer Nüchternlauf", type: "Easy Run", duration: 50, distance: "7 km", description: "Maximaler Fettstoffwechsel-Stimulus.", structure: "50 Min nüchtern — Puls 120–130 bpm ideal", effort: "Leicht", goal: "Fettverbrennung" },
          { name: "Fartlek Intensiv", type: "Fartlek", duration: 45, distance: "6–7 km", description: "Intensiveres Tempospiel.", structure: "10 Min einlaufen → 25 Min Fartlek (spontane Sprints von 30 Sek bis 2 Min) → 10 Min auslaufen", effort: "Hart", goal: "Fettverbrennung" },
          { name: "90-Minuten-Lauf", type: "Langer Lauf", duration: 90, distance: "11–13 km", description: "Langer Lauf für maximale Fettverbrennung — nach 45 Min verbrennt der Körper überwiegend Fett.", structure: "Ersten 15 Min sehr langsam → 60–75 Min konstant langsam → 15 Min auslaufen", effort: "Mittel", goal: "Fettverbrennung" },
          { name: "Recovery", type: "Easy Run", duration: 25, distance: "3 km", description: "Erholung nach langer Woche.", structure: "25 Min sehr locker", effort: "Leicht", goal: "Fettverbrennung" },
        ],
      },
      {
        week: 4,
        theme: "Konsolidierung",
        workouts: [
          { name: "Easy Nüchternlauf", type: "Easy Run", duration: 40, distance: "5–6 km", description: "Erholungswoche — Umfang leicht reduziert.", structure: "40 Min nüchtern locker", effort: "Leicht", goal: "Fettverbrennung" },
          { name: "Bergläufe", type: "Bergläufe", duration: 40, distance: "5 km", description: "Hügel verbrennen extra Kalorien und stärken Beine.", structure: "10 Min einlaufen → 6× (Hügel hoch laufen ca. 60–90 Sek + langsam runter) → 10 Min auslaufen", effort: "Hart", goal: "Fettverbrennung" },
          { name: "Abschluss-Langer-Lauf", type: "Langer Lauf", duration: 70, distance: "9–10 km", description: "Letzter langer Fettverbrennungslauf.", structure: "70 Min gleichmäßig — konstantes Tempo, kein Stopp", effort: "Mittel", goal: "Fettverbrennung" },
          { name: "Wochenabschluss", type: "Easy Run", duration: 30, distance: "4 km", description: "Lockerer Abschluss.", structure: "30 Min sehr locker", effort: "Leicht", goal: "Fettverbrennung" },
        ],
      },
    ],
  },

  {
    id: "run-intervals",
    name: "Intervall Speed",
    description: "Hardcore 4-Wochen-Intervallprogramm für Läufer die schneller werden wollen — maximale VO2max-Steigerung.",
    level: "Fortgeschritten",
    weeksTotal: 4,
    daysPerWeek: 3,
    goal: "Allgemein",
    weeks: [
      {
        week: 1,
        theme: "Einstieg Intervalltraining",
        workouts: [
          { name: "400m Klassiker", type: "Intervall", duration: 45, distance: "6–7 km", description: "Die Basis aller Schnelligkeitsarbeit.", structure: "15 Min einlaufen → 8× (400m im 5km-Tempo + 90 Sek traben) → 10 Min auslaufen", effort: "Hart", goal: "Schnelligkeit" },
          { name: "Tempo-Run", type: "Tempo", duration: 40, distance: "6 km", description: "20 Minuten Schwellentempolauf.", structure: "10 Min einlaufen → 20 Min Schwellentempo (10km-Renntempo) → 10 Min auslaufen", effort: "Hart", goal: "Wettkampf" },
          { name: "Easy Recovery", type: "Easy Run", duration: 35, distance: "5 km", description: "Aktive Erholung nach harter Woche.", structure: "35 Min sehr locker — Tempo egal, Beine lockern", effort: "Leicht", goal: "Ausdauer" },
        ],
      },
      {
        week: 2,
        theme: "Volumen steigern",
        workouts: [
          { name: "800m Intervalle", type: "Intervall", duration: 50, distance: "8 km", description: "Länger als 400m — fordert mehr Ausdauer beim Tempo.", structure: "15 Min einlaufen → 6× (800m im 10km-Tempo + 2 Min traben) → 10 Min auslaufen", effort: "Hart", goal: "Schnelligkeit" },
          { name: "Fartlek Intensiv", type: "Fartlek", duration: 45, distance: "7 km", description: "Unstrukturiertes Tempospiel — nach Gefühl hart und locker wechseln.", structure: "10 Min einlaufen → 25 Min Fartlek (10 Sek bis 3 Min Sprints gemischt) → 10 Min auslaufen", effort: "Hart", goal: "Schnelligkeit" },
          { name: "Long Run Easy", type: "Langer Lauf", duration: 50, distance: "7–8 km", description: "Langer langsamer Lauf für Grundlagenausdauer.", structure: "50 Min sehr locker — Erholung aufbauen für nächste Woche", effort: "Leicht", goal: "Ausdauer" },
        ],
      },
      {
        week: 3,
        theme: "Peak Intensität",
        workouts: [
          { name: "1000m Intervalle", type: "Intervall", duration: 55, distance: "9–10 km", description: "Die Königsdisziplin — 1km-Wiederholungen im 5km-Renntempo.", structure: "15 Min einlaufen → 5× (1000m hart + 2,5 Min Pause) → 10 Min auslaufen", effort: "Hart", goal: "Wettkampf" },
          { name: "Bergläufe", type: "Bergläufe", duration: 45, distance: "6 km", description: "Bergläufe stärken Kraft und VO2max gleichzeitig.", structure: "15 Min einlaufen → 8× (Hügel hoch ca. 60 Sek maximal + locker runter) → 10 Min auslaufen", effort: "Hart", goal: "Schnelligkeit" },
          { name: "Easy Long", type: "Langer Lauf", duration: 55, distance: "8 km", description: "Langsam bleiben nach harter Woche.", structure: "55 Min sehr locker — Tempo maximal 30 Sek/km langsamer als Easy-Tempo", effort: "Leicht", goal: "Ausdauer" },
        ],
      },
      {
        week: 4,
        theme: "Taper & Speed-Test",
        workouts: [
          { name: "Kurze Intervalle", type: "Intervall", duration: 40, distance: "6 km", description: "Weniger Umfang, Tempo halten.", structure: "15 Min einlaufen → 6× (400m maximal + 2 Min Pause) → 10 Min auslaufen", effort: "Hart", goal: "Schnelligkeit" },
          { name: "Strides & Drills", type: "Intervall", duration: 30, distance: "4 km", description: "Lauftechnik und Aktivierung vor dem Speed-Test.", structure: "10 Min einlaufen → 6× (80m Stride locker-schnell + 60 Sek Pause) → 10 Min auslaufen", effort: "Mittel", goal: "Schnelligkeit" },
          { name: "Speed-Test 5km", type: "Tempo", duration: 35, distance: "5 km", description: "Alles rauslassen — wie schnell bist du jetzt?", structure: "10 Min einlaufen → 5km so schnell wie möglich → 10 Min auslaufen und Zeit notieren!", effort: "Hart", goal: "Wettkampf" },
        ],
      },
    ],
  },
];
