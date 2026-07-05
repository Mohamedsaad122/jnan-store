import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { forgotPasswordSchema } from '../schemas/authSchemas';
import { authService } from '@/services/auth/auth.service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ROUTES from '@/constants/routes';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword({
        email: data.email,
      });

      toast.success(response.message || 'تم إرسال رمز التحقق!');

      // Redirect to password reset code form
      navigate(
        `${ROUTES.AUTH.RESET_PASSWORD || '/auth/reset-password'}?email=${encodeURIComponent(data.email)}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || 'حدث خطأ أثناء إرسال رمز استعادة الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-tajawal text-right" dir="rtl">
      <div>
        <h2 className="text-xl font-black text-primary select-none">استعادة الحساب</h2>
        <p className="text-xs text-muted-foreground mt-1 select-none">
          يرجى إدخال البريد الإلكتروني وسنرسل لك رمز تحقق لإعادة تعيين كلمة المرور.
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

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11 text-xs font-bold rounded-xl mt-6 shadow-md"
          isLoading={isLoading}
        >
          إرسال الرمز
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground select-none">
        <Link to={ROUTES.AUTH.LOGIN} className="text-gold font-bold hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
