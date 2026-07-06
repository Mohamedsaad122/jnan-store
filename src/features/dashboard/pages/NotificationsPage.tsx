import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import SectionHeader from '../components/SectionHeader';
import NotificationList from '../components/NotificationList';
import NotificationBadge from '../components/NotificationBadge';
import Button from '@/components/ui/Button';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '@/hooks/useNotificationsQuery';
import LoadingSpinner from '@/components/LoadingSpinner';

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header with badge & Mark All Read action */}
      <SectionHeader
        title={t('dashboard.nav.notifications', 'التنبيهات')}
        subtitle={
          isRtl
            ? 'تصفح وإدارة الإشعارات الخاصة بحسابك وحالة الطلبات والعروض.'
            : 'Browse and manage alerts regarding order updates and promotions.'
        }
      >
        <div className="flex items-center gap-3">
          <NotificationBadge count={unreadCount} />
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 border-border/40 hover:bg-gold/10 focus-visible:ring-gold"
            >
              <Check className="h-4 w-4 text-green-500" />
              <span>{isRtl ? 'تعيين الكل كمقروء' : 'Mark All Read'}</span>
            </Button>
          )}
        </div>
      </SectionHeader>

      {/* Notifications List Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          isRtl={isRtl}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
