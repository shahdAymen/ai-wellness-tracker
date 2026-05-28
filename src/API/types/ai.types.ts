export interface GeneratePlanRequest {
  goal: 'lose' | 'gain' | 'maintain';
  duration: number;
}

export interface MealPlan {
  name: string;
  calories: number;
  time?: string;
}

export interface WorkoutPlan {
  name: string;
  duration: string;
  days: string[];
}

export interface GeneratePlanResponse {
  title: string;
  duration: string;
  dailyCalories: number;
  meals: MealPlan[];
  workouts: WorkoutPlan[];
}