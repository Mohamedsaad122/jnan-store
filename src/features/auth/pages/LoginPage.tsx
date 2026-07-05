import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { loginSchema } from '../schemas/authSchemas';
import { authService } from '@/services/auth/auth.service';
import PasswordField from '../components/PasswordField';
import SocialLoginButtons from '../components/SocialLoginButtons';
import DividerWithText from '../components/DividerWithText';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ROUTES from '@/constants/routes';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginState = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      loginState(response.user, response.tokens);
      toast.success(t('auth.login_success', { defaultValue: 'تم تسجيل الدخول بنجاح!' }));
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-tajawal text-right" dir="rtl">
      <div>
        <h2 className="text-xl font-black text-primary select-none">تسجيل الدخول</h2>
        <p className="text-xs text-muted-foreground mt-1 select-none">
          مرحباً بك مجدداً! يرجى إدخال البريد الإلكتروني وكلمة المرور للدخول.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground">البريد الإلكتروني</label>
          <Input
            type="email"
            placeholder="example@jnan.com"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="space-y-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">كلمة المرور</label>
            <PasswordField
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          <div className="flex justify-between items-center pt-1.5 select-none">
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-border text-gold focus:ring-gold bg-card transition-all"
                {...register('rememberMe')}
              />
              <span>تذكرني</span>
            </label>
            <Link
              to={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-xs text-gold hover:underline font-bold"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11 text-xs font-bold rounded-xl mt-6 shadow-md"
          isLoading={isLoading}
        >
          دخول
        </Button>
      </form>

      <DividerWithText>أو الدخول بواسطة</DividerWithText>
      <SocialLoginButtons />

      <div className="text-center pt-2 text-xs text-muted-foreground select-none">
        <span>ليس لديك حساب؟ </span>
        <Link to={ROUTES.AUTH.REGISTER} className="text-gold font-bold hover:underline">
          إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
