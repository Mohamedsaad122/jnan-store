import React from 'react';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/constants/roles';
import { Permission } from '@/constants/permissions';
import { hasPermission, hasRole } from '@/utils/permissions';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Verify Role match
  if (allowedRoles && !hasRole(user.role as UserRole, allowedRoles)) {
    return <>{fallback}</>;
  }

  // Verify Permission match
  if (requiredPermission && !hasPermission(user.role as UserRole, requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;
