import { User, AuthResponse, AuthTokens, Role, Permission } from '@/features/auth/types';

interface RawUserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  permissions?: Permission[];
  avatarUrl?: string;
  createdAt?: string;
}

export const authMapper = {
  /**
   * Maps user details to strict domain model User
   */
  mapToUser(rawUser: RawUserPayload): User {
    return {
      id: rawUser.id,
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
      email: rawUser.email,
      phone: rawUser.phone,
      role: rawUser.role,
      permissions: rawUser.permissions || [],
      avatarUrl: rawUser.avatarUrl,
      createdAt: rawUser.createdAt || new Date().toISOString(),
    };
  },

  /**
   * Constructs a typed AuthResponse payload
   */
  mapToAuthResponse(user: User, tokens: AuthTokens): AuthResponse {
    return {
      user: this.mapToUser(user),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  },
};

export default authMapper;
