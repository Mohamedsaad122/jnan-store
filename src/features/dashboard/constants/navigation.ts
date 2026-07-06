import { DashboardMenuItem } from '../types';

export const DASHBOARD_NAV_ITEMS: DashboardMenuItem[] = [
  {
    id: 'overview',
    labelKey: 'dashboard.nav.overview',
    path: '/dashboard',
    iconName: 'LayoutDashboard',
    roles: ['user', 'vendor', 'admin'],
  },
  {
    id: 'profile',
    labelKey: 'dashboard.nav.profile',
    path: '/dashboard/profile',
    iconName: 'User',
    roles: ['user', 'vendor', 'admin'],
  },
  {
    id: 'addresses',
    labelKey: 'dashboard.nav.addresses',
    path: '/dashboard/addresses',
    iconName: 'MapPin',
    roles: ['user'],
  },
  {
    id: 'orders',
    labelKey: 'dashboard.nav.orders',
    path: '/dashboard/orders',
    iconName: 'ShoppingBag',
    roles: ['user'],
  },
  {
    id: 'wishlist',
    labelKey: 'dashboard.nav.wishlist',
    path: '/dashboard/wishlist',
    iconName: 'Heart',
    roles: ['user'],
  },
  {
    id: 'notifications',
    labelKey: 'dashboard.nav.notifications',
    path: '/dashboard/notifications',
    iconName: 'Bell',
    roles: ['user', 'vendor', 'admin'],
  },
  {
    id: 'security',
    labelKey: 'dashboard.nav.security',
    path: '/dashboard/security',
    iconName: 'ShieldAlert',
    roles: ['user', 'vendor', 'admin'],
  },
  {
    id: 'settings',
    labelKey: 'dashboard.nav.settings',
    path: '/dashboard/settings',
    iconName: 'Settings',
    roles: ['user', 'vendor', 'admin'],
  },
];
