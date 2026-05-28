import { API_ROOT_URL } from './core/api.config';
import { request } from './core/request';
import { WaterEntry, WaterToday } from './types/water.types';
export const waterAPI = {
  getHistory: () =>
    request<WaterEntry[]>(`${API_ROOT_URL}/WaterTracking`),

  log: (amount: number) =>
    request<WaterEntry>(`${API_ROOT_URL}/WaterTracking`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  getToday: () =>
    request<WaterToday>(`${API_ROOT_URL}/WaterTracking/today`),
};