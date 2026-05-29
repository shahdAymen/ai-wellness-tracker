import { apiClient } from './client';

export const googleFitAPI = {
  getTodaySummary: () => apiClient.get('/GoogleFit/today-summary', { retry: 1 }),
};
