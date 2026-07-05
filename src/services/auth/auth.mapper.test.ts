import { describe, it, expect } from 'vitest';
import authMapper from './auth.mapper';

describe('Auth Mapper', () => {
  it('maps raw user details into a User domain model correctly', () => {
    const rawUser = {
      id: 'usr-1',
      firstName: 'أحمد',
      lastName: 'علي',
      email: 'ahmad@example.com',
      role: 'user' as const,
      permissions: ['read:products' as const],
      avatarUrl: '/avatars/1.jpg',
    };

    const user = authMapper.mapToUser(rawUser);

    expect(user.id).toBe('usr-1');
    expect(user.firstName).toBe('أحمد');
    expect(user.lastName).toBe('علي');
    expect(user.email).toBe('ahmad@example.com');
    expect(user.role).toBe('user');
    expect(user.permissions).toContain('read:products');
    expect(user.createdAt).toBeDefined();
  });

  it('supplements default permissions if none are specified in the raw user payload', () => {
    const rawUser = {
      id: 'usr-2',
      firstName: 'أحمد',
      lastName: 'علي',
      email: 'ahmad@example.com',
      role: 'user' as const,
    };

    const user = authMapper.mapToUser(rawUser);
    expect(user.permissions).toEqual([]);
  });

  it('constructs a typed AuthResponse payload matching tokens and profiles', () => {
    const userDomain = {
      id: 'usr-3',
      firstName: 'سارة',
      lastName: 'أحمد',
      email: 'sara@example.com',
      role: 'user' as const,
      permissions: [],
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    const tokens = {
      accessToken: 'at-123',
      refreshToken: 'rt-123',
    };

    const authResponse = authMapper.mapToAuthResponse(userDomain, tokens);

    expect(authResponse.user).toEqual(userDomain);
    expect(authResponse.tokens.accessToken).toBe('at-123');
    expect(authResponse.tokens.refreshToken).toBe('rt-123');
  });
});
