export const PERMISSIONS = {
  VIEW_PRODUCTS: 'view:products',
  MANAGE_PRODUCTS: 'manage:products',
  VIEW_ORDERS: 'view:orders',
  MANAGE_ORDERS: 'manage:orders',
  VIEW_USERS: 'view:users',
  MANAGE_USERS: 'manage:users',
  ACCESS_DASHBOARD: 'access:dashboard',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export default PERMISSIONS;
