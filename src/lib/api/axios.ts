import axios from 'axios';
import { env } from '@/config/env';

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
