import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role, Permission, AuthTokens } from '@/features/auth/types';

interface AuthState {
  user: User | null;
  token: string | null; // Backward-compatible alias for accessToken
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: Role | null;
  permissions: Permission[];

  // Actions
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  refreshSession: (tokens: AuthTokens) => void;
  setUser: (user: User | null) => void;
  clearSession: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  token: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  role: null,
  permissions: [],
};

/**
 * Global Zustand store managing user authentication state, tokens, loading flags,
 * errors, session updates, and permissions.
 * Persists session data selectively to local storage.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      login: (user, tokens) =>
        set({
          user,
          token: tokens.accessToken,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
          role: user.role,
          permissions: user.permissions,
          error: null,
        }),

      logout: () => set(initialState),

      refreshSession: (tokens) =>
        set({
          token: tokens.accessToken,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),

      setUser: (user) =>
        set({
          user,
          role: user ? user.role : null,
          permissions: user ? user.permissions : [],
        }),

      clearSession: () => set(initialState),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: 'jnan-auth-storage',
      // Only persist values that are appropriate
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        permissions: state.permissions,
      }),
    }
  )
);

export default useAuthStore;
