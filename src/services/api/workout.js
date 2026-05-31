import { apiClient } from './client';

export const workoutAPI = {
  getAll: () => apiClient.get('/Workout', { retry: 1 }),
  getById: (id) => apiClient.get(`/Workout/${id}`, { retry: 1 }),
  create: (data) => apiClient.post('/Workout', data),
  update: (id, data) => apiClient.put(`/Workout/${id}`, data),
  generatePlan: () => apiClient.post('/Workout/generate'),
  getCurrent: () => apiClient.get('/Workout/current', { retry: 1 }),
  completeExercise: (workoutPlanId) => apiClient.post(`/Workout/${workoutPlanId}/complete`),
  uncompleteExercise: (workoutPlanId) => apiClient.post(`/Workout/${workoutPlanId}/uncomplete`),
};
