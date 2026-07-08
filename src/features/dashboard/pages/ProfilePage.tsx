import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  AlertCircle,
  Edit2,
  X,
  Save,
  Calendar,
  Globe,
  MapPin,
  User,
  Mail,
  Phone,
} from 'lucide-react';
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
  const [isEditMode, setIsEditMode] = useState(false);

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
    country: z.string().min(1, { message: isRtl ? 'الدولة مطلوبة' : 'Country is required' }),
    city: z.string().min(1, { message: isRtl ? 'المدينة مطلوبة' : 'City is required' }),
    address: z.string().min(1, { message: isRtl ? 'العنوان مطلوب' : 'Address is required' }),
    dob: z
      .string()
      .min(1, { message: isRtl ? 'تاريخ الميلاد مطلوب' : 'Date of birth is required' }),
  });

  type ProfileFormData = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      country: user?.country || 'المملكة العربية السعودية',
      city: user?.city || '',
      address: user?.address || '',
      dob: user?.dob || '',
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
        country: data.country.trim(),
        city: data.city.trim(),
        address: data.address.trim(),
        dob: data.dob,
      });
      setIsEditMode(false);
    } catch {
      // Error notifications handled inside mutation hook
    }
  };

  const handleAvatarChange = (newUrl: string | null) => {
    setAvatarBase64(newUrl);
  };

  const handleCancel = () => {
    reset();
    setAvatarBase64(user?.avatarUrl || null);
    setIsEditMode(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-5xl text-right font-tajawal" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header */}
      <SectionHeader
        title={t('dashboard.nav.profile', 'الملف الشخصي')}
        subtitle={
          isRtl
            ? 'إدارة معلومات حسابك الشخصي وعنوانك وصورتك الرمزية.'
            : 'Manage your profile credentials, locations, and personal avatar.'
        }
      />

      {/* Top Banner Summary Card */}
      <ProfileHeader user={{ ...user, avatarUrl: avatarBase64 || undefined }} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Avatar & Account Meta status summary */}
        <div className="md:col-span-1 space-y-6">
          <ProfileCard
            title={isRtl ? 'الصورة الشخصية' : 'Profile Picture'}
            description={
              isRtl
                ? 'تحديث صورتك الشخصية المعروضة في لوحة التحكم.'
                : 'Upload or delete your public profile picture.'
            }
          >
            <div className="py-4 select-none">
              <AvatarUploader
                currentAvatarUrl={avatarBase64 || undefined}
                userName={user.firstName}
                onAvatarChange={handleAvatarChange}
                isSaving={isSaving}
              />
            </div>
          </ProfileCard>

          {/* Account Status Card */}
          <ProfileCard
            title={isRtl ? 'حالة الحساب' : 'Account Status'}
            description={
              isRtl
                ? 'تفاصيل توثيق الحساب والنشاط العام.'
                : 'Credentials verification log and activity status.'
            }
          >
            <div className="py-2 space-y-4 text-right">
              {/* Account status badge */}
              <div className="flex items-center justify-between border-b border-border/10 pb-3">
                <span className="text-xs text-muted-foreground">
                  {isRtl ? 'حالة العضوية' : 'Account status'}
                </span>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 select-none">
                  {isRtl ? 'نشط' : 'Active'}
                </span>
              </div>

              {/* Email verify badge */}
              <div className="flex items-center justify-between border-b border-border/10 pb-3">
                <span className="text-xs text-muted-foreground">
                  {isRtl ? 'توثيق البريد' : 'Email verified'}
                </span>
                {user.isEmailVerified !== false ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/15 select-none">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'موثق' : 'Verified'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/15 select-none">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'غير موثق' : 'Not verified'}</span>
                  </span>
                )}
              </div>

              {/* Member Since info */}
              <div className="flex items-center justify-between text-xs pt-1 select-none">
                <span className="text-muted-foreground">
                  {isRtl ? 'تاريخ الانضمام' : 'Member since'}
                </span>
                <span className="font-bold text-primary">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </ProfileCard>
        </div>

        {/* Form Grid Column: Inputs */}
        <div className="md:col-span-2">
          <ProfileCard
            title={isRtl ? 'بيانات الحساب الشخصي' : 'Personal Account Details'}
            description={
              isRtl
                ? 'يرجى مراجعة وتحديث معلومات الاتصال والاسم الخاص بك.'
                : 'Review or update your identity and contact information details.'
            }
          >
            {/* Action edit triggers */}
            {!isEditMode ? (
              <div className="space-y-6 py-2 select-text">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-border/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 justify-start">
                      <User className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{isRtl ? 'الاسم الأول' : 'First Name'}</span>
                    </span>
                    <p className="text-xs font-bold text-primary">{user.firstName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 justify-start">
                      <User className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{isRtl ? 'اسم العائلة' : 'Last Name'}</span>
                    </span>
                    <p className="text-xs font-bold text-primary">{user.lastName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-border/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 justify-start">
                      <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</span>
                    </span>
                    <p className="text-xs font-bold text-primary">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 justify-start">
                      <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{isRtl ? 'رقم الجوال' : 'Phone Number'}</span>
                    </span>
                    <p className="text-xs font-bold text-primary font-sans">{user.phone || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-border/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 justify-start">
                      <Globe className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{isRtl ? 'الدولة' : 'Country'}</span>
                    </span>
                    <p className="text-xs font-bold text-primary">
                      {user.country || 'المملكة العربية السعودية'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 justify-start">
                      <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{isRtl ? 'المدينة' : 'City'}</span>
                    </span>
                    <p className="text-xs font-bold text-primary">{user.city || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-border/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 justify-start">
                      <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{isRtl ? 'العنوان' : 'Address'}</span>
                    </span>
                    <p className="text-xs font-bold text-primary">{user.address || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 justify-start">
                      <Calendar className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{isRtl ? 'تاريخ الميلاد' : 'Date of Birth'}</span>
                    </span>
                    <p className="text-xs font-bold text-primary font-sans">
                      {user.dob ? formatDate(user.dob) : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end select-none pt-2">
                  <Button
                    onClick={() => setIsEditMode(true)}
                    className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>{isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-xs font-bold text-muted-foreground">
                      {isRtl ? 'الاسم الأول' : 'First Name'}
                    </label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      placeholder={isRtl ? 'الاسم الأول' : 'First name'}
                      className="text-right focus-visible:ring-gold"
                      error={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-[10px] text-destructive font-semibold">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-xs font-bold text-muted-foreground">
                      {isRtl ? 'اسم العائلة' : 'Last Name'}
                    </label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      placeholder={isRtl ? 'اسم العائلة' : 'Last name'}
                      className="text-right focus-visible:ring-gold"
                      error={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="text-[10px] text-destructive font-semibold">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-muted-foreground">
                      {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-muted/40 cursor-not-allowed border-border/60 text-right opacity-80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-muted-foreground">
                      {isRtl ? 'رقم الجوال' : 'Phone Number'}
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder={isRtl ? '٠٥xxxxxxxx' : '05xxxxxxxx'}
                      className="text-right focus-visible:ring-gold font-sans"
                      error={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-destructive font-semibold">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="country" className="text-xs font-bold text-muted-foreground">
                      {isRtl ? 'الدولة' : 'Country'}
                    </label>
                    <Input
                      id="country"
                      {...register('country')}
                      placeholder={isRtl ? 'الدولة' : 'Country'}
                      className="text-right focus-visible:ring-gold"
                      error={!!errors.country}
                    />
                    {errors.country && (
                      <p className="text-[10px] text-destructive font-semibold">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="city" className="text-xs font-bold text-muted-foreground">
                      {isRtl ? 'المدينة' : 'City'}
                    </label>
                    <Input
                      id="city"
                      {...register('city')}
                      placeholder={isRtl ? 'المدينة' : 'City'}
                      className="text-right focus-visible:ring-gold"
                      error={!!errors.city}
                    />
                    {errors.city && (
                      <p className="text-[10px] text-destructive font-semibold">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="address" className="text-xs font-bold text-muted-foreground">
                      {isRtl ? 'العنوان وتفاصيل الشارع' : 'Street Address'}
                    </label>
                    <Input
                      id="address"
                      {...register('address')}
                      placeholder={
                        isRtl ? 'اسم الشارع والحي ورقم المبنى' : 'Street, district, building no.'
                      }
                      className="text-right focus-visible:ring-gold"
                      error={!!errors.address}
                    />
                    {errors.address && (
                      <p className="text-[10px] text-destructive font-semibold">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="dob" className="text-xs font-bold text-muted-foreground">
                      {isRtl ? 'تاريخ الميلاد' : 'Date of Birth'}
                    </label>
                    <Input
                      id="dob"
                      type="date"
                      {...register('dob')}
                      className="text-right focus-visible:ring-gold font-sans"
                      error={!!errors.dob}
                    />
                    {errors.dob && (
                      <p className="text-[10px] text-destructive font-semibold">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 gap-3 select-none">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="text-xs font-bold px-5 border-border/60 hover:bg-muted/40 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>{isRtl ? 'إلغاء' : 'Cancel'}</span>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="text-xs font-bold px-6 bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>
                      {isSaving
                        ? isRtl
                          ? 'جاري الحفظ...'
                          : 'Saving...'
                        : isRtl
                          ? 'حفظ التعديلات'
                          : 'Save Changes'}
                    </span>
                  </Button>
                </div>
              </form>
            )}
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
