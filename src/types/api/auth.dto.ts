import { Role, Permission } from '@/features/auth/types';

export interface UserDto {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role_code: Role;
  scopes: Permission[];
  avatar_url?: string;
  created_at: string;
}

export interface AuthTokensDto {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponseDto {
  user: UserDto;
  tokens: AuthTokensDto;
}
