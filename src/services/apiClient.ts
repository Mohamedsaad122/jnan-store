import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.jnan-store.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Request Interceptor (injects active JWT token into header requests)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (handles generic 401 tokens or global error boundaries)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Token refreshing placeholder logic goes here
        // const newAccessToken = await refreshAccessToken();
        // localStorage.setItem('auth_token', newAccessToken);
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // return apiClient(originalRequest);
      } catch (refreshError) {
        // Clean up store sessions on token failure
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
