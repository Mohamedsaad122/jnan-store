import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (injects active JWT auth token to requests)
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

// Response Interceptor (captures error codes globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    let message = 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.'; // Default Arabic error message

    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as { message?: string };
      if (data.message) message = data.message;
    }

    // Switch case handling of standard HTTP codes
    switch (status) {
      case 400:
        console.error(`Bad Request [400]: ${message}`);
        break;
      case 401:
        console.warn('Unauthorized [401]: Token invalid, purging auth cache.');
        localStorage.removeItem('auth_token');
        // Clear state & redirect placeholder
        break;
      case 403:
        console.error(`Forbidden [403]: Permissions validation failed.`);
        break;
      case 404:
        console.error(`Not Found [404]: Target resource is missing.`);
        break;
      case 500:
        console.error(`Server Error [500]: Internal error on the backend.`);
        break;
      default:
        console.error(`API Client Error: ${message}`);
    }

    return Promise.reject({
      status,
      message,
      originalError: error,
    });
  }
);

export default apiClient;
