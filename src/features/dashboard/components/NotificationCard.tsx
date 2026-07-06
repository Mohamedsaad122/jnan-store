import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Gift, User, ShieldAlert, Settings, MailOpen, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import { NotificationItem } from '@/store/notification.store';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isRtl: boolean;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  isRtl,
}) => {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (notification.type) {
      case 'order':
        return <Truck className="h-4.5 w-4.5" />;
      case 'promotion':
        return <Gift className="h-4.5 w-4.5" />;
      case 'account':
        return <User className="h-4.5 w-4.5" />;
      case 'security':
        return <ShieldAlert className="h-4.5 w-4.5" />;
      case 'system':
      default:
        return <Settings className="h-4.5 w-4.5" />;
    }
  };

  const getIconStyles = () => {
    if (notification.read) {
      return 'bg-muted text-muted-foreground border-border/20';
    }
    switch (notification.type) {
      case 'order':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/15';
      case 'promotion':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15';
      case 'security':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/15';
      case 'account':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/15';
      case 'system':
      default:
        return 'bg-gold/15 text-gold border-gold/15';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card
      className={`p-4 border flex items-start gap-4 transition-all text-right relative overflow-hidden font-tajawal ${
        notification.read
          ? 'border-border/20 bg-card/40 opacity-80 shadow-xs'
          : 'border-gold/30 bg-gold/5 shadow-sm'
      }`}
    >
      {/* Icon Badge */}
      <div
        className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center border select-none ${getIconStyles()}`}
        aria-hidden="true"
      >
        {getIcon()}
      </div>

      {/* Info details */}
      <div className="flex-grow min-w-0 space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 select-none">
          <div className="flex items-center gap-2">
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-gold shrink-0 animate-ping" />
            )}
            <span className="font-bold text-xs text-primary">
              {isRtl ? notification.titleAr : notification.titleEn}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">{formatDate(notification.time)}</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {isRtl ? notification.descAr : notification.descEn}
        </p>

        {/* Inline Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 select-none border-t border-border/10 mt-2">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-[10px] font-bold text-primary hover:text-gold flex items-center gap-1 transition-colors focus:outline-none focus:ring-1 focus:ring-gold rounded px-1.5 py-0.5"
            >
              <MailOpen className="h-3.5 w-3.5" />
              <span>{t('notifications.action.mark_read', 'تعيين كمقروء')}</span>
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="text-[10px] font-bold text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors focus:outline-none focus:ring-1 focus:ring-destructive rounded px-1.5 py-0.5"
            aria-label={isRtl ? 'حذف التنبيه' : 'Delete notification'}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t('common.delete', 'حذف')}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;
