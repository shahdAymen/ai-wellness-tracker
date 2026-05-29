import { apiClient } from './client';

export const workoutAPI = {
  getAll: () => apiClient.get('/Workout', { retry: 1 }),
  getById: (id) => apiClient.get(`/Workout/${id}`, { retry: 1 }),
  create: (data) => apiClient.post('/Workout', data),
  update: (id, data) => apiClient.put(`/Workout/${id}`, data),
};
