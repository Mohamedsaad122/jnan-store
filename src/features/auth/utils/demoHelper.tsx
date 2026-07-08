import { toast } from 'react-hot-toast';

/**
 * Triggers a premium, interactive toast notification showing the demo OTP code
 * to streamline developer testing and user evaluation.
 */
export const showDemoOtpToast = (): void => {
  toast(
    () => (
      <div className="flex flex-col gap-2 p-1 font-tajawal text-right" dir="rtl">
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
          <span>⚠️ وضع التجربة | Demo Mode</span>
        </div>
        <p className="text-xs text-foreground font-medium leading-relaxed">
          لم يتم إرسال بريد إلكتروني حقيقي. يرجى استخدام رمز التحقق التالي:
        </p>
        <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg border border-border/60 mt-1 select-all">
          <span className="font-mono font-extrabold text-sm text-primary dark:text-gold select-all">
            123456
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText('123456');
              toast.success('تم نسخ الرمز!', { id: 'copy-toast' });
            }}
            className="text-[10px] font-bold text-gold bg-gold/10 hover:bg-gold/20 px-2 py-1 rounded transition-colors cursor-pointer border-0"
          >
            نسخ
          </button>
        </div>
      </div>
    ),
    {
      duration: 15000,
      position: 'top-center',
      style: {
        border: '1px solid rgba(196, 160, 84, 0.3)',
        padding: '12px',
        borderRadius: '16px',
        background: 'var(--card)',
        color: 'var(--card-foreground)',
      },
    }
  );
};
