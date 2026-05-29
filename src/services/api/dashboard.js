import { apiClient } from './client';

export const dashboardAPI = {
  getUserDashboard: () => apiClient.get('/Dashboard', { retry: 1 }),
  getAdminDashboard: () => apiClient.get('/Dashboard/Admin', { retry: 1 }),
};
