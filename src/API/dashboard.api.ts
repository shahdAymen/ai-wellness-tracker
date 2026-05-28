import { API_ROOT_URL } from './core/api.config';
import { request } from './core/request';
import { AdminDashboardData, DashboardData } from './types/dashboard.types';
export const dashboardAPI = {
  getUserDashboard: () =>
    request<DashboardData>(`${API_ROOT_URL}/Dashboard`),

  getAdminDashboard: () =>
    request<AdminDashboardData>(`${API_ROOT_URL}/Dashboard/Admin`),
};
