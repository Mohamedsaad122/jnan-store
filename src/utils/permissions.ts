import { UserRole } from '@/constants/roles';
import { Permission } from '@/constants/permissions';

// Defines which permissions are associated with each user role
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: ['view:products', 'view:orders'],
  merchant: ['view:products', 'view:orders', 'manage:products', 'manage:orders'],
  admin: [
    'view:products',
    'view:orders',
    'manage:products',
    'manage:orders',
    'view:users',
    'manage:users',
    'access:dashboard',
  ],
};

export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasRole = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};
export default hasPermission;
