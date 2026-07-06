import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import { useChangePassword } from '@/hooks/useAuthMutations';
import Button from '@/components/ui/Button';
import SectionHeader from '../components/SectionHeader';
import SecurityCard from '../components/SecurityCard';
import SessionCard, { ActiveSession } from '../components/SessionCard';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { PasswordStrengthIndicator } from '@/features/auth/components/PasswordStrengthIndicator';

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    device: 'Windows PC (Desktop)',
    browser: 'Chrome Browser',
    ip: '192.168.1.45',
    location: 'الرياض، السعودية',
    lastActive: 'الآن نشط',
    isCurrent: true,
  },
  {
    id: 'sess-2',
    device: 'Apple iPhone 15 Pro',
    browser: 'Safari Mobile',
    ip: '185.122.90.11',
    location: 'الرياض، السعودية',
    lastActive: 'منذ ساعتين',
    isCurrent: false,
  },
  {
    id: 'sess-3',
    device: 'MacBook Air M2',
    browser: 'Safari Browser',
    ip: '91.80.201.55',
    location: 'جدة، السعودية',
    lastActive: 'قبل يومين',
    isCurrent: false,
  },
];

export const SecurityPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const changePasswordMutation = useChangePassword();
  const isUpdating = changePasswordMutation.isPending;
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);

  // Zod schema for password modification
  const passwordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, {
          message: isRtl ? 'يرجى إدخال كلمة المرور الحالية' : 'Current password is required',
        }),
      newPassword: z
        .string()
        .min(8, {
          message: isRtl
            ? 'يجب أن لا تقل كلمة المرور عن ٨ خانات'
            : 'Password must be at least 8 characters',
        })
        .regex(/[A-Z]/, {
          message: isRtl
            ? 'يجب أن تحتوي على حرف كبير واحد على الأقل'
            : 'Must include at least one uppercase letter',
        })
        .regex(/[a-z]/, {
          message: isRtl
            ? 'يجب أن تحتوي على حرف صغير واحد على الأقل'
            : 'Must include at least one lowercase letter',
        })
        .regex(/\d/, {
          message: isRtl
            ? 'يجب أن تحتوي على رقم واحد على الأقل'
            : 'Must include at least one number',
        }),
      confirmPassword: z
        .string()
        .min(1, { message: isRtl ? 'يرجى تأكيد كلمة المرور' : 'Confirm password is required' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: isRtl ? 'كلمة المرور الجديدة غير متطابقة' : 'New passwords do not match',
      path: ['confirmPassword'],
    });

  type PasswordFormData = z.infer<typeof passwordSchema>;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword', '');

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
    } catch {
      // Error is caught and toast is shown in mutation hook
    }
  };

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success(isRtl ? 'تم إنهاء الجلسة بنجاح' : 'Session terminated successfully');
  };

  const handleLogoutOtherSessions = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
    toast.success(isRtl ? 'تم تسجيل الخروج من الأجهزة الأخرى' : 'Logged out of all other sessions');
  };

  return (
    <div className="space-y-6 max-w-4xl" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header */}
      <SectionHeader
        title={t('dashboard.nav.security', 'الأمان وحماية الحساب')}
        subtitle={
          isRtl
            ? 'تحديث تفاصيل المرور ومراجعة الأجهزة النشطة والتحكم بجلسات الدخول.'
            : 'Update login credentials, inspect active device listings, and manage sessions.'
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Change Password Card */}
        <SecurityCard
          title={isRtl ? 'تحديث كلمة المرور' : 'Change Password'}
          description={
            isRtl
              ? 'يرجى إدخال كلمة المرور الحالية ثم كتابة كلمة المرور الجديدة وتأكيدها.'
              : 'Update your login password regularly to maintain account security.'
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-tajawal text-right">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="currentPassword"
                className="text-xs font-bold text-muted-foreground select-none"
              >
                {isRtl ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <PasswordField
                id="currentPassword"
                {...register('currentPassword')}
                placeholder="••••••••"
                className="text-right font-sans focus-visible:ring-gold"
                aria-invalid={!!errors.currentPassword}
              />
              {errors.currentPassword && (
                <p className="text-[10px] text-destructive font-semibold">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="newPassword"
                className="text-xs font-bold text-muted-foreground select-none"
              >
                {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <PasswordField
                id="newPassword"
                {...register('newPassword')}
                placeholder="••••••••"
                className="text-right font-sans focus-visible:ring-gold"
                aria-invalid={!!errors.newPassword}
              />
              {errors.newPassword && (
                <p className="text-[10px] text-destructive font-semibold">
                  {errors.newPassword.message}
                </p>
              )}
              {/* Dynamic strength indicator */}
              <PasswordStrengthIndicator password={newPasswordValue} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-bold text-muted-foreground select-none"
              >
                {isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <PasswordField
                id="confirmPassword"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="text-right font-sans focus-visible:ring-gold"
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-destructive font-semibold">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4 select-none">
              <Button
                type="submit"
                disabled={isUpdating}
                className="text-xs font-bold px-6 bg-primary text-primary-foreground focus-visible:ring-gold hover:bg-primary/95"
              >
                {isUpdating
                  ? isRtl
                    ? 'جاري الحفظ...'
                    : 'Saving...'
                  : isRtl
                    ? 'حفظ التعديلات'
                    : 'Save Changes'}
              </Button>
            </div>
          </form>
        </SecurityCard>

        {/* Active Sessions Card */}
        <SecurityCard
          title={isRtl ? 'الأجهزة المتصلة بالحساب' : 'Active Sessions'}
          description={
            isRtl
              ? 'قائمة بالأجهزة التي قامت بتسجيل الدخول إلى حسابك مؤخراً.'
              : 'Inspect and terminate sessions on other browsers or mobile phones.'
          }
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {sessions.map((sess) => (
                <SessionCard
                  key={sess.id}
                  session={sess}
                  onRevoke={handleRevokeSession}
                  isRtl={isRtl}
                />
              ))}
            </div>

            {sessions.length > 1 && (
              <div className="border-t border-border/10 pt-4 mt-4 select-none flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogoutOtherSessions}
                  className="text-xs font-bold text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/30 focus-visible:ring-destructive/30"
                >
                  <ShieldAlert className="h-4 w-4 mx-1" />
                  <span>{isRtl ? 'تسجيل الخروج من بقية الأجهزة' : 'Logout Other Sessions'}</span>
                </Button>
              </div>
            )}
          </div>
        </SecurityCard>
      </div>
    </div>
  );
};

export default SecurityPage;
