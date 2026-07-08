import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Truck, Box, XCircle } from 'lucide-react';
import { OrderStatus } from './OrderStatusBadge';

interface OrderTimelineProps {
  status: OrderStatus;
  updatedAt?: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, updatedAt }) => {
  const { t } = useTranslation();
  const isRtl = t('common.dir', { defaultValue: 'rtl' }) === 'rtl';

  // Steps definitions: Preparing, Shipped, Out for delivery, Delivered
  const steps = [
    {
      id: 'preparing',
      titleAr: 'قيد التجهيز في مزارعنا',
      titleEn: 'Preparing in Farms',
      descriptionAr: 'نقوم بتجهيز وتغليف طلبك بعناية فائقة.',
      descriptionEn: 'We are preparing and packaging your premium goods.',
      icon: <Box className="h-4 w-4" />,
    },
    {
      id: 'shipped',
      titleAr: 'تم الشحن مع الشريك الناقل',
      titleEn: 'Shipped with Delivery Partner',
      descriptionAr: 'تم تسليم الشحنة لشركة التوصيل وجاري نقلها.',
      descriptionEn: 'Your package is on its way with the carrier.',
      icon: <Truck className="h-4 w-4" />,
    },
    {
      id: 'out_for_delivery',
      titleAr: 'خارج للتوصيل اليوم',
      titleEn: 'Out for Delivery Today',
      descriptionAr: 'الشحنة مع المندوب للتسليم اليوم.',
      descriptionEn: 'The courier is delivering your order today.',
      icon: <Truck className="h-4 w-4 animate-bounce" />,
    },
    {
      id: 'delivered',
      titleAr: 'تم التوصيل بنجاح',
      titleEn: 'Successfully Delivered',
      descriptionAr: 'تم تسليم الطلب للعنوان المسجل بنجاح.',
      descriptionEn: 'Your order has been successfully delivered.',
      icon: <Check className="h-4 w-4" />,
    },
  ];

  // Determine active index based on status
  const getActiveStepIndex = () => {
    switch (status) {
      case 'cancelled':
        return -1;
      case 'pending':
        return 0; // Preparing active
      case 'processing':
        return 0; // Preparing completed, Shipped next
      case 'shipped':
        return 2; // Preparing, Shipped, Out for delivery active
      case 'delivered':
        return 3; // All completed
      default:
        return 0;
    }
  };

  const activeIndex = getActiveStepIndex();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 font-tajawal text-right py-2 select-none">
      {status === 'cancelled' && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/15 text-xs font-bold leading-relaxed mb-4">
          <XCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-black">
              {t('orders.timeline.cancelled_title', 'تم إلغاء هذا الطلب')}
            </p>
            <p className="text-[10px] opacity-90 mt-0.5">
              {t(
                'orders.timeline.cancelled_desc',
                'تم إلغاء الطلب بناء على رغبتك أو لعدم توفر المخزون.'
              )}
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Timeline connector line */}
        <div
          className="absolute right-6 top-4 bottom-4 w-0.5 bg-border/40"
          style={{ right: '1.22rem' }}
        />

        <div className="space-y-6">
          {steps.map((step, idx) => {
            const isCompleted = status !== 'cancelled' && idx <= activeIndex;
            const isCurrent = status !== 'cancelled' && idx === activeIndex;

            return (
              <div key={step.id} className="flex gap-4 relative items-start">
                {/* Visual Step Icon Indicator */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border transition-all z-10 ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground border-gold shadow-md shadow-primary/10'
                      : isCurrent
                        ? 'bg-background text-gold border-gold border-2 animate-pulse shadow-md shadow-gold/20'
                        : 'bg-card text-muted-foreground border-border/60'
                  }`}
                  aria-hidden="true"
                >
                  {step.icon}
                </div>

                {/* Step Text Details */}
                <div className="flex-grow pt-1.5 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs md:text-sm font-bold ${
                        isCompleted || isCurrent ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {t(`orders.timeline.${step.id}`, isRtl ? step.titleAr : step.titleEn)}
                    </h4>
                    {isCurrent && updatedAt && (
                      <span className="text-[9px] text-gold font-bold">
                        {formatDate(updatedAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                    {isRtl ? step.descriptionAr : step.descriptionEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
