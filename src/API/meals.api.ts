import { API_ROOT_URL } from "./core/api.config";
import { request } from "./core/request";
import { DailySummary, MealItem } from "./types/meals.types";
export const mealsAPI = {
  getToday: () =>
    request<MealItem[]>(`${API_ROOT_URL}/Meals/today`),

  getWeekly: () =>
    request<MealItem[]>(`${API_ROOT_URL}/Meals/weekly`),

  getMonthly: () =>
    request<MealItem[]>(`${API_ROOT_URL}/Meals/monthly`),

  getMealDetails: (mealId: number) =>
    request<MealItem>(`${API_ROOT_URL}/Meals/${mealId}/details`),

  completeMeal: (mealPlanId: number) =>
    request<string>(`${API_ROOT_URL}/Meals/${mealPlanId}/complete`, { method: 'PATCH' }),

  uncompleteMeal: (mealPlanId: number) =>
    request<string>(`${API_ROOT_URL}/Meals/${mealPlanId}/uncomplete`, { method: 'PATCH' }),

  getDailySummary: (date?: string) => {
    const params = date ? `?date=${date}` : '';
    return request<DailySummary>(`${API_ROOT_URL}/Meals/daily-summary${params}`);
  },

  adminAddMeal: (data: Partial<MealItem>) =>
    request<string>(`${API_ROOT_URL}/Meals/Admin/Add`, { method: 'POST', body: JSON.stringify(data) }),

  adminGetMeals: () =>
    request<MealItem[]>(`${API_ROOT_URL}/Meals/Admin`),

  adminUpdateMeal: (id: number, data: Partial<MealItem>) =>
    request<string>(`${API_ROOT_URL}/Meals/Admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
