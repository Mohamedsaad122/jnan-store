import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Trash2, Bell, AlertTriangle } from 'lucide-react';
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
  useDeleteAllNotifications,
} from '@/hooks/useNotificationsQuery';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NotificationItem } from '@/store/notification.store';
import { Dialog } from '@/components/ui/Dialog';

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  const deleteAllNotificationsMutation = useDeleteAllNotifications();

  const [filterType, setFilterType] = useState<
    'all' | 'unread' | 'order' | 'promotion' | 'account_security'
  >('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDeleteAllConfirm = () => {
    deleteAllNotificationsMutation.mutate();
    setIsDeleteModalOpen(false);
  };

  // Filter logic
  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'order') return n.type === 'order';
    if (filterType === 'promotion') return n.type === 'promotion';
    if (filterType === 'account_security') return n.type === 'account' || n.type === 'security';
    return true;
  });

  // Grouping notifications by date
  const getGroupedNotifications = (items: NotificationItem[]) => {
    const today: NotificationItem[] = [];
    const yesterday: NotificationItem[] = [];
    const older: NotificationItem[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    items.forEach((item) => {
      const itemTime = new Date(item.time).getTime();
      if (itemTime >= todayStart) {
        today.push(item);
      } else if (itemTime >= yesterdayStart) {
        yesterday.push(item);
      } else {
        older.push(item);
      }
    });

    return { today, yesterday, older };
  };

  const { today, yesterday, older } = getGroupedNotifications(filteredNotifications);

  return (
    <div className="space-y-6 text-right font-tajawal" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header with badge & Mark All Read action */}
      <SectionHeader
        title={t('dashboard.nav.notifications', 'التنبيهات')}
        subtitle={
          isRtl
            ? 'تصفح وإدارة الإشعارات الخاصة بحسابك وحالة الطلبات والعروض.'
            : 'Browse and manage alerts regarding order updates and promotions.'
        }
      >
        <div className="flex items-center gap-2 select-none flex-wrap justify-end">
          <NotificationBadge count={unreadCount} />

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1 border-border/40 hover:bg-gold/10 focus-visible:ring-gold cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span>{isRtl ? 'تعيين الكل كمقروء' : 'Mark All Read'}</span>
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1 border-destructive/20 text-destructive hover:bg-destructive/5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isRtl ? 'مسح الكل' : 'Delete All'}</span>
            </Button>
          )}
        </div>
      </SectionHeader>

      {/* Tabs Filter Bar */}
      <div className="flex border-b border-border/40 select-none pb-0 overflow-x-auto gap-2 scrollbar-none">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent shrink-0 ${
            filterType === 'all'
              ? 'border-gold text-gold font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-primary'
          }`}
        >
          {isRtl ? 'الكل' : 'All'}
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent shrink-0 ${
            filterType === 'unread'
              ? 'border-gold text-gold font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-primary'
          }`}
        >
          {isRtl ? 'غير المقروءة' : 'Unread'}
        </button>
        <button
          onClick={() => setFilterType('order')}
          className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent shrink-0 ${
            filterType === 'order'
              ? 'border-gold text-gold font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-primary'
          }`}
        >
          {isRtl ? 'تحديثات الطلبات' : 'Orders'}
        </button>
        <button
          onClick={() => setFilterType('promotion')}
          className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent shrink-0 ${
            filterType === 'promotion'
              ? 'border-gold text-gold font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-primary'
          }`}
        >
          {isRtl ? 'العروض الترويجية' : 'Offers'}
        </button>
        <button
          onClick={() => setFilterType('account_security')}
          className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent shrink-0 ${
            filterType === 'account_security'
              ? 'border-gold text-gold font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-primary'
          }`}
        >
          {isRtl ? 'الحساب والأمان' : 'Account & Security'}
        </button>
      </div>

      {/* Notifications List Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl bg-card/10 select-none">
          <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4 border border-gold/15">
            <Bell className="h-5 w-5 text-gold/60" />
          </div>
          <h3 className="text-sm font-bold text-primary mb-1">
            {isRtl ? 'لا توجد إشعارات حالياً' : 'No notifications found'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            {isRtl
              ? 'حسابك محدث بالكامل ولا توجد تنبيهات جديدة مسجلة.'
              : 'Your account is up-to-date and there are no alerts.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Today Group */}
          {today.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gold border-r-2 border-gold pr-2 select-none">
                {isRtl ? 'اليوم' : 'Today'}
              </h4>
              <NotificationList
                notifications={today}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
                isRtl={isRtl}
              />
            </div>
          )}

          {/* Yesterday Group */}
          {yesterday.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground border-r-2 border-border pr-2 select-none">
                {isRtl ? 'أمس' : 'Yesterday'}
              </h4>
              <NotificationList
                notifications={yesterday}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
                isRtl={isRtl}
              />
            </div>
          )}

          {/* Older Group */}
          {older.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground border-r-2 border-border pr-2 select-none">
                {isRtl ? 'سابقاً' : 'Older'}
              </h4>
              <NotificationList
                notifications={older}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
                isRtl={isRtl}
              />
            </div>
          )}
        </div>
      )}

      {/* Delete All Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={isRtl ? 'حذف جميع التنبيهات' : 'Clear All Notifications'}
        description={
          isRtl
            ? 'هل أنت متأكد من رغبتك في حذف جميع الإشعارات نهائياً؟ لا يمكن التراجع عن هذا الإجراء.'
            : 'Are you sure you want to clear all notifications? This action cannot be undone.'
        }
      >
        <div className="flex items-center gap-3 justify-end pt-4" dir="ltr">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            className="text-xs font-bold px-4 h-9 cursor-pointer"
          >
            {isRtl ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteAllConfirm}
            className="text-xs font-bold px-4 h-9 bg-destructive hover:bg-destructive/95 text-destructive-foreground border-0 flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>{isRtl ? 'حذف الكل' : 'Clear All'}</span>
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default NotificationsPage;
