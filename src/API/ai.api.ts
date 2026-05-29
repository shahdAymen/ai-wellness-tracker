import { API_ROOT_URL } from './core/api.config';
import { request } from './core/request';
import { MealItem } from './types/meals.types';

// ─── AI API ───────────────────────────────────────────────────────────────────
export interface WeeklyPlan {
  days?: Array<{
    day: string;
    meals: MealItem[];
    totalCalories: number;
  }>;
  summary?: string;
}

export const aiAPI = {
  generateWeeklyPlan: (data: any) =>
    request<WeeklyPlan>(`${API_ROOT_URL}/AI/generate-weekly-plan`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
