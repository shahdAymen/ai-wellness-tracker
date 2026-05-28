import { API_ROOT_URL } from './core/api.config';
import { request } from './core/request';

import type { StatsData } from './types/stats.types';

export const statsAPI = {
  update: (data: Partial<StatsData>) =>
    request<string>(`${API_ROOT_URL}/Stats`, { method: 'POST', body: JSON.stringify(data) }),

  getDaily: () =>
    request<StatsData[]>(`${API_ROOT_URL}/Stats/daily`),
};
