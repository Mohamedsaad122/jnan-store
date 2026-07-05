import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Trash2, MailOpen } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SectionTitle from '../components/SectionTitle';
import EmptyDashboardState from '../components/EmptyDashboardState';
import { toast } from 'react-hot-toast';

interface MockNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'notif-1',
    titleAr: 'تم توصيل طلبك رقم JN-928374',
    titleEn: 'Order JN-928374 delivered',
    descAr: 'تم توصيل شحنتك بنجاح عن طريق المندوب. نتمنى أن تنال المنتجات رضاك!',
    descEn: 'Your package was successfully delivered. We hope you enjoy your purchase!',
    time: '2026-06-17T18:00:00Z',
    read: true,
  },
  {
    id: 'notif-2',
    titleAr: 'عروض حصرية لفصل الصيف! ☀️',
    titleEn: 'Exclusive Summer Deals! ☀️',
    descAr: 'خصومات تصل إلى ٢٠٪ على منتجات العسل والتمور الفاخرة لفترة محدودة.',
    descEn: 'Get up to 20% discount on honey and date selections for a limited time.',
    time: '2026-07-04T08:00:00Z',
    read: false,
  },
  {
    id: 'notif-3',
    titleAr: 'تأكيد شحن الطلب رقم JN-108273',
    titleEn: 'Shipment confirmation for JN-108273',
    descAr: 'تم تسليم شحنتك لشركة الشحن، ويمكنك تتبع مسار الشحنة الآن.',
    descEn: 'Your order has been handed to our carrier. Tracking details are available.',
    time: '2026-07-03T10:00:00Z',
    read: false,
  },
];

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [notifs, setNotifs] = useState<MockNotification[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
    toast.success(isRtl ? 'تم تعيين التنبيه كمقروء' : 'Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
    toast.success(isRtl ? 'تم تعيين جميع التنبيهات كمقروءة' : 'All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    setNotifs(notifs.filter((n) => n.id !== id));
    toast.success(isRtl ? 'تم حذف التنبيه' : 'Notification deleted');
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4 select-none text-right">
        <SectionTitle
          title={t('dashboard.nav.notifications')}
          subtitle={
            isRtl
              ? 'تصفح وإدارة التنبيهات الخاصة بحالة طلباتك والعروض الخاصة.'
              : 'Browse and manage alerts regarding order updates and promotions.'
          }
        />

        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 border-border/40"
          >
            <Check className="h-4 w-4 text-green-500" />
            <span>{isRtl ? 'تعيين الكل كمقروء' : 'Mark All Read'}</span>
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifs.length === 0 ? (
        <EmptyDashboardState
          title={isRtl ? 'لا يوجد تنبيهات واردة.' : 'No notifications found.'}
          description={
            isRtl
              ? 'صندوق الوارد فارغ. سنقوم بتنبيهك بمجرد حدوث نشاطات جديدة على حسابك!'
              : 'Your inbox is clear. We will alert you as soon as new activity occurs on your account!'
          }
        />
      ) : (
        <div className="space-y-3">
          {notifs.map((n) => (
            <Card
              key={n.id}
              className={`p-4 border flex items-start gap-4 transition-all text-right relative overflow-hidden ${
                n.read
                  ? 'border-border/20 bg-card/40 opacity-80'
                  : 'border-gold/30 bg-gold/5 shadow-xs'
              }`}
            >
              {/* Icon */}
              <div
                className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center select-none ${
                  n.read ? 'bg-muted text-muted-foreground' : 'bg-gold/15 text-gold'
                }`}
              >
                <Bell className="h-4.5 w-4.5" />
              </div>

              {/* Info details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 select-none">
                  <span className="font-bold text-xs text-primary">
                    {isRtl ? n.titleAr : n.titleEn}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{formatDate(n.time)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {isRtl ? n.descAr : n.descEn}
                </p>

                {/* Inline Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 select-none border-t border-border/10 mt-2">
                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[10px] font-bold text-primary hover:text-gold flex items-center gap-1 transition-colors focus:outline-none"
                    >
                      <MailOpen className="h-3.5 w-3.5" />
                      <span>{isRtl ? 'تعيين كمقروء' : 'Mark Read'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-[10px] font-bold text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors focus:outline-none"
                    aria-label={isRtl ? 'حذف التنبيه' : 'Delete notification'}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'حذف' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
