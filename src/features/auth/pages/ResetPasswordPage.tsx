import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { resetPasswordSchema } from '../schemas/authSchemas';
import { authService } from '@/services/auth/auth.service';
import PasswordField from '../components/PasswordField';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import OTPInput from '../components/OTPInput';
import Button from '@/components/ui/Button';
import ROUTES from '@/constants/routes';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otpCode: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (!email) {
      toast.error('البريد الإلكتروني مفقود. يرجى البدء من صفحة نسيان كلمة المرور.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        otpCode: data.otpCode,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success('تمت إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      navigate(ROUTES.AUTH.LOGIN);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-tajawal text-right" dir="rtl">
      <div>
        <h2 className="text-xl font-black text-primary select-none">إعادة تعيين كلمة المرور</h2>
        <p className="text-xs text-muted-foreground mt-1 select-none">
          أدخل رمز التحقق المكون من ٦ أرقام المرسل إلى {email} وكلمة المرور الجديدة.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* OTP Input Controller */}
        <div className="space-y-2 select-none">
          <label className="text-xs font-bold text-muted-foreground block text-center mb-1">
            رمز التحقق
          </label>
          <Controller
            name="otpCode"
            control={control}
            render={({ field }) => (
              <OTPInput value={field.value} onChange={field.onChange} length={6} />
            )}
          />
          {errors.otpCode && (
            <p className="text-[10px] text-red-500 text-center mt-1">{errors.otpCode.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">كلمة المرور الجديدة</label>
            <PasswordField
              placeholder="••••••••"
              error={errors.password?.message}
              {...control.register('password')}
            />
          </div>
          <PasswordStrengthIndicator password={password} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground">
            تأكيد كلمة المرور الجديدة
          </label>
          <PasswordField
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...control.register('confirmPassword')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11 text-xs font-bold rounded-xl mt-6 shadow-md"
          isLoading={isLoading}
        >
          تحديث كلمة المرور
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground select-none">
        <Link to={ROUTES.AUTH.LOGIN} className="text-gold font-bold hover:underline">
          إلغاء والعودة للدخول
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
