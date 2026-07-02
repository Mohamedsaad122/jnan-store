export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MERCHANT: 'merchant',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export default ROLES;
