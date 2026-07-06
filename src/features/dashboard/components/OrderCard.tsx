import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OrderStatusBadge, { OrderStatus } from './OrderStatusBadge';
import { Order } from '@/types/domain';

interface OrderCardProps {
  order: Order;
  onViewDetails: (id: string) => void;
  isRtl: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, isRtl }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (num: number) => {
    return isRtl ? `${new Intl.NumberFormat('ar-SA').format(num)} ر.س` : `${num.toFixed(2)} SAR`;
  };

  return (
    <Card className="p-5 sm:p-6 border border-border/40 shadow-xs text-right font-tajawal relative hover:border-gold/30 transition-all select-none">
      {/* Card Header metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/10 pb-4 mb-4 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-primary">{order.orderNumber}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              ({formatDate(order.createdAt)})
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {t('orders.id_label', 'معرف الطلب')}: {order.id}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Custom Status and Payment Badges */}
          <OrderStatusBadge status={order.status as OrderStatus} />
          <span
            className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold border ${
              order.paymentStatus === 'paid'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15'
            }`}
          >
            {isRtl
              ? order.paymentStatus === 'paid'
                ? 'تم السداد'
                : 'بانتظار الدفع'
              : order.paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="space-y-3 py-1">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-xs py-1.5 border-b border-border/5 last:border-b-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={isRtl ? item.productNameAr : item.productNameEn}
                  className="h-10 w-10 object-cover rounded-lg border border-border/40 shrink-0"
                />
              ) : (
                <div className="h-10 w-10 bg-muted/40 rounded-lg border border-border/40 flex items-center justify-center text-muted-foreground text-[10px] shrink-0">
                  {isRtl ? 'صورة' : 'Img'}
                </div>
              )}
              <div className="truncate">
                <span className="font-bold text-primary block truncate">
                  {isRtl ? item.productNameAr : item.productNameEn}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {isRtl ? 'الكمية:' : 'Qty:'} {item.quantity} × {formatPrice(item.price)}
                </span>
              </div>
            </div>
            <span className="font-bold text-primary shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer view action */}
      <div className="border-t border-border/10 mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <span className="text-xs font-bold text-muted-foreground">
            {isRtl ? 'المجموع الكلي:' : 'Total Amount:'}
          </span>
          <span className="font-black text-primary text-base">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <Button
          onClick={() => onViewDetails(order.id)}
          variant="outline"
          size="sm"
          className="text-xs font-bold gap-1 border-border/40 hover:bg-gold/10"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{t('orders.action.view', 'عرض التفاصيل')}</span>
          {isRtl ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>
      </div>
    </Card>
  );
};

export default OrderCard;
