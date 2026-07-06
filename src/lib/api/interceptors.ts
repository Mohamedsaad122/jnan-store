import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './axios';
import { errorMapper } from './errorMapper';
import { env } from '@/config/env';

interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: injects active JWT auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: standardizes errors and handles automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Avoid infinite retry loop on token refresh request itself
    if (originalRequest && originalRequest.url?.includes('/auth/refresh-token')) {
      return Promise.reject(errorMapper.mapError(error));
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('auth_refresh_token');

      if (!refreshToken) {
        // No refresh token, purge and reject
        localStorage.removeItem('auth_token');
        return Promise.reject(errorMapper.mapError(error));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        // Direct call to axios to avoid interceptor loops
        axios
          .post<{ accessToken: string; refreshToken: string }>(
            `${env.VITE_API_BASE_URL}/auth/refresh-token`,
            { token: refreshToken }
          )
          .then(({ data }) => {
            localStorage.setItem('auth_token', data.accessToken);
            localStorage.setItem('auth_refresh_token', data.refreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }

            processQueue(null, data.accessToken);
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_refresh_token');
            reject(errorMapper.mapError(err));
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // Reject using the standardized normalized error class
    return Promise.reject(errorMapper.mapError(error));
  }
);

export const setupInterceptors = () => {
  // Expose hook to initialize or verify file mounting
  console.log('✅ API interceptors mounted successfully with automatic refresh active');
};

export default setupInterceptors;
