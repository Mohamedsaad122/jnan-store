import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '@/store/theme.store';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import SectionHeader from '../components/SectionHeader';
import SettingsSection from '../components/SettingsSection';
import PreferenceSwitch from '../components/PreferenceSwitch';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const isRtl = language === 'ar';

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [promoAlerts, setPromoAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(isRtl ? 'تم حفظ التفضيلات الإعدادية بنجاح' : 'Preferences saved successfully');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header */}
      <SectionHeader
        title={t('dashboard.nav.settings', 'الإعدادات العامة')}
        subtitle={
          isRtl
            ? 'تخصيص تفضيلات مظهر التطبيق، اللغة، وقنوات التنبيه.'
            : 'Customize styling themes, language options, and notification channels.'
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Interface Preferences */}
        <SettingsSection title={isRtl ? 'تفضيلات الواجهة والمظهر' : 'Interface Preferences'}>
          {/* Theme switch */}
          <PreferenceSwitch
            title={isRtl ? 'المظهر الداكن (الوضع الليلي)' : 'Dark Theme'}
            description={
              isRtl ? 'تفعيل الوضع الليلي لتخفيف إجهاد العين.' : 'Enable dark visual theme mode.'
            }
            checked={theme === 'dark'}
            onToggle={toggleTheme}
            isRtl={isRtl}
          />

          {/* Language selector row */}
          <div className="flex items-center justify-between py-4 text-right gap-4">
            <div className="space-y-1">
              <span className="font-bold text-xs sm:text-sm text-primary">
                {isRtl ? 'لغة الواجهة' : 'Interface Language'}
              </span>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                {isRtl ? 'اختر لغة عرض لوحة التحكم.' : 'Set primary display language.'}
              </p>
            </div>
            <div className="flex gap-2 select-none">
              <Button
                variant={language === 'ar' ? 'primary' : 'outline'}
                size="sm"
                className={`text-xs font-bold px-4 ${language === 'ar' ? 'bg-primary text-primary-foreground' : 'border-border/40'}`}
                onClick={() => setLanguage('ar')}
              >
                العربية
              </Button>
              <Button
                variant={language === 'en' ? 'primary' : 'outline'}
                size="sm"
                className={`text-xs font-bold px-4 ${language === 'en' ? 'bg-primary text-primary-foreground' : 'border-border/40'}`}
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
            </div>
          </div>
        </SettingsSection>

        {/* Notifications and marketing Channels */}
        <SettingsSection
          title={isRtl ? 'تفضيلات التنبيهات وقنوات التواصل' : 'Alerts & Notifications'}
        >
          {/* Email notifications */}
          <PreferenceSwitch
            title={isRtl ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
            description={
              isRtl
                ? 'استلام تفاصيل الشحن وفواتير الدفع على بريدك الإلكتروني.'
                : 'Receive shipment logs and invoices in email.'
            }
            checked={emailAlerts}
            onToggle={() => setEmailAlerts(!emailAlerts)}
            isRtl={isRtl}
          />

          {/* SMS notifications */}
          <PreferenceSwitch
            title={isRtl ? 'رسائل الجوال القصيرة (SMS)' : 'SMS Alert Messages'}
            description={
              isRtl
                ? 'استلام رسائل نصية قصيرة على هاتفك المسجل فور تحرك شحنتك.'
                : 'Receive text alerts for order status transitions.'
            }
            checked={smsAlerts}
            onToggle={() => setSmsAlerts(!smsAlerts)}
            isRtl={isRtl}
          />

          {/* Marketing promotions */}
          <PreferenceSwitch
            title={isRtl ? 'النشرات التسويقية والترويجية' : 'Marketing & Promotions'}
            description={
              isRtl
                ? 'الحصول على عروض خصومات موسمية وكوبونات خاصة بحسابك.'
                : 'Subscribe to marketing discounts and special coupons.'
            }
            checked={promoAlerts}
            onToggle={() => setPromoAlerts(!promoAlerts)}
            isRtl={isRtl}
          />
        </SettingsSection>
      </div>

      {/* Save Button */}
      <div className="flex justify-end select-none">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="text-xs font-bold px-6 bg-primary text-primary-foreground focus-visible:ring-gold hover:bg-primary/95 transition-all"
        >
          {isSaving
            ? isRtl
              ? 'جاري الحفظ...'
              : 'Saving...'
            : isRtl
              ? 'حفظ التفضيلات'
              : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
