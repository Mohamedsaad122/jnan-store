import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useCompareStore } from '@/store/compare.store';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { toast } from 'react-hot-toast';
import { User, LoginRequest, RegisterRequest } from '@/features/auth/types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const loginStore = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      loginStore(data.user, data.tokens);
      localStorage.setItem('auth_token', data.tokens.accessToken);
      localStorage.setItem('auth_refresh_token', data.tokens.refreshToken);
      queryClient.setQueryData(queryKeys.auth.profile, data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      toast.success('تم تسجيل الدخول بنجاح');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل تسجيل الدخول');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      toast.success(data.message || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل إنشاء الحساب');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      logoutStore();
      try {
        useCartStore.getState().reset();
        useCompareStore.getState().clearCompare();
      } catch (err) {
        console.error('Failed to clear Zustand stores:', err);
      }
      queryClient.clear();
      toast.success('تم تسجيل الخروج بنجاح');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل تسجيل الخروج');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUserStore = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (profileData: {
      firstName: string;
      lastName: string;
      phone?: string;
      avatarUrl?: string;
      country?: string;
      city?: string;
      address?: string;
      dob?: string;
    }) => authService.updateProfile(profileData),
    // Optimistic Update
    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.profile });
      const previousProfile = queryClient.getQueryData<User>(queryKeys.auth.profile);

      if (previousProfile) {
        const optimisticProfile = { ...previousProfile, ...newProfile };
        queryClient.setQueryData(queryKeys.auth.profile, optimisticProfile);
        setUserStore(optimisticProfile);
      }

      return { previousProfile };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.auth.profile, context.previousProfile);
        setUserStore(context.previousProfile);
      }
      toast.error(error.message || 'فشل تحديث البيانات الشخصية');
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.auth.profile, updatedUser);
      setUserStore(updatedUser);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData: { currentPassword?: string; newPassword?: string }) =>
      authService.changePassword(passwordData),
    onSuccess: () => {
      toast.success('تم تغيير كلمة المرور بنجاح');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل تغيير كلمة المرور');
    },
  });
};
