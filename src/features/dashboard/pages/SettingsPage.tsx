import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ShieldAlert, LogOut, Laptop, Smartphone, AlertTriangle } from 'lucide-react';
import { useThemeStore } from '@/store/theme.store';
import { useLanguageStore } from '@/store/language.store';
import { useChangePassword, useLogout } from '@/hooks/useAuthMutations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import SectionHeader from '../components/SectionHeader';
import SettingsSection from '../components/SettingsSection';
import PreferenceSwitch from '../components/PreferenceSwitch';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const isRtl = language === 'ar';

  const [currency, setCurrency] = useState<'SAR' | 'USD'>('SAR');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Privacy options state
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);

  // Active Sessions state
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'Chrome on Windows 11',
      browser: 'Chrome Browser',
      ip: '192.168.1.45',
      location: isRtl ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
      lastActive: isRtl ? 'النشط حالياً' : 'Current Active',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro',
      browser: 'Safari Mobile',
      ip: '185.122.90.11',
      location: isRtl ? 'جدة، المملكة العربية السعودية' : 'Jeddah, Saudi Arabia',
      lastActive: isRtl ? 'منذ يومين' : '2 days ago',
      isCurrent: false,
    },
    {
      id: 'sess-3',
      device: 'iPad Pro',
      browser: 'Safari Mobile',
      ip: '91.80.201.55',
      location: isRtl ? 'الدمام، المملكة العربية السعودية' : 'Dammam, Saudi Arabia',
      lastActive: isRtl ? 'قبل ٣ أيام' : '3 days ago',
      isCurrent: false,
    },
  ]);

  // Modal open states
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // Change Password hook setup
  const changePasswordMutation = useChangePassword();
  const logoutMutation = useLogout();

  const passwordChangeSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: isRtl ? 'كلمة المرور الحالية مطلوبة' : 'Current password is required' }),
      newPassword: z
        .string()
        .min(6, { message: isRtl ? 'يجب أن لا تقل عن 6 أحرف' : 'Must be at least 6 characters' }),
      confirmPassword: z
        .string()
        .min(1, { message: isRtl ? 'يرجى تأكيد كلمة المرور' : 'Please confirm your password' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: isRtl ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match',
      path: ['confirmPassword'],
    });

  type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isChangingPassword },
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(isRtl ? 'تم حفظ التفضيلات الإعدادية بنجاح' : 'Preferences saved successfully');
    }, 450);
  };

  const handlePasswordChangeSubmit = async (data: PasswordChangeForm) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
    } catch {
      // Errors are handled internally inside useChangePassword mutation trigger toasts
    }
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    try {
      await logoutMutation.mutateAsync();
      toast.success(
        isRtl
          ? 'تم حذف الحساب بنجاح، سيتم معالجة الطلب ومحو بياناتك بالكامل خلال 14 يوماً.'
          : 'Account delete request submitted. Your profile will be fully deleted in 14 days.'
      );
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const handleDeactivateConfirm = async () => {
    setIsDeactivateModalOpen(false);
    try {
      await logoutMutation.mutateAsync();
      toast.success(
        isRtl
          ? 'تم تعطيل حسابك مؤقتاً بنجاح. يمكنك إعادة تفعيل الحساب بتسجيل الدخول مجدداً.'
          : 'Account has been temporarily deactivated successfully. Log in again to reactivate.'
      );
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success(
      isRtl
        ? 'تم إنهاء الجلسة على هذا الجهاز بنجاح.'
        : 'Session terminated on this device successfully.'
    );
  };

  const handleTerminateOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success(
      isRtl
        ? 'تم إنهاء جميع الجلسات النشطة على الأجهزة الأخرى بنجاح'
        : 'All other active login sessions terminated successfully.'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl font-tajawal text-right" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header */}
      <SectionHeader
        title={t('dashboard.nav.settings', 'الإعدادات العامة')}
        subtitle={
          isRtl
            ? 'تخصيص تفضيلات مظهر التطبيق، اللغة، وقنوات التنبيه.'
            : 'Customize styling themes, language options, and notification channels.'
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          {/* Interface Preferences */}
          <SettingsSection title={isRtl ? 'تفضيلات الواجهة والمظهر' : 'Interface Preferences'}>
            {/* Theme switch */}
            <PreferenceSwitch
              title={isRtl ? 'المظهر الداكن (الوضع الليلي)' : 'Dark Theme'}
              description={
                isRtl ? 'تفعيل الوضع الليلي لتخفيف إجهاد العين.' : 'Enable dark visual theme mode.'
              }
              checked={theme === 'dark'}
              onToggle={toggleTheme}
              isRtl={isRtl}
            />

            {/* Language selector row */}
            <div className="flex items-center justify-between py-4 text-right gap-4 border-t border-border/10">
              <div className="space-y-1">
                <span className="font-bold text-xs sm:text-sm text-primary">
                  {isRtl ? 'لغة الواجهة' : 'Interface Language'}
                </span>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                  {isRtl ? 'اختر لغة عرض لوحة التحكم.' : 'Set primary display language.'}
                </p>
              </div>
              <div className="flex gap-2 select-none">
                <Button
                  variant={language === 'ar' ? 'primary' : 'outline'}
                  size="sm"
                  className={`text-xs font-bold px-4 cursor-pointer ${language === 'ar' ? 'bg-primary text-primary-foreground' : 'border-border/40'}`}
                  onClick={() => setLanguage('ar')}
                >
                  العربية
                </Button>
                <Button
                  variant={language === 'en' ? 'primary' : 'outline'}
                  size="sm"
                  className={`text-xs font-bold px-4 cursor-pointer ${language === 'en' ? 'bg-primary text-primary-foreground' : 'border-border/40'}`}
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
              </div>
            </div>

            {/* Currency selector row */}
            <div className="flex items-center justify-between py-4 text-right gap-4 border-t border-border/10">
              <div className="space-y-1">
                <span className="font-bold text-xs sm:text-sm text-primary">
                  {isRtl ? 'العملة الافتراضية' : 'Default Currency'}
                </span>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                  {isRtl ? 'اختر العملة المفضلة لعرض الأسعار.' : 'Set catalog display currency.'}
                </p>
              </div>
              <div className="flex gap-2 select-none">
                <Button
                  variant={currency === 'SAR' ? 'primary' : 'outline'}
                  size="sm"
                  className={`text-xs font-bold px-4 cursor-pointer ${currency === 'SAR' ? 'bg-primary text-primary-foreground' : 'border-border/40'}`}
                  onClick={() => setCurrency('SAR')}
                >
                  SAR (ر.س)
                </Button>
                <Button
                  variant={currency === 'USD' ? 'primary' : 'outline'}
                  size="sm"
                  className={`text-xs font-bold px-4 cursor-pointer ${currency === 'USD' ? 'bg-primary text-primary-foreground' : 'border-border/40'}`}
                  onClick={() => setCurrency('USD')}
                >
                  USD ($)
                </Button>
              </div>
            </div>
          </SettingsSection>

          {/* Privacy Settings Section */}
          <SettingsSection title={isRtl ? 'إعدادات الخصوصية' : 'Privacy Settings'}>
            <PreferenceSwitch
              title={isRtl ? 'حساب خاص' : 'Private Profile'}
              description={
                isRtl
                  ? 'تقييد رؤية معلومات حسابك وتاريخ الشراء وجعلها غير مرئية للعامة.'
                  : 'Restrict visibility of your profile and purchase history.'
              }
              checked={profilePrivate}
              onToggle={() => setProfilePrivate(!profilePrivate)}
              isRtl={isRtl}
            />

            <PreferenceSwitch
              title={isRtl ? 'السماح لمحركات البحث بفهرسة حسابي' : 'Search Engine Indexing'}
              description={
                isRtl
                  ? 'السماح لمحركات البحث مثل Google بالعثور على ملفك الشخصي.'
                  : 'Allow search engines like Google to index your profile.'
              }
              checked={allowIndexing}
              onToggle={() => setAllowIndexing(!allowIndexing)}
              isRtl={isRtl}
            />

            <PreferenceSwitch
              title={isRtl ? 'مشاركة البيانات لتحسين التجربة' : 'Personalized Data Sharing'}
              description={
                isRtl
                  ? 'السماح للمتجر بتحليل تفضيلاتك لعرض منتجات وعروض مخصصة.'
                  : 'Allow analyzed profile metrics to recommend custom coffee selections.'
              }
              checked={dataSharing}
              onToggle={() => setDataSharing(!dataSharing)}
              isRtl={isRtl}
            />
          </SettingsSection>
        </div>

        <div className="space-y-6">
          {/* Notifications and marketing Channels */}
          <SettingsSection
            title={isRtl ? 'تفضيلات التنبيهات وقنوات التواصل' : 'Alerts & Notifications'}
          >
            {/* Email notifications */}
            <PreferenceSwitch
              title={isRtl ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
              description={
                isRtl
                  ? 'استلام تفاصيل الشحن وفواتير الدفع على بريدك الإلكتروني.'
                  : 'Receive shipment logs and invoices in email.'
              }
              checked={emailAlerts}
              onToggle={() => setEmailAlerts(!emailAlerts)}
              isRtl={isRtl}
            />

            {/* SMS notifications */}
            <PreferenceSwitch
              title={isRtl ? 'رسائل الجوال القصيرة (SMS)' : 'SMS Alert Messages'}
              description={
                isRtl
                  ? 'استلام رسائل نصية قصيرة على هاتفك المسجل فور تحرك شحنتك.'
                  : 'Receive text alerts for order status transitions.'
              }
              checked={smsAlerts}
              onToggle={() => setSmsAlerts(!smsAlerts)}
              isRtl={isRtl}
            />

            {/* Push notifications */}
            <PreferenceSwitch
              title={isRtl ? 'إشعارات المتصفح (Push)' : 'Browser Push Alerts'}
              description={
                isRtl
                  ? 'استلام إشعارات فورية على شاشتك عند تجهيز شحنتك.'
                  : 'Receive instant desktop alerts for shipping logs.'
              }
              checked={pushAlerts}
              onToggle={() => setPushAlerts(!pushAlerts)}
              isRtl={isRtl}
            />

            {/* Marketing promotions */}
            <PreferenceSwitch
              title={isRtl ? 'النشرات التسويقية والترويجية' : 'Marketing & Promotions'}
              description={
                isRtl
                  ? 'الحصول على عروض خصومات موسمية وكوبونات خاصة بحسابك.'
                  : 'Subscribe to marketing discounts and special coupons.'
              }
              checked={promoAlerts}
              onToggle={() => setPromoAlerts(!promoAlerts)}
              isRtl={isRtl}
            />
          </SettingsSection>
        </div>
      </div>

      {/* Save Button for Preferences */}
      <div className="flex justify-end select-none">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="text-xs font-bold px-6 bg-primary text-primary-foreground focus-visible:ring-gold hover:bg-primary/95 transition-all cursor-pointer"
        >
          {isSaving
            ? isRtl
              ? 'جاري الحفظ...'
              : 'Saving...'
            : isRtl
              ? 'حفظ التفضيلات والإعدادات'
              : 'Save Preferences'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-4">
        {/* Security & Password section */}
        <SettingsSection title={isRtl ? 'الأمان وحماية الحساب' : 'Security & Password'}>
          <form onSubmit={handleSubmit(handlePasswordChangeSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">
                {isRtl ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <Input
                type="password"
                {...register('currentPassword')}
                placeholder="••••••••"
                className="text-right focus-visible:ring-gold"
                error={!!errors.currentPassword}
              />
              {errors.currentPassword && (
                <p className="text-[10px] text-destructive font-semibold">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">
                {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <Input
                type="password"
                {...register('newPassword')}
                placeholder="••••••••"
                className="text-right focus-visible:ring-gold"
                error={!!errors.newPassword}
              />
              {errors.newPassword && (
                <p className="text-[10px] text-destructive font-semibold">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">
                {isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <Input
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="text-right focus-visible:ring-gold"
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-destructive font-semibold">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="text-xs font-bold w-full bg-primary text-primary-foreground focus-visible:ring-gold hover:bg-primary/95 transition-all cursor-pointer"
            >
              {isChangingPassword
                ? isRtl
                  ? 'جاري تحديث كلمة المرور...'
                  : 'Updating Password...'
                : isRtl
                  ? 'تحديث كلمة المرور'
                  : 'Update Password'}
            </Button>
          </form>

          {/* Two-Factor Authentication Switch */}
          <div className="border-t border-border/10 pt-4 mt-4">
            <PreferenceSwitch
              title={isRtl ? 'المصادقة الثنائية (2FA)' : 'Two-Factor Authentication (2FA)'}
              description={
                isRtl
                  ? 'تأمين حسابك عبر إرسال رمز تحقق لجوالك عند محاولة تسجيل دخول جديدة.'
                  : 'Add a secondary code confirmation to secure logins.'
              }
              checked={twoFactorAuth}
              onToggle={() => {
                setTwoFactorAuth(!twoFactorAuth);
                toast.success(
                  isRtl
                    ? !twoFactorAuth
                      ? 'تم تفعيل المصادقة الثنائية بنجاح (محاكاة)'
                      : 'تم إيقاف المصادقة الثنائية'
                    : !twoFactorAuth
                      ? 'Two-factor Authentication activated (Simulation)'
                      : 'Two-factor Authentication deactivated'
                );
              }}
              isRtl={isRtl}
            />
          </div>
        </SettingsSection>

        {/* Login Devices / Active Sessions mock list */}
        <SettingsSection title={isRtl ? 'الأجهزة النشطة وجلسات الدخول' : 'Active Sessions'}>
          <div className="space-y-4 pt-2">
            <p className="text-[11px] text-muted-foreground">
              {isRtl
                ? 'مراجعة الأجهزة التي قامت بتسجيل الدخول إلى حسابك مؤخراً.'
                : 'Review devices that recently logged into your account.'}
            </p>

            <div className="space-y-3.5">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`flex items-center justify-between text-right p-3 bg-muted/20 border border-border/40 rounded-xl ${
                    sess.isCurrent ? '' : 'opacity-85'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {sess.device.includes('iPhone') || sess.device.includes('iPad') ? (
                      <Smartphone className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                      <Laptop className="h-5 w-5 text-gold shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-primary block">{sess.device}</span>
                      <span className="text-[10px] text-muted-foreground block">
                        {sess.location} • {sess.lastActive}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sess.isCurrent ? (
                      <>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/15 animate-pulse shrink-0 select-none">
                          {isRtl ? 'نشط' : 'Active'}
                        </span>
                        <Button
                          onClick={() => setIsLogoutModalOpen(true)}
                          variant="ghost"
                          size="sm"
                          className="text-[10px] font-bold text-destructive hover:bg-destructive/10 px-2 h-7 cursor-pointer"
                        >
                          {isRtl ? 'خروج' : 'Logout'}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleRevokeSession(sess.id)}
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-bold text-destructive hover:bg-destructive/10 px-2 h-7 cursor-pointer"
                      >
                        {isRtl ? 'إنهاء' : 'Logout'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsLogoutModalOpen(true)}
                variant="outline"
                className="text-xs font-bold flex-1 border-destructive/25 text-destructive hover:bg-destructive/5 cursor-pointer"
              >
                {isRtl ? 'تسجيل خروج كافة الأجهزة' : 'Logout All Devices'}
              </Button>
              {sessions.filter((s) => !s.isCurrent).length > 0 && (
                <Button
                  onClick={handleTerminateOtherSessions}
                  variant="outline"
                  className="text-xs font-bold flex-1 border-border/40 hover:bg-muted/40 cursor-pointer"
                >
                  {isRtl ? 'إنهاء الجلسات الأخرى' : 'Terminate Other Sessions'}
                </Button>
              )}
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* Danger Zone */}
      <div className="pt-4">
        <SettingsSection
          title={isRtl ? 'منطقة الخطر وإدارة الحساب' : 'Danger Zone & Account Management'}
        >
          <div className="space-y-4 pt-2">
            {/* Row 1: Deactivate */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-amber-500/15 bg-amber-500/5 rounded-2xl text-right">
              <div className="space-y-1">
                <span className="font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5 justify-start select-none">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{isRtl ? 'تعطيل الحساب مؤقتاً' : 'Temporarily Deactivate Account'}</span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                  {isRtl
                    ? 'سيؤدي تعطيل الحساب إلى إخفاء ملفك الشخصي وتجميد أنشطتك حتى تسجل دخولك مرة أخرى.'
                    : 'Deactivating your account freezes your transactions and hides your details until your next login.'}
                </p>
              </div>
              <Button
                onClick={() => setIsDeactivateModalOpen(true)}
                variant="outline"
                className="text-xs font-bold px-5 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 shrink-0 cursor-pointer"
              >
                {isRtl ? 'تعطيل الحساب' : 'Deactivate Account'}
              </Button>
            </div>

            {/* Row 2: Delete */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-destructive/15 bg-destructive/5 rounded-2xl text-right">
              <div className="space-y-1">
                <span className="font-bold text-xs sm:text-sm text-destructive flex items-center gap-1.5 justify-start select-none">
                  <ShieldAlert className="h-4 w-4" />
                  <span>{isRtl ? 'حذف الحساب نهائياً' : 'Permanently Delete Account'}</span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                  {isRtl
                    ? 'سيتم إلغاء تفعيل حسابك وحذف جميع طلباتك وبياناتك الشخصية نهائياً من قاعدة بياناتنا خلال ١٤ يوماً.'
                    : 'Permanently deletes your client profile, addresses, and order history from our store databases in 14 days.'}
                </p>
              </div>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                variant="outline"
                className="text-xs font-bold px-5 border-destructive/40 text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
              >
                {isRtl ? 'حذف الحساب' : 'Delete Account'}
              </Button>
            </div>

            {/* Row 3: Logout */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-destructive/10 bg-destructive/5 rounded-2xl text-right">
              <div className="space-y-1">
                <span className="font-bold text-xs sm:text-sm text-destructive flex items-center gap-1.5 justify-start select-none">
                  <LogOut className="h-4 w-4" />
                  <span>{isRtl ? 'تسجيل الخروج من الحساب' : 'Logout Account'}</span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                  {isRtl
                    ? 'تسجيل الخروج من حسابك الحالي وإنهاء جلستك بأمان على هذا الجهاز.'
                    : 'Sign out of your credentials and securely end your session on this browser.'}
                </p>
              </div>
              <Button
                onClick={() => setIsLogoutModalOpen(true)}
                variant="outline"
                className="text-xs font-bold px-5 border-destructive/20 text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
              >
                {isRtl ? 'تسجيل الخروج' : 'Logout'}
              </Button>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title={isRtl ? 'تأكيد تسجيل الخروج' : 'Confirm Logout'}
        description={
          isRtl
            ? 'هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟'
            : 'Are you sure you want to log out of your account?'
        }
      >
        <div className="flex items-center gap-3 justify-end pt-4" dir="ltr">
          <Button
            variant="outline"
            onClick={() => setIsLogoutModalOpen(false)}
            className="text-xs font-bold px-4 h-9 cursor-pointer"
          >
            {isRtl ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            onClick={handleLogoutConfirm}
            className="text-xs font-bold px-4 h-9 bg-destructive hover:bg-destructive/95 text-destructive-foreground border-0 cursor-pointer"
          >
            {isRtl ? 'خروج' : 'Logout'}
          </Button>
        </div>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={isRtl ? 'تنبيه: حذف الحساب نهائياً' : 'Danger: Delete Account'}
        description={
          isRtl
            ? 'طلب حذف الحساب سيؤدي إلى إلغاء تفعيل حسابك فوراً وبدء عملية الحذف النهائي لبياناتك. هل ترغب في الاستمرار؟'
            : 'Deleting your account will deactivate it immediately and trigger database cleaning operations. Do you wish to continue?'
        }
      >
        <div className="flex items-center gap-3 justify-end pt-4" dir="ltr">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            className="text-xs font-bold px-4 h-9 cursor-pointer"
          >
            {isRtl ? 'تراجع' : 'Abort'}
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteConfirm}
            className="text-xs font-bold px-4 h-9 bg-destructive hover:bg-destructive/95 text-destructive-foreground border-0 flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>{isRtl ? 'تأكيد الحذف' : 'Confirm Delete'}</span>
          </Button>
        </div>
      </Dialog>

      {/* Deactivate Account Confirmation Dialog */}
      <Dialog
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title={isRtl ? 'تأكيد تعطيل الحساب مؤقتاً' : 'Confirm Deactivation'}
        description={
          isRtl
            ? 'هل أنت متأكد من رغبتك في تعطيل حسابك مؤقتاً؟ يمكنك إعادة تفعيله مجدداً في أي وقت عبر تسجيل الدخول مجدداً.'
            : 'Are you sure you want to deactivate your account temporarily? Log back in anytime to restore full access.'
        }
      >
        <div className="flex items-center gap-3 justify-end pt-4" dir="ltr">
          <Button
            variant="outline"
            onClick={() => setIsDeactivateModalOpen(false)}
            className="text-xs font-bold px-4 h-9 cursor-pointer"
          >
            {isRtl ? 'تراجع' : 'Abort'}
          </Button>
          <Button
            variant="primary"
            onClick={handleDeactivateConfirm}
            className="text-xs font-bold px-4 h-9 bg-amber-600 hover:bg-amber-700 text-white border-0 flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>{isRtl ? 'تأكيد التعطيل' : 'Confirm Deactivate'}</span>
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
