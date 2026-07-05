import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/theme.store';
import { useLanguageStore } from '@/store/language.store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SectionTitle from '../components/SectionTitle';
import { toast } from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const isRtl = language === 'ar';

  const [newsletter, setNewsletter] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const handleSave = () => {
    toast.success(isRtl ? 'تم حفظ التفضيلات الإعدادية بنجاح' : 'Preferences saved successfully');
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <SectionTitle
        title={t('dashboard.nav.settings')}
        subtitle={
          isRtl
            ? 'تخصيص تفضيلات المظهر، اللغة، وقنوات التنبيه.'
            : 'Customize styling themes, language options, and notification channels.'
        }
      />

      <Card className="max-w-2xl p-6 border-border/40 shadow-sm text-right">
        <div className="space-y-6">
          {/* Theme Settings Row */}
          <div className="flex items-center justify-between py-3 border-b border-border/20">
            <div className="space-y-1">
              <span className="font-bold text-sm text-primary">
                {isRtl ? 'المظهر الداكن (الوضع الليلي)' : 'Dark Theme'}
              </span>
              <p className="text-[11px] text-muted-foreground">
                {isRtl ? 'تفعيل الوضع الليلي لتخفيف إجهاد العين.' : 'Enable dark visual mode.'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                theme === 'dark' ? 'bg-gold' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={isRtl ? 'مفتاح الوضع الداكن' : 'Dark theme switch'}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  theme === 'dark' ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language Settings Row */}
          <div className="flex items-center justify-between py-3 border-b border-border/20">
            <div className="space-y-1">
              <span className="font-bold text-sm text-primary">
                {isRtl ? 'لغة الواجهة' : 'Interface Language'}
              </span>
              <p className="text-[11px] text-muted-foreground">
                {isRtl ? 'اختر لغة عرض المتجر ولوحة التحكم.' : 'Set primary display language.'}
              </p>
            </div>
            <div className="flex gap-2 select-none">
              <Button
                variant={language === 'ar' ? 'primary' : 'outline'}
                size="sm"
                className="text-xs font-bold px-4"
                onClick={() => setLanguage('ar')}
              >
                العربية
              </Button>
              <Button
                variant={language === 'en' ? 'primary' : 'outline'}
                size="sm"
                className="text-xs font-bold px-4"
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
            </div>
          </div>

          {/* Newsletter Alerts */}
          <div className="flex items-center justify-between py-3 border-b border-border/20">
            <div className="space-y-1">
              <span className="font-bold text-sm text-primary">
                {isRtl ? 'النشرة البريدية التسويقية' : 'Newsletter Promotions'}
              </span>
              <p className="text-[11px] text-muted-foreground">
                {isRtl
                  ? 'استلام إيميلات العروض والخصومات الحصرية.'
                  : 'Subscribe to seasonal discounts.'}
              </p>
            </div>
            <button
              onClick={() => setNewsletter(!newsletter)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                newsletter ? 'bg-gold' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={newsletter}
              aria-label={isRtl ? 'مفتاح النشرة البريدية' : 'Newsletter promotion switch'}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  newsletter ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* SMS Alerts */}
          <div className="flex items-center justify-between py-3 border-b border-border/20">
            <div className="space-y-1">
              <span className="font-bold text-sm text-primary">
                {isRtl ? 'تنبيهات الجوال (SMS)' : 'SMS Shipments Alerts'}
              </span>
              <p className="text-[11px] text-muted-foreground">
                {isRtl
                  ? 'استلام رسائل نصية بحالة شحن الطلبات وتوصيلها.'
                  : 'Receive tracking notifications.'}
              </p>
            </div>
            <button
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                smsAlerts ? 'bg-gold' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={smsAlerts}
              aria-label={isRtl ? 'مفتاح تنبيهات الجوال' : 'SMS alert switch'}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  smsAlerts ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end pt-4 select-none">
            <Button
              onClick={handleSave}
              className="text-xs font-bold px-6 bg-primary hover:bg-primary/95 text-primary-foreground transition-all"
            >
              {isRtl ? 'حفظ التفضيلات' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
