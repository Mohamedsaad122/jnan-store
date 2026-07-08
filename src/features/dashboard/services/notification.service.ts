import { NotificationItem } from '@/store/notification.store';
import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    titleAr: 'تم شحن طلبك #JN-928374 🎉',
    titleEn: 'Your order #JN-928374 has been shipped 🎉',
    descAr:
      'خرجت شحنتك مع شريك الشحن ناقل إكسبريس. رقم التتبع الخاص بك هو JN-TRK-928374 للتتبع الفوري.',
    descEn: 'Your package is on its way via Naqel Express. Your tracking code is JN-TRK-928374.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: 'notif-2',
    type: 'promotion',
    titleAr: 'خصم خاص بانتظارك! ☕',
    titleEn: 'Special discount coupon is waiting! ☕',
    descAr: 'احصل على خصم ١٥٪ على طلبك القادم من حبوب البن الفاخرة باستخدام الكوبون JNAN15.',
    descEn: 'Use coupon JNAN15 to get 15% off on your next purchase of premium coffee beans.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
  },
  {
    id: 'notif-3',
    type: 'security',
    titleAr: 'تنبيه أمان: تغيير كلمة المرور',
    titleEn: 'Security Alert: Password Updated',
    descAr:
      'تم تحديث كلمة مرور حسابك بنجاح. إذا لم تقم بهذا الإجراء، يرجى الاتصال بالدعم الفني فوراً.',
    descEn:
      'Your account password has been updated. If you did not make this change, contact support.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    read: true,
  },
  {
    id: 'notif-4',
    type: 'account',
    titleAr: 'توثيق البريد الإلكتروني بنجاح',
    titleEn: 'Email Verified Successfully',
    descAr: 'تم توثيق بريدك الإلكتروني بنجاح. يمكنك الآن الاستمتاع بكافة مزايا حسابك الخاصة.',
    descEn: 'Your email address is verified. You can now access all customer dashboard options.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    read: true,
  },
];

export const dashboardNotificationService = {
  async fetchNotifications(): Promise<NotificationItem[]> {
    if (!featureFlags.enableMockApi) {
      return request.get<NotificationItem[]>('/notifications');
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    const cached = localStorage.getItem('jnan-notification-store');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    // Initialize default notifications in local storage
    localStorage.setItem('jnan-notification-store', JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  },

  async updateReadStatus(id: string, read: boolean): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.put(`/notifications/${id}`, { read });
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    const cached = localStorage.getItem('jnan-notification-store');
    if (cached) {
      try {
        const list = JSON.parse(cached) as NotificationItem[];
        const updated = list.map((n) => (n.id === id ? { ...n, read } : n));
        localStorage.setItem('jnan-notification-store', JSON.stringify(updated));
      } catch {
        // Ignore JSON parsing errors
      }
    }
    return true;
  },

  async markAllAsRead(): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.put('/notifications/read-all');
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
    const cached = localStorage.getItem('jnan-notification-store');
    if (cached) {
      try {
        const list = JSON.parse(cached) as NotificationItem[];
        const updated = list.map((n) => ({ ...n, read: true }));
        localStorage.setItem('jnan-notification-store', JSON.stringify(updated));
      } catch {
        // Ignore JSON parsing errors
      }
    }
    return true;
  },

  async deleteNotification(id: string): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.delete(`/notifications/${id}`);
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    const cached = localStorage.getItem('jnan-notification-store');
    if (cached) {
      try {
        const list = JSON.parse(cached) as NotificationItem[];
        const updated = list.filter((n) => n.id !== id);
        localStorage.setItem('jnan-notification-store', JSON.stringify(updated));
      } catch {
        // Ignore JSON parsing errors
      }
    }
    return true;
  },

  async deleteAllNotifications(): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.delete('/notifications');
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    localStorage.setItem('jnan-notification-store', JSON.stringify([]));
    return true;
  },
};

export default dashboardNotificationService;
