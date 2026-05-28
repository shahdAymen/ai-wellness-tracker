export interface MealItem {
  id: number;
  mealPlanId: number;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
  mealType?: string;
  isCompleted?: boolean;
  imageUrl?: string;
} 
export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  completedMeals: number;
}