import { apiClient } from './client';

export const waterAPI = {
  getHistory: () => apiClient.get('/WaterTracking', { retry: 1 }),
  getToday: () => apiClient.get('/WaterTracking/today', { retry: 1 }),
  log: (amount) => apiClient.post('/WaterTracking', { amount: Number(amount) }),
};
