import { API_ROOT_URL } from './core/api.config';
import { request } from './core/request';
import { authAPI, userAPI } from '../API';
import {
  ActivityLevel,
  Goal,
} from '../API/types/lookup.types'

export const lookupAPI = {
  getActivityLevels: () =>
    request<ActivityLevel[]>(
      `${API_ROOT_URL}/Lookup/activity-levels`,
      {},
      false
    ),

  getGoals: () =>
    request<Goal[]>(
      `${API_ROOT_URL}/Lookup/goals`,
      {},
      false
    ),
};