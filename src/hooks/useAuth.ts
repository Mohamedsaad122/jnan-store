import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setToken,
    setAuthenticated,
    setLoading,
    setError,
    reset,
  } = useAuthStore();

  const login = async () => {
    // Authentication login workflow placeholder
  };

  const register = async () => {
    // Account signup workflow placeholder
  };

  const logout = async () => {
    // Purge session variables
    localStorage.removeItem('auth_token');
    reset();
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
    setToken,
    setAuthenticated,
    setLoading,
    setError,
    reset,
  };
};

export default useAuth;
