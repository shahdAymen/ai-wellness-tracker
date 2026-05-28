export interface DashboardData {
  calories: number;
  caloriesTarget?: number;
  water: number;
  waterTarget?: number;
  steps: number;
  stepsTarget?: number;
  meals: number;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalMeals: number;
  totalRestaurants: number;
}