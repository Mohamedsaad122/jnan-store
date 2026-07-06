import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuthMutations';

export const useAuth = () => {
  const { user, token, accessToken, refreshToken, isAuthenticated, isLoading, error } =
    useAuthStore();

  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignored: toast alerts are already handled within the mutation itself
    }
  };

  return {
    user,
    token,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading: isLoading || logoutMutation.isPending,
    error,
    logout: handleLogout,
  };
};

export default useAuth;
