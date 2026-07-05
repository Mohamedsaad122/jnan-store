import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/store/language.store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SectionTitle from '../components/SectionTitle';
import { toast } from 'react-hot-toast';

export const SecurityPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(isRtl ? 'يرجى تعبئة جميع الحقول مطلوبة' : 'Please fill all password fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        isRtl
          ? 'يجب أن لا تقل كلمة المرور الجديدة عن ٦ خانات'
          : 'New password must be at least 6 characters'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(isRtl ? 'كلمة المرور الجديدة غير متطابقة' : 'Passwords do not match');
      return;
    }

    setIsUpdating(true);
    // Simulate API validation & update
    setTimeout(() => {
      setIsUpdating(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(isRtl ? 'تم تحديث كلمة المرور بنجاح' : 'Password changed successfully');
    }, 500);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <SectionTitle
        title={t('dashboard.nav.security')}
        subtitle={
          isRtl
            ? 'تحديث كلمة المرور الخاصة بك وحماية حسابك الشخصي.'
            : 'Update your login password and manage credentials security.'
        }
      />

      <Card className="max-w-2xl p-6 border-border/40 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-right">
            <label
              htmlFor="currentPass"
              className="text-xs font-bold text-muted-foreground select-none"
            >
              {isRtl ? 'كلمة المرور الحالية' : 'Current Password'}
            </label>
            <Input
              id="currentPass"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="text-right font-sans"
            />
          </div>

          <div className="space-y-1.5 text-right">
            <label
              htmlFor="newPass"
              className="text-xs font-bold text-muted-foreground select-none"
            >
              {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
            </label>
            <Input
              id="newPass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="text-right font-sans"
            />
          </div>

          <div className="space-y-1.5 text-right">
            <label
              htmlFor="confirmPass"
              className="text-xs font-bold text-muted-foreground select-none"
            >
              {isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
            </label>
            <Input
              id="confirmPass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="text-right font-sans"
            />
          </div>

          <div className="flex justify-end pt-4 select-none">
            <Button
              type="submit"
              disabled={isUpdating}
              className="text-xs font-bold px-6 bg-primary hover:bg-primary/95 text-primary-foreground transition-all"
            >
              {isUpdating
                ? isRtl
                  ? 'جاري التحديث...'
                  : 'Updating...'
                : isRtl
                  ? 'تحديث كلمة المرور'
                  : 'Update Password'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SecurityPage;
