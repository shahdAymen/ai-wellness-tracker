import { API_ROOT_URL } from './core/api.config';
import { request } from './core/request';
import { LogWorkoutData, WorkoutEntry } from './types/workout.types';

export const workoutAPI = {
  getAll: () =>
    request(`${API_ROOT_URL}/Workout`),

  log: (data: any) =>
    request(`${API_ROOT_URL}/Workout`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (id: any) =>
    request(`${API_ROOT_URL}/Workout/${id}`),

  update: (id: any, data: any) =>
    request(`${API_ROOT_URL}/Workout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};