import { authConfig } from '../config/auth.config';

// ===============================
// HELPERS
// ===============================
export const getApiBaseUrl = () => authConfig.apiBaseUrl;

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

// ===============================
// AUTH API
// ===============================
export const authAPI = {

  register: async (data) => {
    const res = await fetch(`${getApiBaseUrl()}/api/Auth/Register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.text();
    if (!res.ok) throw new Error(result);
    return result;
  },

  login: async (data) => {
    const res = await fetch(`${getApiBaseUrl()}/api/Auth/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result);
    return result;
  },

  adminLogin: async (data) => {
    const res = await fetch(`${getApiBaseUrl()}/api/Auth/Admin/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result);
    return result;
  },

  googleLogin: async (data) => {
    const res = await fetch(`${getApiBaseUrl()}/api/Auth/GoogleLogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result);
    return result;
  },
};