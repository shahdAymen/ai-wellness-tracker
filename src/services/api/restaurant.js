import { apiClient } from './client';

export const restaurantAPI = {
  getNearby: (lat, lng) =>
    apiClient.get('/Restaurant/nearby', {
      params: { lat, lng },
      skipAuth: true,
      retry: 1,
    }),
  adminGetAll: () => apiClient.get('/Restaurant/Admin', { retry: 1 }),
  adminGetById: (id) => apiClient.get(`/Restaurant/Admin/${id}`, { retry: 1 }),
};
