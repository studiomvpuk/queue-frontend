import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from './store/auth';
import { ApiResponse } from '@/types/api';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1';

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore.getState();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authStore = useAuthStore.getState();
      const refreshToken = authStore.refreshToken || localStorage.getItem('refreshToken');

      try {
        // Backend rotates refresh tokens. Persist BOTH or the next refresh
        // will replay a revoked token and the backend will wipe sessions.
        const response = await axios.post<
          ApiResponse<{
            accessToken: string;
            accessTokenExpiresIn: number;
            refreshToken: string;
            refreshTokenExpiresIn: number;
          }>
        >(`${baseURL}/auth/token/refresh`, { refreshToken });

        const {
          accessToken,
          accessTokenExpiresIn,
          refreshToken: rotatedRefresh,
        } = response.data.data;
        authStore.setAccessToken(accessToken, accessTokenExpiresIn);
        if (rotatedRefresh) authStore.setRefreshToken(rotatedRefresh);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
