import { apiClient } from './client';

export const userAPI = {
  setupProfile: (data) => apiClient.post('/User/profile-setup', data),
  updateProfile: (data) => apiClient.put('/User/profile', data),
  getMe: () => apiClient.get('/User/me', { retry: 1 }),
  getAllUsers: () => apiClient.get('/User/Admin', { retry: 1 }),
  deleteUser: (id) => apiClient.delete(`/User/Admin/users/${id}`),
  updateUserRole: (id, role) =>
    apiClient.patch(`/User/Admin/users/${id}/role`, { role }),
};
