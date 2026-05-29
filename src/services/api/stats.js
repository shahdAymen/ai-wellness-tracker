import { apiClient } from './client';

export const statsAPI = {
  update: (data) => apiClient.post('/Stats', data),
  getDaily: () => apiClient.get('/Stats/daily', { retry: 1 }),
};
