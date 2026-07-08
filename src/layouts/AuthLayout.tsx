import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logo from '@/components/global/Logo';
import { ROUTES } from '@/constants/routes';
import { ArrowLeft } from 'lucide-react';
import { featureFlags } from '@/config/featureFlags';

export const AuthLayout: React.FC = () => {
  const isMock = featureFlags.enableMockApi;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 transition-theme relative">
      {/* Return back home link */}
      <div className="absolute top-6 right-6 font-tajawal text-xs font-semibold">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-gold transition-colors"
        >
          <span>العودة للرئيسية</span>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isMock && (
        <div className="absolute top-6 left-6 font-tajawal text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20 select-none animate-pulse">
          وضع التجربة | Demo Mode
        </div>
      )}

      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-md">
        <div className="text-center flex flex-col items-center">
          <Logo className="mb-4" />
          <p className="text-xs text-muted-foreground font-tajawal">
            متجر القهوة السعودية الفاخرة والمكسرات المحمصة الطازجة
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
