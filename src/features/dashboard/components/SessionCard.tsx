import React from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Smartphone, Globe, LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SessionCardProps {
  session: ActiveSession;
  onRevoke: (id: string) => void;
  isRtl: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onRevoke, isRtl }) => {
  const { t } = useTranslation();

  const isMobile = /phone|android|ios/i.test(session.device);

  return (
    <div className="flex items-start justify-between gap-4 p-4 border border-border/20 rounded-xl bg-card/25 hover:border-border/40 transition-all font-tajawal text-right">
      <div className="flex items-start gap-3">
        {/* Device Icon */}
        <div className="h-9 w-9 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/15 shrink-0 select-none">
          {isMobile ? <Smartphone className="h-4.5 w-4.5" /> : <Monitor className="h-4.5 w-4.5" />}
        </div>

        {/* Details */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-xs text-primary">{session.device}</span>
            {session.isCurrent && (
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/10 flex items-center gap-1 select-none">
                <Globe className="h-3 w-3" />
                <span>{t('security.session.current', 'هذا الجهاز حالياً')}</span>
              </span>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground select-none">
            {session.browser} • {session.ip} • {session.location}
          </p>
          <p className="text-[9px] text-muted-foreground select-none">
            {t('security.session.last_active', 'آخر نشاط:')} {session.lastActive}
          </p>
        </div>
      </div>

      {/* Revoke button */}
      {!session.isCurrent && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRevoke(session.id)}
          className="text-[10px] font-bold text-destructive hover:bg-destructive/10 gap-1 select-none"
          aria-label={
            isRtl ? `تسجيل الخروج من ${session.device}` : `Sign out from ${session.device}`
          }
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t('security.session.logout', 'إنهاء')}</span>
        </Button>
      )}
    </div>
  );
};

export default SessionCard;
