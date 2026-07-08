export type Role = 'user' | 'vendor' | 'admin';

export type Permission =
  | 'read:products'
  | 'write:products'
  | 'delete:products'
  | 'manage:orders'
  | 'manage:users'
  | 'write:reviews';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  permissions: Permission[];
  avatarUrl?: string;
  createdAt: string;
  country?: string;
  city?: string;
  address?: string;
  dob?: string;
  isEmailVerified?: boolean;
  accountStatus?: 'active' | 'suspended' | 'pending';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
  expiresAt: number; // UTC timestamp in milliseconds
}

export interface LoginRequest {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  password?: string;
  confirmPassword?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
