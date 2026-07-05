import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Zap, CalendarDays } from 'lucide-react';
import { ShippingMethod } from '@/types/domain';
import { MOCK_SHIPPING_METHODS } from '@/services/orders/orders.mock';
import { useLanguageStore } from '@/store/language.store';
import { formatCurrency } from '@/utils/currency';

interface ShippingMethodCardProps {
  selectedId?: string;
  onSelect: (method: ShippingMethod) => void;
}

export const ShippingMethodCard: React.FC<ShippingMethodCardProps> = ({ selectedId, onSelect }) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // Shipping Methods List mapping resolved from mock data
  const SHIPPING_METHODS: ShippingMethod[] = MOCK_SHIPPING_METHODS.map((method) => ({
    id: method.id,
    nameAr: t(method.nameKey, { defaultValue: method.nameAr }),
    nameEn: t(method.nameKey, { defaultValue: method.nameEn }),
    descriptionAr: t(method.descKey, { defaultValue: method.descriptionAr }),
    descriptionEn: t(method.descKey, { defaultValue: method.descriptionEn }),
    cost: method.cost,
    estimatedDeliveryAr: method.estimatedDeliveryAr,
    estimatedDeliveryEn: method.estimatedDeliveryEn,
  }));

  const getIcon = (id: string) => {
    switch (id) {
      case 'sm-express':
        return <Zap className="h-5 w-5 text-gold shrink-0" />;
      case 'sm-sameday':
        return <CalendarDays className="h-5 w-5 text-gold shrink-0" />;
      case 'sm-standard':
      default:
        return <Truck className="h-5 w-5 text-gold shrink-0" />;
    }
  };

  return (
    <div className="w-full flex flex-col font-tajawal text-right select-none">
      <h4 className="text-sm font-extrabold text-primary mb-4 border-b border-border/20 pb-2.5">
        {t('checkout.shipping_method', { defaultValue: 'طريقة الشحن والتوصيل' })}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup">
        {SHIPPING_METHODS.map((method) => {
          const isSelected = selectedId === method.id;

          // Set first method selected by default if nothing is chosen
          if (!selectedId && method.id === 'sm-standard') {
            setTimeout(() => onSelect(method), 0);
          }

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method)}
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
                  onSelect(method);
                }
              }}
            >
              {/* Method Icon */}
              {getIcon(method.id)}

              {/* Method Details */}
              <div className="flex flex-col text-right min-w-0 flex-1">
                <span className="text-xs font-black text-primary truncate">
                  {isRtl ? method.nameAr : method.nameEn}
                </span>
                <p className="text-[10px] text-muted-foreground/90 mt-1 leading-snug">
                  {isRtl ? method.descriptionAr : method.descriptionEn}
                </p>
                <span className="text-xs font-extrabold text-gold mt-2 font-sans select-text">
                  {method.cost === 0
                    ? t('cart.shipping_free', { defaultValue: 'مجاني' })
                    : formatCurrency(method.cost, language)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingMethodCard;
