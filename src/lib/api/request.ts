import { AxiosRequestConfig } from 'axios';
import { apiClient } from './axios';

export const request = {
  /**
   * Performs an HTTP GET request returning typed response data directly
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  /**
   * Performs an HTTP POST request returning typed response data directly
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  /**
   * Performs an HTTP PUT request returning typed response data directly
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  /**
   * Performs an HTTP DELETE request returning typed response data directly
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

export default request;
