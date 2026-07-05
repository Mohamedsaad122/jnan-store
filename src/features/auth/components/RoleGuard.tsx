import React from 'react';
import { Navigate, Link, Outlet } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/features/auth/types';
import ROUTES from '@/constants/routes';

interface RoleGuardProps {
  allowedRoles: Role[];
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const isAuthorized = role && allowedRoles.includes(role);

  if (!isAuthorized) {
    // Beautiful localized unauthorized message
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 font-tajawal select-none">
        <div className="h-16 w-16 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="text-lg md:text-xl font-black text-primary mb-2">غير مصرح لك بالدخول</h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
          عذراً، حسابك لا يملك الصلاحيات الكافية للوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا خطأ،
          يرجى التواصل مع الدعم الفني.
        </p>
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-1.5 text-xs text-gold hover:underline font-bold transition-all"
        >
          <span>العودة للصفحة الرئيسية</span>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleGuard;
