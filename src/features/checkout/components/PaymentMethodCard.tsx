import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import { PaymentMethodType } from '@/types/domain';
import { useLanguageStore } from '@/store/language.store';
import { MOCK_PAYMENT_METHODS } from '@/services/orders/orders.mock';

interface PaymentMethodCardProps {
  selectedId?: PaymentMethodType;
  onSelect: (id: PaymentMethodType) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ selectedId, onSelect }) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'wallet':
        return <Wallet className="h-5 w-5 text-gold shrink-0" />;
      case 'creditcard':
        return <CreditCard className="h-5 w-5 text-gold shrink-0" />;
      case 'banknote':
        return <Banknote className="h-5 w-5 text-gold shrink-0" />;
      default:
        return <CreditCard className="h-5 w-5 text-gold shrink-0" />;
    }
  };

  const PAYMENT_METHODS = MOCK_PAYMENT_METHODS.map((method) => ({
    id: method.id,
    name: t(method.nameKey, { defaultValue: isRtl ? method.nameAr : method.nameEn }),
    desc: t(method.descKey, { defaultValue: isRtl ? method.descriptionAr : method.descriptionEn }),
    icon: getPaymentIcon(method.iconName),
  }));

  return (
    <div className="w-full flex flex-col font-tajawal text-right select-none">
      <h4 className="text-sm font-extrabold text-primary mb-4 border-b border-border/20 pb-2.5">
        {t('checkout.payment_method', { defaultValue: 'طريقة الدفع' })}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" role="radiogroup">
        {PAYMENT_METHODS.map((pay) => {
          const isSelected = selectedId === pay.id;

          // Standard default select
          if (!selectedId && pay.id === 'mada') {
            setTimeout(() => onSelect(pay.id), 0);
          }

          return (
            <div
              key={pay.id}
              onClick={() => onSelect(pay.id)}
              className={`p-4 border rounded-xl bg-card/10 hover:bg-muted/10 cursor-pointer flex items-start gap-3.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold ${
                isSelected
                  ? 'border-gold shadow-xs ring-1 ring-gold bg-gold/5'
                  : 'border-border/60 hover:border-gold/30'
              }`}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(pay.id);
                }
              }}
            >
              {/* Payment Icon */}
              {pay.icon}

              {/* Text Description */}
              <div className="flex flex-col text-right min-w-0 flex-1">
                <span className="text-xs font-black text-primary truncate">{pay.name}</span>
                <p className="text-[10px] text-muted-foreground/90 mt-1 leading-snug">{pay.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
