import { User } from '@/features/auth/types';

export interface MockUserRecord {
  user: User;
  passwordHash: string;
}

// Global mock memory DB for user records
export const MOCK_USERS_DB: MockUserRecord[] = [
  {
    user: {
      id: 'usr-jnan-customer',
      firstName: 'عبد الله',
      lastName: 'العتيبي',
      email: 'user@jnan.com',
      phone: '0501234567',
      role: 'user',
      permissions: ['read:products', 'write:reviews'],
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Abdullah',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    },
    passwordHash: 'User123!',
  },
  {
    user: {
      id: 'usr-jnan-vendor',
      firstName: 'محمد',
      lastName: 'الجهني',
      email: 'vendor@jnan.com',
      phone: '0557654321',
      role: 'vendor',
      permissions: ['read:products', 'write:products', 'manage:orders'],
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mohammed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(), // 120 days ago
    },
    passwordHash: 'Vendor123!',
  },
  {
    user: {
      id: 'usr-jnan-admin',
      firstName: 'سارة',
      lastName: 'الخالدي',
      email: 'admin@jnan.com',
      phone: '0569876543',
      role: 'admin',
      permissions: [
        'read:products',
        'write:products',
        'delete:products',
        'manage:orders',
        'manage:users',
      ],
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year ago
    },
    passwordHash: 'Admin123!',
  },
];

// In-memory registry to track pending OTP codes per email
export const MOCK_OTP_REGISTRY = new Map<string, { code: string; expiresAt: number }>();
export const MOCK_PENDING_REGISTRATIONS = new Map<string, Omit<User, 'id' | 'createdAt'>>();
