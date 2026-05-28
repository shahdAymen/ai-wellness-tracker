import { API_ROOT_URL } from './core/api.config';
import { request } from './core/request';

import {
  UserProfile,
  ProfileSetupData,
} from '../API/types/user.types'

export const userAPI = {
  setupProfile: (data: ProfileSetupData) =>
    request<string>(`${API_ROOT_URL}/User/profile-setup`, { method: 'POST', body: JSON.stringify(data) }),

  getMe: () =>
    request<UserProfile>(`${API_ROOT_URL}/User/me`),

  getAllUsers: () =>
    request<UserProfile[]>(`${API_ROOT_URL}/User/Admin`),

  deleteUser: (id: string) =>
    request<string>(`${API_ROOT_URL}/User/Admin/users/${id}`, { method: 'DELETE' }),

  updateUserRole: (id: string, role: string) =>
    request<string>(`${API_ROOT_URL}/User/Admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
};