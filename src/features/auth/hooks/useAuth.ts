import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth/auth.service';

export const useAuth = () => {
  const {
    user,
    token,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    logout: storeLogout,
    setLoading,
    setError,
  } = useAuthStore();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      // Purge stored local variables
      localStorage.removeItem('auth_token');
      storeLogout();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'فشل تسجيل الخروج');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    logout: handleLogout,
  };
};

export default useAuth;
