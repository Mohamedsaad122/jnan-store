import { NotificationItem } from '@/store/notification.store';
import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';

/**
 * Service to orchestrate user notification queries, prepared for REST API integration.
 * Supports switching between Mock and Real APIs.
 */
export const dashboardNotificationService = {
  /**
   * Fetches notifications from either mock local storage or the backend API.
   */
  async fetchNotifications(): Promise<NotificationItem[]> {
    if (!featureFlags.enableMockApi) {
      return request.get<NotificationItem[]>('/notifications');
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    const cached = localStorage.getItem('jnan-notification-store');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.state?.notifications) {
          return parsed.state.notifications;
        }
      } catch {
        // Fallback
      }
    }
    return [];
  },

  /**
   * Simulates or triggers updating a notification read status on the server.
   */
  async updateReadStatus(id: string, read: boolean): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.put(`/notifications/${id}`, { read });
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  },

  /**
   * Simulates or triggers marking all notification records as read.
   */
  async markAllAsRead(): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.put('/notifications/read-all');
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
    return true;
  },

  /**
   * Simulates or triggers deleting a notification record from database.
   */
  async deleteNotification(id: string): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.delete(`/notifications/${id}`);
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  },
};

export default dashboardNotificationService;
