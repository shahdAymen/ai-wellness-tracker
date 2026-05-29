import { apiClient } from './client';

export const aiAPI = {
  generateWeeklyPlan: () => apiClient.post('/AI/generate-weekly-plan'),
};
