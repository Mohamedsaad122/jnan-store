import { LoginCredentials, RegisterCredentials, AuthResponse, UserProfile } from '../types/auth';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  verifyAccount(token: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  getProfile(): Promise<UserProfile>;
  logout(): Promise<void>;
}
export default IAuthService;
