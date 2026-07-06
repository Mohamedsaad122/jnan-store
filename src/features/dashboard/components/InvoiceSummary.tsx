import React from 'react';
import { useTranslation } from 'react-i18next';

interface InvoiceSummaryProps {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  isRtl: boolean;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  subtotal,
  discountAmount,
  shippingFee,
  taxAmount,
  totalAmount,
  isRtl,
}) => {
  const { t } = useTranslation();

  const formatPrice = (num: number) => {
    return isRtl ? `${new Intl.NumberFormat('ar-SA').format(num)} ر.س` : `${num.toFixed(2)} SAR`;
  };

  return (
    <div className="space-y-3 font-tajawal text-right text-xs select-none">
      <div className="flex justify-between items-center text-muted-foreground font-semibold">
        <span>{t('invoice.subtotal', 'المجموع الفرعي')}</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between items-center text-rose-500 font-bold">
          <span>{t('invoice.discount', 'الخصم')}</span>
          <span>-{formatPrice(discountAmount)}</span>
        </div>
      )}

      <div className="flex justify-between items-center text-muted-foreground font-semibold">
        <span>{t('invoice.shipping', 'تكلفة الشحن')}</span>
        <span>
          {shippingFee === 0 ? t('invoice.free_shipping', 'شحن مجاني') : formatPrice(shippingFee)}
        </span>
      </div>

      <div className="flex justify-between items-center text-muted-foreground font-semibold">
        <span>{t('invoice.tax', 'ضريبة القيمة المضافة (١٥٪)')}</span>
        <span>{formatPrice(taxAmount)}</span>
      </div>

      <div className="border-t border-border/20 pt-3 flex justify-between items-center text-sm">
        <span className="font-bold text-primary">{t('invoice.total', 'المجموع الكلي')}</span>
        <span className="font-black text-primary text-base">{formatPrice(totalAmount)}</span>
      </div>
    </div>
  );
};

export default InvoiceSummary;
