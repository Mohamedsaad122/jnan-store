import { apiClient } from '@/lib/api/axios';
import { setupInterceptors } from '@/lib/api/interceptors';

// Bootstrap Axios request and response interceptors
setupInterceptors();

export { apiClient };
export default apiClient;
