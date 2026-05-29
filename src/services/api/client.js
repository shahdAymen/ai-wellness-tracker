import axios from 'axios';
import { normalizeApiError } from './errors';
import {
  clearAuthSession,
  getAccessToken,
  getAuthTokens,
  setAuthSession,
} from './tokenStorage';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://vetalityai.onrender.com/api';

const rawClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;
let activeRequests = 0;
const loadingListeners = new Set();

function setLoadingDelta(delta) {
  activeRequests = Math.max(0, activeRequests + delta);
  loadingListeners.forEach((listener) => listener(activeRequests > 0));
}

export function subscribeToApiLoading(listener) {
  loadingListeners.add(listener);
  listener(activeRequests > 0);
  return () => loadingListeners.delete(listener);
}

function notifySessionExpired() {
  clearAuthSession();
  window.dispatchEvent(new CustomEvent('vitalityai:auth-expired'));
}

function shouldRetry(error) {
  const config = error.config || {};
  const retry = Number(config.retry || 0);
  const retryCount = Number(config.__retryCount || 0);
  const status = error.response?.status;

  if (retryCount >= retry) return false;
  return !status || status >= 500;
}

async function refreshAccessToken() {
  const { token, refreshToken } = getAuthTokens();

  if (!token || !refreshToken) {
    notifySessionExpired();
    throw normalizeApiError({ message: 'Missing refresh token.' });
  }

  if (!refreshPromise) {
    refreshPromise = rawClient
      .post('/Auth/refresh', { token, refreshToken })
      .then((response) => {
        setAuthSession(response.data);
        return response.data;
      })
      .catch((error) => {
        notifySessionExpired();
        throw normalizeApiError(error);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  setLoadingDelta(1);

  if (!config.skipAuth) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    setLoadingDelta(-1);
    return response.data ?? null;
  },
  async (error) => {
    setLoadingDelta(-1);
    const originalRequest = error.config || {};

    if (error.response?.status === 401 && !originalRequest.__isRetryRequest) {
      originalRequest.__isRetryRequest = true;
      const refreshed = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${refreshed.token}`;
      return apiClient(originalRequest);
    }

    if (shouldRetry(error)) {
      originalRequest.__retryCount = Number(originalRequest.__retryCount || 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, 350 * originalRequest.__retryCount));
      return apiClient(originalRequest);
    }

    throw normalizeApiError(error);
  }
);
