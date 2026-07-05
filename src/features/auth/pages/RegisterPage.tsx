import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { registerSchema } from '../schemas/authSchemas';
import { authService } from '@/services/auth/auth.service';
import PasswordField from '../components/PasswordField';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ROUTES from '@/constants/routes';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  // Watch password field to update strength indicator dynamically
  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    try {
      const response = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        termsAccepted: data.termsAccepted,
      });

      toast.success(response.message || 'تم إرسال رمز التحقق بنجاح!');

      // Redirect to email OTP verification page, passing email as query param
      navigate(`${ROUTES.AUTH.VERIFY || '/auth/verify'}?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-tajawal text-right" dir="rtl">
      <div>
        <h2 className="text-xl font-black text-primary select-none">إنشاء حساب جديد</h2>
        <p className="text-xs text-muted-foreground mt-1 select-none">
          أهلاً بك! انضم لعائلة جنان واستمتع بتجربة تسوق متكاملة.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">الاسم الأول</label>
            <Input
              type="text"
              placeholder="عبدالله"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">الاسم الأخير</label>
            <Input
              type="text"
              placeholder="العتيبي"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground">رقم الجوال (السعودية)</label>
          <Input
            type="tel"
            placeholder="0501234567"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register('phone')}
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
          <PasswordStrengthIndicator password={password} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground">تأكيد كلمة المرور</label>
          <PasswordField
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div className="select-none py-1">
          <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer leading-snug">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-border text-gold focus:ring-gold bg-card transition-all mt-0.5"
              {...register('termsAccepted')}
            />
            <span>
              أوافق على{' '}
              <Link to="/terms" className="text-gold font-bold hover:underline">
                الشروط والأحكام
              </Link>{' '}
              و{' '}
              <Link to="/privacy" className="text-gold font-bold hover:underline">
                سياسة الخصوصية
              </Link>{' '}
              لمتجر جنان.
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="text-[10px] text-red-500 mt-1">{errors.termsAccepted.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11 text-xs font-bold rounded-xl mt-4 shadow-md"
          isLoading={isLoading}
        >
          إنشاء حساب
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground select-none">
        <span>لديك حساب بالفعل؟ </span>
        <Link to={ROUTES.AUTH.LOGIN} className="text-gold font-bold hover:underline">
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
