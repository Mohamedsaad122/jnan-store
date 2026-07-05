import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { otpSchema } from '../schemas/authSchemas';
import { authService } from '@/services/auth/auth.service';
import OTPInput from '../components/OTPInput';
import Button from '@/components/ui/Button';
import ROUTES from '@/constants/routes';

export const VerifyAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const loginState = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Resend code countdown timer state
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: '',
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => {
        clearTimeout(timer);
      };
    }
    setCanResend(true);
    return;
  }, [countdown]);

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    if (!email) {
      toast.error('البريد الإلكتروني مفقود. يرجى البدء من صفحة إنشاء حساب.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOtp({
        email,
        otpCode: data.otpCode,
      });

      loginState(response.user, response.tokens);
      toast.success('تم تفعيل حسابك بنجاح! مرحباً بك في متجر جنان.');
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await authService.register({
        firstName: 'عبد الله', // mock values for resend trigger
        lastName: 'العتيبي',
        email,
        phone: '0501234567',
        termsAccepted: true,
      });
      toast.success('تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني (الرمز: 123456)');
      setCountdown(60);
      setCanResend(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || 'فشل إعادة إرسال الرمز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-tajawal text-right" dir="rtl">
      <div>
        <h2 className="text-xl font-black text-primary select-none">تفعيل الحساب</h2>
        <p className="text-xs text-muted-foreground mt-1 select-none">
          يرجى إدخال رمز التحقق المكون من ٦ أرقام الذي تم إرساله إلى {email}.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* OTP Segmented Inputs */}
        <div className="space-y-2 select-none">
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

        <div className="flex flex-col items-center justify-center pt-2 gap-2 text-xs select-none">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-gold font-bold hover:underline transition-all"
            >
              إعادة إرسال الرمز
            </button>
          ) : (
            <span className="text-muted-foreground font-sans">
              إعادة إرسال الرمز خلال {countdown} ثانية
            </span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11 text-xs font-bold rounded-xl mt-6 shadow-md"
          isLoading={isLoading}
        >
          تفعيل الحساب
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

export default VerifyAccountPage;
