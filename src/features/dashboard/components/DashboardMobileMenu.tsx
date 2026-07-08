import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LogOut,
  LayoutDashboard,
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Bell,
  ShieldAlert,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import { DASHBOARD_NAV_ITEMS } from '../constants/navigation';
import Sheet from '@/components/ui/Sheet';
import Avatar from '@/components/ui/Avatar';

const getIcon = (name: string, className?: string) => {
  const props = { className: className || 'h-5 w-5' };
  switch (name) {
    case 'LayoutDashboard':
      return <LayoutDashboard {...props} />;
    case 'User':
      return <User {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'MapPin':
      return <MapPin {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'Bell':
      return <Bell {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'Settings':
      return <Settings {...props} />;
    case 'LifeBuoy':
      return <LifeBuoy {...props} />;
    default:
      return <LifeBuoy {...props} />;
  }
};

interface DashboardMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const DashboardMobileMenu: React.FC<DashboardMobileMenuProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const userRole = user?.role || 'user';
  const filteredNavItems = DASHBOARD_NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  // Focus trap for accessibility compliance (WCAG 2.2 AA)
  useEffect(() => {
    if (!isOpen) return;

    const container = menuContainerRef.current;
    if (!container) return;

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Slight delay to allow DOM transition to complete before querying focusable elements
    const timer = setTimeout(() => {
      const focusableEls = container.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      firstEl.focus();

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          // Shift + Tab (backward tab)
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          // Tab (forward tab)
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      };

      container.addEventListener('keydown', handleKeydown);
      return () => container.removeEventListener('keydown', handleKeydown);
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      side={isRtl ? 'right' : 'left'}
      title={t('dashboard.title', 'لوحة التحكم')}
    >
      <div
        ref={menuContainerRef}
        className="flex flex-col h-full text-right font-tajawal pt-2"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* User profile card */}
        <div className="flex items-center gap-3 p-4 border-b border-border/40 mb-4 bg-muted/20 rounded-xl select-none">
          <Avatar
            src={user?.avatarUrl}
            fallbackText={user?.firstName || 'U'}
            className="h-11 w-11 border-gold/20"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-primary truncate">
              {user ? `${user.firstName} ${user.lastName}` : ''}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              {user?.role === 'admin'
                ? t('common.admin', 'مشرف')
                : user?.role === 'vendor'
                  ? t('common.vendor', 'تاجر')
                  : t('common.customer', 'عميل')}
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-grow space-y-1">
          {filteredNavItems.map((item) => {
            const isActive =
              item.path === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/5 font-bold border border-gold/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                }`}
              >
                {getIcon(
                  item.iconName,
                  isActive
                    ? 'h-5 w-5 text-primary-foreground shrink-0'
                    : 'h-5 w-5 text-muted-foreground shrink-0'
                )}
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all mt-4 border border-transparent hover:border-destructive/10"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>
    </Sheet>
  );
};

export default DashboardMobileMenu;
