import { apiClient } from './client';

export function getPlanDays(plan) {
  if (!plan) return [];
  if (Array.isArray(plan)) return plan;
  if (Array.isArray(plan.days)) return plan.days;
  if (Array.isArray(plan.meals)) return [plan];
  return [];
}

export function getPlanMeals(plan) {
  return getPlanDays(plan).flatMap((day) =>
    (day.meals || []).map((meal) => ({
      ...meal,
      date: day.date,
      day: day.day,
    }))
  );
}

export const mealsAPI = {
  getToday: () => apiClient.get('/Meals/today', { retry: 1 }),
  getWeekly: () => apiClient.get('/Meals/weekly', { retry: 1 }),
  getMonthly: () => apiClient.get('/Meals/monthly', { retry: 1 }),
  getMealDetails: (mealId) => apiClient.get(`/Meals/${mealId}/details`, { retry: 1 }),
  getDailySummary: (date) =>
    apiClient.get('/Meals/daily-summary', {
      params: date ? { date } : undefined,
      retry: 1,
    }),
  completeMeal: (mealPlanId) => apiClient.patch(`/Meals/${mealPlanId}/complete`),
  uncompleteMeal: (mealPlanId) => apiClient.patch(`/Meals/${mealPlanId}/uncomplete`),
  adminGetMeals: () => apiClient.get('/Meals/Admin', { retry: 1 }),
  adminGetMeal: (id) => apiClient.get(`/Meals/Admin/${id}`, { retry: 1 }),
  adminAddMeal: (data) => apiClient.post('/Meals/Admin/Add', data),
  adminUpdateMeal: (id, data) => apiClient.put(`/Meals/Admin/${id}`, data),
};
