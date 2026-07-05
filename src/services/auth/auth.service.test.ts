import { describe, it, expect, beforeEach } from 'vitest';
import authService from './auth.service';
import { MOCK_USERS_DB, MOCK_OTP_REGISTRY, MOCK_PENDING_REGISTRATIONS } from './auth.mock';

describe('Auth Service (Mock)', () => {
  beforeEach(() => {
    // Reset databases to initial seeds
    MOCK_USERS_DB.length = 0;
    MOCK_USERS_DB.push({
      user: {
        id: 'usr-default',
        firstName: 'محمد',
        lastName: 'سعد',
        email: 'test@example.com',
        phone: '0501234567',
        role: 'user',
        permissions: ['read:products', 'write:reviews'],
        createdAt: new Date().toISOString(),
      },
      passwordHash: 'Password123!',
    });
    MOCK_OTP_REGISTRY.clear();
    MOCK_PENDING_REGISTRATIONS.clear();
  });

  it('authenticates user with correct credentials', async () => {
    const response = await authService.login({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(response.user.email).toBe('test@example.com');
    expect(response.tokens.accessToken).toBeDefined();
  });

  it('throws error for invalid email login', async () => {
    await expect(
      authService.login({
        email: 'wrong@example.com',
        password: 'Password123!',
      })
    ).rejects.toThrow();
  });

  it('triggers user registration and sets OTP verification registry', async () => {
    const response = await authService.register({
      firstName: 'خالد',
      lastName: 'أحمد',
      email: 'newuser@example.com',
      phone: '0555555555',
      termsAccepted: true,
    });

    expect(response.email).toBe('newuser@example.com');
    expect(MOCK_OTP_REGISTRY.has('newuser@example.com')).toBe(true);
    expect(MOCK_OTP_REGISTRY.get('newuser@example.com')?.code).toBe('123456');
  });

  it('validates OTP and activates user account on successful verifyOtp', async () => {
    // 1. Stage a pending registration
    await authService.register({
      firstName: 'خالد',
      lastName: 'أحمد',
      email: 'newuser@example.com',
      phone: '0555555555',
      termsAccepted: true,
    });

    // 2. Validate OTP
    const session = await authService.verifyOtp({
      email: 'newuser@example.com',
      otpCode: '123456',
    });

    expect(session.user.email).toBe('newuser@example.com');
    expect(session.user.firstName).toBe('خالد');
    expect(MOCK_USERS_DB.some((u) => u.user.email === 'newuser@example.com')).toBe(true);
  });

  it('throws error on wrong OTP input', async () => {
    await authService.register({
      firstName: 'خالد',
      lastName: 'أحمد',
      email: 'newuser@example.com',
      phone: '0555555555',
      termsAccepted: true,
    });

    await expect(
      authService.verifyOtp({
        email: 'newuser@example.com',
        otpCode: '999999',
      })
    ).rejects.toThrow();
  });
});
