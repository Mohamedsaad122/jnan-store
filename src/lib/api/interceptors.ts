import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './axios';
import { errorMapper } from './errorMapper';

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

// Response Interceptor: standardizes errors and provides refresh hooks
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 1. Normalize the caught AxiosError to our central Error subclasses
    const mappedError = errorMapper.mapError(error);

    // 2. Refresh token architecture extension point placeholder
    if (mappedError.status === 401) {
      console.warn('Unauthorized [401]: Token invalid or session expired.');

      // Cleanup local auth cache (backward-compatible purge)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');

      /**
       * FUTURE RETRY WORKFLOW EXTENSION POINT:
       * When a real backend is integrated, we can trigger the token refresh endpoint here:
       *
       * try {
       *   const newTokens = await authService.refreshToken();
       *   localStorage.setItem('auth_token', newTokens.accessToken);
       *
       *   // Re-run original request with new token
       *   if (error.config) {
       *     error.config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
       *     return apiClient(error.config);
       *   }
       * } catch (refreshError) {
       *   // Handle logout / redirect to login
       * }
       */
    }

    // Reject using the standardized normalized error class
    return Promise.reject(mappedError);
  }
);

export const setupInterceptors = () => {
  // Expose hook to initialize or verify file mounting
  console.log('✅ API interceptors mounted successfully');
};

export default setupInterceptors;
