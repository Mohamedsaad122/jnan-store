import { DashboardCard } from '../types';

export const dashboardService = {
  /**
   * Fetches mock stats cards overview data
   */
  async getOverviewStats(_userId: string): Promise<DashboardCard[]> {
    // Simulate minor network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 200));

    return [
      {
        id: 'orders-summary',
        title: 'الطلبات النشطة',
        value: 12,
        description: 'بما في ذلك الطلبات قيد التوصيل والطلب المعلق',
        iconName: 'ShoppingBag',
        change: '+8%',
        trend: 'up',
        linkText: 'عرض جميع الطلبات',
        linkPath: '/dashboard/orders',
      },
      {
        id: 'wishlist-summary',
        title: 'قائمة الأمنيات',
        value: 5,
        description: 'المنتجات التي تم حفظها مؤخراً',
        iconName: 'Heart',
        change: '0%',
        trend: 'neutral',
        linkText: 'عرض المفضلة',
        linkPath: '/dashboard/wishlist',
      },
      {
        id: 'notifications-summary',
        title: 'تنبيهات غير مقروءة',
        value: 2,
        description: 'رسائل وتنبيهات الأمان والخصومات الواردة',
        iconName: 'Bell',
        change: '-12%',
        trend: 'down',
        linkText: 'فتح صندوق التنبيهات',
        linkPath: '/dashboard/notifications',
      },
    ];
  },
};

export default dashboardService;
