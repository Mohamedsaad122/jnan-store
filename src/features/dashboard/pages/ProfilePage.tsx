import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { useLanguageStore } from '@/store/language.store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SectionTitle from '../components/SectionTitle';
import { toast } from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!firstName.trim() || !lastName.trim()) {
      toast.error(
        isRtl ? 'يرجى إدخال الاسم الأول واسم العائلة' : 'First and Last name are required'
      );
      return;
    }

    setIsSaving(true);
    // Simulate API roundtrip
    setTimeout(() => {
      setUser({
        ...user,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      setIsSaving(false);
      toast.success(isRtl ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
    }, 400);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <SectionTitle
        title={t('dashboard.nav.profile')}
        subtitle={
          isRtl
            ? 'إدارة معلومات حسابك الشخصي وتحديث بيانات الاتصال الخاصة بك.'
            : 'Manage your personal account profile and update your contact information.'
        }
      />

      <Card className="max-w-2xl p-6 border-border/40 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={isRtl ? 'الاسم الأول' : 'First name'}
                className="text-right"
              />
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={isRtl ? 'اسم العائلة' : 'Last name'}
                className="text-right"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label htmlFor="email" className="text-xs font-bold text-muted-foreground select-none">
              {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted/40 cursor-not-allowed border-border/60 text-right opacity-80"
            />
            <p className="text-[10px] text-muted-foreground select-none">
              {isRtl
                ? 'لا يمكن تغيير البريد الإلكتروني لأنه معرف تسجيل الدخول الخاص بك.'
                : 'Email address cannot be changed as it is your unique login key.'}
            </p>
          </div>

          <div className="space-y-1.5 text-right">
            <label htmlFor="phone" className="text-xs font-bold text-muted-foreground select-none">
              {isRtl ? 'رقم الجوال' : 'Phone Number'}
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={isRtl ? '٠٥xxxxxxxx' : '05xxxxxxxx'}
              className="text-right"
            />
          </div>

          <div className="space-y-1.5 text-right">
            <label htmlFor="role" className="text-xs font-bold text-muted-foreground select-none">
              {isRtl ? 'نوع الحساب' : 'Account Type'}
            </label>
            <Input
              id="role"
              value={user?.role?.toUpperCase() || ''}
              disabled
              className="bg-muted/40 cursor-not-allowed border-border/60 text-right opacity-80"
            />
          </div>

          <div className="flex justify-end pt-4 select-none">
            <Button
              type="submit"
              disabled={isSaving}
              className="text-xs font-bold px-6 bg-primary hover:bg-primary/95 text-primary-foreground transition-all"
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
      </Card>
    </div>
  );
};

export default ProfilePage;
