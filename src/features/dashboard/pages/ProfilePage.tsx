import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { useLanguageStore } from '@/store/language.store';
import { useUpdateProfile } from '@/hooks/useAuthMutations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SectionHeader from '../components/SectionHeader';
import ProfileHeader from '../components/ProfileHeader';
import ProfileCard from '../components/ProfileCard';
import AvatarUploader from '../components/AvatarUploader';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const updateProfileMutation = useUpdateProfile();
  const isSaving = updateProfileMutation.isPending;
  const [avatarBase64, setAvatarBase64] = useState<string | null>(user?.avatarUrl || null);

  // Schema validation using Zod
  const profileSchema = z.object({
    firstName: z
      .string()
      .min(1, { message: isRtl ? 'الاسم الأول مطلوب' : 'First name is required' }),
    lastName: z.string().min(1, { message: isRtl ? 'اسم العائلة مطلوب' : 'Last name is required' }),
    phone: z.string().regex(/^(05\d{8}|\+9665\d{8})$/, {
      message: isRtl
        ? 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 05xxxxxxxx)'
        : 'Please enter a valid Saudi mobile number (e.g. 05xxxxxxxx)',
    }),
  });

  type ProfileFormData = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    try {
      await updateProfileMutation.mutateAsync({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        avatarUrl: avatarBase64 || undefined,
      });
    } catch {
      // Error notifications handled inside mutation hook
    }
  };

  const handleAvatarChange = (newUrl: string | null) => {
    setAvatarBase64(newUrl);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-5xl" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header */}
      <SectionHeader
        title={t('dashboard.nav.profile', 'الملف الشخصي')}
        subtitle={
          isRtl
            ? 'تحديث صورتك الرمزية ومعلوماتك الشخصية وتفاصيل الاتصال.'
            : 'Update your avatar image, personal credentials, and contact details.'
        }
      />

      {/* Top Banner Summary Card */}
      <ProfileHeader user={{ ...user, avatarUrl: avatarBase64 || undefined }} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left/Right Grid Column: Avatar control panel */}
        <div className="md:col-span-1">
          <ProfileCard
            title={isRtl ? 'الصورة الشخصية' : 'Profile Picture'}
            description={
              isRtl
                ? 'قم بتحديث صورتك الشخصية المعروضة في لوحة التحكم.'
                : 'Upload or delete your public profile picture.'
            }
          >
            <div className="py-4">
              <AvatarUploader
                currentAvatarUrl={avatarBase64 || undefined}
                userName={user.firstName}
                onAvatarChange={handleAvatarChange}
                isSaving={isSaving}
              />
            </div>
          </ProfileCard>
        </div>

        {/* Form Grid Column: Inputs */}
        <div className="md:col-span-2">
          <ProfileCard
            title={isRtl ? 'المعلومات الشخصية' : 'Personal Details'}
            description={
              isRtl
                ? 'يرجى ملء الحقول لتعديل معلومات الاتصال والاسم.'
                : 'Edit your details to update credentials and profiles.'
            }
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-tajawal">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-right">
                  <label
                    htmlFor="firstName"
                    className="text-xs font-bold text-muted-foreground select-none"
                  >
                    {isRtl ? 'الاسم الأول' : 'First Name'}
                  </label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder={isRtl ? 'الاسم الأول' : 'First name'}
                    className="text-right focus-visible:ring-gold"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-[10px] text-destructive font-semibold">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 text-right">
                  <label
                    htmlFor="lastName"
                    className="text-xs font-bold text-muted-foreground select-none"
                  >
                    {isRtl ? 'اسم العائلة' : 'Last Name'}
                  </label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder={isRtl ? 'اسم العائلة' : 'Last name'}
                    className="text-right focus-visible:ring-gold"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-[10px] text-destructive font-semibold">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-right">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-muted-foreground select-none"
                >
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted/40 cursor-not-allowed border-border/60 text-right opacity-80"
                />
                <p className="text-[10px] text-muted-foreground select-none">
                  {isRtl
                    ? 'لا يمكن تغيير البريد الإلكتروني لأنه معرف الحساب الفريد.'
                    : 'Email cannot be altered because it is the account identifier.'}
                </p>
              </div>

              <div className="space-y-1.5 text-right">
                <label
                  htmlFor="phone"
                  className="text-xs font-bold text-muted-foreground select-none"
                >
                  {isRtl ? 'رقم الجوال' : 'Phone Number'}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder={isRtl ? '٠٥xxxxxxxx' : '05xxxxxxxx'}
                  className="text-right focus-visible:ring-gold"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-[10px] text-destructive font-semibold">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4 select-none">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="text-xs font-bold px-6 bg-primary hover:bg-primary/95 text-primary-foreground transition-all focus-visible:ring-gold"
                >
                  {isSaving
                    ? isRtl
                      ? 'جاري الحفظ...'
                      : 'Saving...'
                    : isRtl
                      ? 'حفظ التعديلات'
                      : 'Save Changes'}
                </Button>
              </div>
            </form>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
