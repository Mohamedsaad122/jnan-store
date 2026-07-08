import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  AuthTokens,
} from '@/features/auth/types';
import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';
import { MOCK_USERS_DB, MOCK_OTP_REGISTRY, MOCK_PENDING_REGISTRATIONS } from './auth.mock';
import authMapper from './auth.mapper';

/**
 * Service to manage authentication flows, token refreshes, registration requests,
 * and profile retrieval. Supports switching between Mock and Real APIs.
 */
export const authService = {
  /**
   * Login request validation
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (!featureFlags.enableMockApi) {
      return request.post<AuthResponse>('/auth/login', credentials);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const matched = MOCK_USERS_DB.find(
      (u) => u.user.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (!matched || matched.passwordHash !== credentials.password) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const tokens: AuthTokens = {
      accessToken: `mock-at-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      refreshToken: `mock-rt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    return authMapper.mapToAuthResponse(matched.user, tokens);
  },

  /**
   * Register a pending user account and sends verification OTP code
   */
  async register(data: RegisterRequest): Promise<{ email: string; message: string }> {
    if (!featureFlags.enableMockApi) {
      return request.post<{ email: string; message: string }>('/auth/register', data);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const emailExists = MOCK_USERS_DB.some(
      (u) => u.user.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailExists) {
      throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
    }

    // Save registration payload temporarily
    const tempUser: Omit<User, 'id' | 'createdAt'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: 'user',
      permissions: ['read:products', 'write:reviews'],
    };

    MOCK_PENDING_REGISTRATIONS.set(data.email.toLowerCase(), tempUser);

    // Seed verification OTP code (Always '123456' for simple testing)
    MOCK_OTP_REGISTRY.set(data.email.toLowerCase(), {
      code: '123456',
      expiresAt: Date.now() + 1000 * 60 * 5, // 5 minutes
    });

    return {
      email: data.email,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح (استخدم الرمز: 123456)',
    };
  },

  /**
   * Verify registration OTP and creates the account
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    if (!featureFlags.enableMockApi) {
      return request.post<AuthResponse>('/auth/verify-otp', data);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const email = data.email.toLowerCase();
    const storedOtp = MOCK_OTP_REGISTRY.get(email);

    if (!storedOtp || storedOtp.code !== data.otpCode || storedOtp.expiresAt < Date.now()) {
      throw new Error('رمز التحقق غير صحيح أو انتهت صلاحيته');
    }

    // Check if it is a pending registration
    const pending = MOCK_PENDING_REGISTRATIONS.get(email);
    if (!pending) {
      // If not pending registration, it is just general OTP validation (e.g. for reset password)
      MOCK_OTP_REGISTRY.delete(email);

      const existingUser = MOCK_USERS_DB.find((u) => u.user.email.toLowerCase() === email);
      if (!existingUser) {
        throw new Error('لم يتم العثور على مستخدم مسجل بهذا البريد');
      }

      const tokens: AuthTokens = {
        accessToken: `mock-at-${Date.now()}`,
        refreshToken: `mock-rt-${Date.now()}`,
      };

      return authMapper.mapToAuthResponse(existingUser.user, tokens);
    }

    // Create and save new user record
    const newUser: User = {
      ...pending,
      id: `usr-${Date.now()}`,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${pending.firstName}`,
      createdAt: new Date().toISOString(),
    };

    MOCK_USERS_DB.push({
      user: newUser,
      passwordHash: 'User123!', // Default fallback password for mock registration
    });

    // Cleanup registries
    MOCK_OTP_REGISTRY.delete(email);
    MOCK_PENDING_REGISTRATIONS.delete(email);

    const tokens: AuthTokens = {
      accessToken: `mock-at-${Date.now()}`,
      refreshToken: `mock-rt-${Date.now()}`,
    };

    return authMapper.mapToAuthResponse(newUser, tokens);
  },

  /**
   * Triggers forgot password OTP code
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ email: string; message: string }> {
    if (!featureFlags.enableMockApi) {
      return request.post<{ email: string; message: string }>('/auth/forgot-password', data);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const email = data.email.toLowerCase();
    const userExists = MOCK_USERS_DB.some((u) => u.user.email.toLowerCase() === email);

    if (!userExists) {
      throw new Error('لم يتم العثور على حساب مسجل بهذا البريد الإلكتروني');
    }

    // Code is always '123456' for simple demo testing
    MOCK_OTP_REGISTRY.set(email, {
      code: '123456',
      expiresAt: Date.now() + 1000 * 60 * 5, // 5 minutes
    });

    return {
      email,
      message: 'تم إرسال رمز إعادة التعيين بنجاح (استخدم الرمز: 123456)',
    };
  },

  /**
   * Resets password using OTP code
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    if (!featureFlags.enableMockApi) {
      return request.post<void>('/auth/reset-password', data);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const email = data.email.toLowerCase();
    const storedOtp = MOCK_OTP_REGISTRY.get(email);

    if (!storedOtp || storedOtp.code !== data.otpCode || storedOtp.expiresAt < Date.now()) {
      throw new Error('رمز التحقق غير صحيح أو انتهت صلاحيته');
    }

    const matched = MOCK_USERS_DB.find((u) => u.user.email.toLowerCase() === email);
    if (!matched) {
      throw new Error('لم يتم العثور على الحساب');
    }

    // Update password hash
    matched.passwordHash = data.password || 'User123!';
    MOCK_OTP_REGISTRY.delete(email);
  },

  /**
   * Mock refresh token session
   */
  async refreshToken(token: string): Promise<AuthTokens> {
    if (!featureFlags.enableMockApi) {
      return request.post<AuthTokens>('/auth/refresh-token', { token });
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!token) throw new Error('Refresh token is required');
    return {
      accessToken: `mock-at-${Date.now()}`,
      refreshToken: `mock-rt-${Date.now()}`,
    };
  },

  /**
   * Fetch current authenticated user profile
   */
  async getCurrentUser(token: string): Promise<User> {
    if (!featureFlags.enableMockApi) {
      return request.get<User>('/auth/me');
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!token) throw new Error('Unauthenticated');
    // For mock, return the standard user or decode token
    return MOCK_USERS_DB[0].user;
  },

  /**
   * Mock logout trigger
   */
  async logout(): Promise<void> {
    if (!featureFlags.enableMockApi) {
      return request.post<void>('/auth/logout');
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  },

  /**
   * Updates current user profile details
   */
  async updateProfile(profileData: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    country?: string;
    city?: string;
    address?: string;
    dob?: string;
  }): Promise<User> {
    if (!featureFlags.enableMockApi) {
      return request.put<User>('/auth/profile', profileData);
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    const matched = MOCK_USERS_DB[0];
    matched.user = {
      ...matched.user,
      ...profileData,
    };
    return matched.user;
  },

  /**
   * Changes authenticated user account password
   */
  async changePassword(passwordData: {
    currentPassword?: string;
    newPassword?: string;
  }): Promise<void> {
    if (!featureFlags.enableMockApi) {
      await request.post<void>('/auth/change-password', passwordData);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export default authService;
