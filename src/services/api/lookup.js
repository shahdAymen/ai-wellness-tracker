import { apiClient } from './client';

export const lookupAPI = {
  getActivityLevels: () =>
    apiClient.get('/Lookup/activity-levels', { skipAuth: true, retry: 1 }),
  getGoals: () => apiClient.get('/Lookup/goals', { skipAuth: true, retry: 1 }),
};
