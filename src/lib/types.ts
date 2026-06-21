export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: "lose" | "maintain" | "gain";
  activity: "low" | "medium" | "high";
  dailyCalories: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface Recipe {
  id: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  duration: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
}

export interface DayLog {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
