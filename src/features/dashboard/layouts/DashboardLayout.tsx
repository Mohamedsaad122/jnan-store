import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import DashboardMobileMenu from '../components/DashboardMobileMenu';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // Persists the sidebar collapse choice locally
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('jnan_sidebar_collapsed') === 'true';
  });

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('jnan_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen bg-background/50 flex flex-col font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="application"
    >
      <div className="flex flex-1 flex-row">
        {/* Reusable Collapsible Desktop Sidebar */}
        <DashboardSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onLogout={handleLogout}
        />

        {/* Responsive Content Container */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky Header containing Breadcrumbs, search & selectors */}
          <DashboardHeader
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onLogout={handleLogout}
          />

          {/* Main viewport area */}
          <main className="flex-1 p-4 md:p-6 lg:p-8" id="main-content" role="main">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Accessible Mobile Menu overlay */}
      <DashboardMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default DashboardLayout;
