import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/store/language.store';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const DashboardBreadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const getBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const items = [{ label: isRtl ? 'الرئيسية' : 'Home', path: '/' }];

    items.push({
      label: isRtl ? 'لوحة التحكم' : 'Dashboard',
      path: '/dashboard',
    });

    if (pathParts[1]) {
      const sub = pathParts[1];
      let label = sub;
      switch (sub) {
        case 'profile':
          label = t('dashboard.nav.profile', { defaultValue: 'الملف الشخصي' });
          break;
        case 'orders':
          label = t('dashboard.nav.orders', { defaultValue: 'الطلبات' });
          break;
        case 'addresses':
          label = t('dashboard.nav.addresses', { defaultValue: 'العناوين' });
          break;
        case 'wishlist':
          label = t('dashboard.nav.wishlist', { defaultValue: 'المفضلة' });
          break;
        case 'notifications':
          label = t('dashboard.nav.notifications', { defaultValue: 'التنبيهات' });
          break;
        case 'security':
          label = t('dashboard.nav.security', { defaultValue: 'الحماية والأمان' });
          break;
        case 'settings':
          label = t('dashboard.nav.settings', { defaultValue: 'الإعدادات' });
          break;
        case 'support':
          label = t('dashboard.nav.support', { defaultValue: 'الدعم الفني' });
          break;
      }
      items.push({ label, path: `/dashboard/${sub}` });
    }
    return items;
  };

  return <Breadcrumb items={getBreadcrumbs()} isRtl={isRtl} className="py-0" />;
};

export default DashboardBreadcrumbs;
