import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
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

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const userRole = user?.role || 'user';
  const filteredNavItems = DASHBOARD_NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside
      className={`hidden md:flex flex-col bg-card/60 backdrop-blur-md border-y-0 p-4 transition-all duration-300 select-none relative h-full ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${isRtl ? 'border-l' : 'border-r'}`}
      aria-label={t('dashboard.title', 'لوحة التحكم')}
    >
      {/* Collapse/Expand absolute toggle handle */}
      <button
        onClick={onToggleCollapse}
        className={`absolute top-6 h-6 w-6 rounded-full border bg-background hover:bg-muted flex items-center justify-center shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring z-20 ${
          isRtl ? 'left-0 transform -translate-x-1/2' : 'right-0 transform translate-x-1/2'
        }`}
        aria-label={
          isCollapsed
            ? isRtl
              ? 'توسيع القائمة'
              : 'Expand sidebar'
            : isRtl
              ? 'طي القائمة'
              : 'Collapse sidebar'
        }
      >
        {isCollapsed ? (
          isRtl ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )
        ) : isRtl ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* User Mini Profile Header */}
      <div
        className={`flex items-center gap-3 p-2.5 border-b border-border/40 mb-4 bg-muted/20 rounded-xl overflow-hidden ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <Avatar
          src={user?.avatarUrl}
          fallbackText={user?.firstName || 'User'}
          className="h-10 w-10 border border-gold/15 shrink-0"
        />
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 transition-opacity duration-300">
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
        )}
      </div>

      {/* Navigation menu list links */}
      <nav className="flex-1 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive =
            item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 py-3 rounded-xl transition-all ${
                isCollapsed ? 'justify-center px-0' : 'px-4'
              } ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/5 font-bold border border-gold/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
              }`}
              title={isCollapsed ? t(item.labelKey) : undefined}
            >
              {getIcon(
                item.iconName,
                isActive
                  ? 'h-5 w-5 text-primary-foreground shrink-0'
                  : 'h-5 w-5 text-muted-foreground shrink-0'
              )}
              {!isCollapsed && <span className="truncate">{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className={`flex items-center gap-3 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all mt-4 border border-transparent hover:border-destructive/10 ${
          isCollapsed ? 'justify-center px-0' : 'px-4'
        }`}
        title={isCollapsed ? (isRtl ? 'تسجيل الخروج' : 'Logout') : undefined}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>}
      </button>
    </aside>
  );
};

export default DashboardSidebar;
