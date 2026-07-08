import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { ROUTES } from '@/constants/routes';
import { useLanguageStore } from '@/store/language.store';
import LanguageSwitcher from '@/components/global/LanguageSwitcher';
import ThemeSwitcher from '@/components/global/ThemeSwitcher';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { language } = useLanguageStore();

  const isRtl = language === 'ar';

  const menuItems = [
    { label: 'الرئيسية', path: ROUTES.HOME },
    { label: 'المتجر', path: ROUTES.SHOP },
    { label: 'الأقسام', path: ROUTES.CATEGORIES },
    { label: 'الأكثر مبيعاً', path: ROUTES.BEST_SELLERS },
    { label: 'العروض', path: ROUTES.OFFERS },
    { label: 'من نحن', path: ROUTES.ABOUT },
    { label: 'اتصل بنا', path: ROUTES.CONTACT },
  ];

  const categoriesList = [
    { nameAr: 'القهوة السعودية', nameEn: 'Saudi Coffee', slug: 'saudi-coffee' },
    { nameAr: 'القهوة المختصة', nameEn: 'Specialty Coffee', slug: 'specialty-coffee' },
    { nameAr: 'التمور الفاخرة', nameEn: 'Premium Dates', slug: 'dates' },
    { nameAr: 'المكسرات الطازجة', nameEn: 'Fresh Nuts', slug: 'nuts' },
    { nameAr: 'الحلويات والشوكولاتة', nameEn: 'Sweets', slug: 'sweets' },
  ];

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      side={isRtl ? 'right' : 'left'}
      title={isRtl ? 'القائمة الرئيسية' : 'Main Menu'}
      className="flex flex-col h-full justify-between"
    >
      <div className="flex flex-col space-y-3.5 py-4 font-tajawal text-right flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <div key={item.path} className="border-b border-border/20 last:border-0">
              {item.path === ROUTES.CATEGORIES ? (
                <details className="group">
                  <summary className="flex items-center justify-between py-2 text-base font-bold text-muted-foreground hover:text-gold cursor-pointer list-none">
                    <span>{item.label}</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="flex flex-col space-y-2 pr-4 pl-2 py-2">
                    {categoriesList.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/shop?category=${cat.slug}`}
                        onClick={onClose}
                        className="block text-sm font-semibold text-muted-foreground hover:text-gold py-1 decoration-none"
                      >
                        {isRtl ? cat.nameAr : cat.nameEn}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`block py-2 text-base font-bold transition-colors relative decoration-none ${
                    isActive
                      ? 'text-primary dark:text-gold font-bold'
                      : 'text-muted-foreground hover:text-gold'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute start-0 top-1/2 -translate-y-1/2 h-3.5 w-1 bg-gold rounded-full" />
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Switcher Bar Footer */}
      <div className="mt-auto border-t border-border/30 pt-4 flex items-center justify-between select-none">
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
        <div className="flex items-center">
          <ThemeSwitcher />
        </div>
      </div>
    </Sheet>
  );
};

export default MobileDrawer;
