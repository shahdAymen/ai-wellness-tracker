import { API_BASE_URL, apiClient } from './client';

export const authAPI = {
  register: ({ fullName, email, password }) =>
    apiClient.post(
      '/Auth/Register',
      { fullName, email, password },
      { skipAuth: true }
    ),

  login: ({ email, password }) =>
    apiClient.post('/Auth/Login', { email, password }, { skipAuth: true }),

  refresh: ({ token, refreshToken }) =>
    apiClient.post('/Auth/refresh', { token, refreshToken }, { skipAuth: true }),

  revokeRefreshToken: ({ token, refreshToken }) =>
    apiClient.put(
      '/Auth/revoke-refresh-token',
      { token, refreshToken },
      { skipAuth: true }
    ),

  forgotPassword: ({ email }) =>
    apiClient.post('/Auth/forgot-password', { email }, { skipAuth: true }),

  resetPassword: ({ email, token, newPassword }) =>
    apiClient.post(
      '/Auth/reset-password',
      { email, token, newPassword },
      { skipAuth: true }
    ),

  getGoogleLoginUrl: () => `${API_BASE_URL}/Auth/google-login`,
};
