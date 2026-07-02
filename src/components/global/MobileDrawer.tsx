import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet } from '@/components/ui/Sheet';
import { ROUTES } from '@/constants/routes';
import { useLanguageStore } from '@/store/language.store';

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
    { label: 'من نحن', path: ROUTES.ABOUT },
    { label: 'اتصل بنا', path: ROUTES.CONTACT },
  ];

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      side={isRtl ? 'right' : 'left'}
      title="القائمة الرئيسية"
    >
      <div className="flex flex-col space-y-4 py-4 font-tajawal text-right">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`block py-2 text-base font-medium border-b border-border/40 transition-colors ${
                isActive
                  ? 'text-primary dark:text-gold font-bold'
                  : 'text-muted-foreground hover:text-gold'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </Sheet>
  );
};

export default MobileDrawer;
