import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';

export const EmptyNotificationState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl bg-card/10 font-tajawal select-none">
      <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4 border border-gold/15">
        <Bell className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-primary mb-1">
        {t('notifications.empty.title', 'لا يوجد تنبيهات واردة حالياً')}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
        {t(
          'notifications.empty.description',
          'صندوق الوارد فارغ تماماً. سنقوم بتنبيهك بمجرد حدوث نشاطات جديدة على حسابك أو وصول عروض مميزة.'
        )}
      </p>
    </div>
  );
};

export default EmptyNotificationState;
