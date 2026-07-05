import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import DashboardBreadcrumbs from './DashboardBreadcrumbs';
import ThemeSwitcher from '@/components/global/ThemeSwitcher';
import LanguageSwitcher from '@/components/global/LanguageSwitcher';
import Avatar from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropdownMenu';

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenMobileMenu, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border/20 bg-background/80 backdrop-blur-md px-4 py-4 md:px-6 flex items-center justify-between gap-4 select-none"
      role="banner"
    >
      {/* Route Location Indicator & Mobile Burger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border bg-card/75 hover:bg-card shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={isRtl ? 'افتح القائمة' : 'Open menu'}
        >
          <Menu className="h-5 w-5" />
        </button>
        <DashboardBreadcrumbs />
      </div>

      {/* Global Controls & Account Actions */}
      <div className="flex items-center gap-3">
        {/* Search Box Helper Placeholder */}
        <div
          className="relative max-w-[12rem] lg:max-w-[15rem] w-full hidden sm:block"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <Search
            className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/80 pointer-events-none ${
              isRtl ? 'right-3' : 'left-3'
            }`}
          />
          <input
            type="text"
            placeholder={isRtl ? 'بحث...' : 'Search...'}
            className={`w-full h-10 rounded-xl border border-border/40 bg-card/50 px-3 text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 hover:border-border transition-all ${
              isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
            }`}
            aria-label={isRtl ? 'بحث في لوحة التحكم' : 'Search dashboard'}
          />
        </div>

        <ThemeSwitcher />
        <LanguageSwitcher />

        {/* Alerts placeholder button */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-card/60 hover:bg-card shadow-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
          aria-label={isRtl ? 'التنبيهات' : 'Notifications'}
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-gold" />
        </button>

        {/* Profile Avatar menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              className="flex items-center justify-center focus:outline-none rounded-full"
              aria-label={isRtl ? 'قائمة الحساب' : 'User account menu'}
            >
              <Avatar
                src={user?.avatarUrl}
                fallbackText={user?.firstName || 'U'}
                className="h-10 w-10 border border-gold/15 cursor-pointer shadow-xs hover:border-gold/30 transition-all"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={
              isRtl ? 'right-0 origin-top-right left-auto' : 'left-0 origin-top-left right-auto'
            }
          >
            <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
              <User className="h-4 w-4 ml-2 mr-0 text-muted-foreground" />
              <span className="text-right w-full">
                {t('dashboard.nav.profile', 'الملف الشخصي')}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              <Settings className="h-4 w-4 ml-2 mr-0 text-muted-foreground" />
              <span className="text-right w-full">{t('dashboard.nav.settings', 'الإعدادات')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onLogout}
              className="text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 ml-2 mr-0" />
              <span className="text-right w-full">{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
