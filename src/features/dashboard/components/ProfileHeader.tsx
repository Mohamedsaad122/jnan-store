import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { User } from '@/features/auth/types';
import { useLanguageStore } from '@/store/language.store';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="bg-card/40 backdrop-blur-md border border-border/40 p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-6 font-tajawal text-right shadow-xs"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* User Avatar & Name Info */}
      <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 flex-grow">
        <Avatar
          src={user.avatarUrl}
          fallbackText={user.firstName || 'U'}
          className="h-20 w-20 border border-gold/20 shadow-sm shrink-0"
        />
        <div className="space-y-1.5 text-center sm:text-right flex-grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-black text-primary">
              {`${user.firstName} ${user.lastName}`}
            </h1>
            <span className="bg-gold/15 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold/10 flex items-center gap-1 select-none">
              <ShieldCheck className="h-3 w-3" />
              <span>
                {user.role === 'admin'
                  ? t('common.admin', 'مشرف')
                  : user.role === 'vendor'
                    ? t('common.vendor', 'تاجر')
                    : t('common.customer', 'عميل')}
              </span>
            </span>
            <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/10 select-none">
              {isRtl ? 'نشط' : 'Active'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            {isRtl
              ? 'تعديل وتحديث بيانات حسابك الشخصي'
              : 'Update your personal details and options'}
          </p>

          {/* Metadata Grid */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 pt-2.5 text-muted-foreground text-xs font-semibold">
            {user.email && (
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{user.email}</span>
              </span>
            )}
            {user.phone && (
              <span className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{user.phone}</span>
              </span>
            )}
            {user.createdAt && (
              <span className="flex items-center justify-center sm:justify-start gap-1.5 select-none">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>
                  {isRtl ? 'عضو منذ' : 'Member since'} {formatDate(user.createdAt)}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
