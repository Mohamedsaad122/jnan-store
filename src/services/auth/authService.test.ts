import { describe, it, expect } from 'vitest';
import authService from './authService';

describe('Auth Service (API Intercept)', () => {
  it('makes a login HTTP request intercepted by MSW', async () => {
    const response = await authService.login({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(response.user.email).toBe('test@example.com');
    expect(response.token).toBe('mock-access-token');
  });

  it('handles verification tokens properly', async () => {
    // Should trigger verify and resolve successfully
    await expect(authService.verifyAccount('123456')).resolves.not.toThrow();
  });

  it('returns profile from profile API intercept', async () => {
    const profile = await authService.getProfile();
    expect(profile.email).toBe('test@example.com');
  });

  it('triggers logout request', async () => {
    await expect(authService.logout()).resolves.not.toThrow();
  });
});
