import { API_BASE_URL } from './core/api.config';
import { request } from './core/request';
import {
  ForgotPasswordData,
  LoginResponse,
  RegisterData,
  ResetPasswordData,
  LoginData,
  GoogleLoginData,
  FacebookLoginData
} from './types/auth.types';

export const authAPI = {

  // ======================
  // AUTH FIXED ROUTES
  // ======================

  register: (data: RegisterData) =>
    request<LoginResponse>(
      `${API_BASE_URL}/Auth/Register`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false
    ),

  login: (data: LoginData) =>
    request<LoginResponse>(
      `${API_BASE_URL}/Auth/Login`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false
    ),

  adminLogin: (data: LoginData) =>
    request<LoginResponse>(
      `${API_BASE_URL}/Auth/Login`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false
    ),

  // ======================
  // REST (زي ما هو)
  // ======================

  refresh: (data: { token: string; refreshToken: string }) =>
    request<LoginResponse>(
      `${API_BASE_URL}/refresh`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false
    ),

  revokeRefreshToken: () =>
    request<string>(
      `${API_BASE_URL}/revoke-refresh-token`,
      { method: 'PUT' }
    ),

  forgotPassword: (data: ForgotPasswordData) =>
    request<string>(
      `${API_BASE_URL}/forgot-password`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false
    ),

  resetPassword: (data: ResetPasswordData) =>
    request<string>(
      `${API_BASE_URL}/reset-password`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false
    ),

  // ======================
  // OAuth (سيبها زي ما هي)
  // ======================

  googleLogin: (_data: GoogleLoginData) =>
    Promise.reject(
      new Error('Use OAuth redirect: GET /api/Auth/google-login')
    ),

  facebookLogin: (_data: FacebookLoginData) =>
    Promise.reject(
      new Error('Facebook login not supported by this API')
    ),
};