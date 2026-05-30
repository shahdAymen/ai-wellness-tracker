import { apiClient } from './client';

export function getPlanDays(plan) {
  let rawDays = [];
  if (!plan) return [];
  if (Array.isArray(plan)) rawDays = plan;
  else if (Array.isArray(plan.days)) rawDays = plan.days;
  else if (Array.isArray(plan.meals)) rawDays = [plan];

  if (rawDays.length === 0) return [];

  // Retrieve plan generation date or set default to today
  let genDateStr = localStorage.getItem('plan_generation_date');
  let startDate;
  if (genDateStr) {
    startDate = new Date(genDateStr);
  } else {
    startDate = new Date();
    localStorage.setItem('plan_generation_date', startDate.toISOString());
  }

  // Shift/override day.date and day.day based on index
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return rawDays.map((day, index) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + index);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const dayName = dayNames[d.getDay()];

    return {
      ...day,
      date: formattedDate,
      day: dayName,
    };
  });
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
