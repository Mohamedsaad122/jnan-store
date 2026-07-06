import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Truck, CreditCard, Box, Gift, XCircle } from 'lucide-react';
import { OrderStatus } from './OrderStatusBadge';

interface OrderTimelineProps {
  status: OrderStatus;
  updatedAt?: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, updatedAt }) => {
  const { t } = useTranslation();

  // Steps definitions
  const steps = [
    {
      id: 'placed',
      titleKey: 'orders.timeline.placed',
      titleAr: 'تم تقديم الطلب',
      titleEn: 'Order Placed',
      descriptionAr: 'تم استلام طلبك بنجاح وجاري مراجعته.',
      descriptionEn: 'Your order was successfully submitted.',
      icon: <Gift className="h-4 w-4" />,
    },
    {
      id: 'paid',
      titleKey: 'orders.timeline.paid',
      titleAr: 'تمت عملية الدفع',
      titleEn: 'Payment Confirmed',
      descriptionAr: 'تم تأكيد عملية الدفع وتوثيق الفاتورة.',
      descriptionEn: 'Your payment has been successfully confirmed.',
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: 'preparing',
      titleKey: 'orders.timeline.preparing',
      titleAr: 'قيد التجهيز',
      titleEn: 'Preparing Order',
      descriptionAr: 'نقوم بتعبئة وتغليف منتجاتك في مزارعنا.',
      descriptionEn: 'We are packing and preparing your products.',
      icon: <Box className="h-4 w-4" />,
    },
    {
      id: 'shipped',
      titleKey: 'orders.timeline.shipped',
      titleAr: 'تم الشحن',
      titleEn: 'Shipped',
      descriptionAr: 'تم تسليم الشحنة لشركة التوصيل وجاري الشحن.',
      descriptionEn: 'Your package is on its way to you.',
      icon: <Truck className="h-4 w-4" />,
    },
    {
      id: 'delivered',
      titleKey: 'orders.timeline.delivered',
      titleAr: 'تم التوصيل',
      titleEn: 'Delivered',
      descriptionAr: 'تم توصيل الشحنة بنجاح لعنوانك المسجل.',
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
        return 1; // Placed & Paid completed in mock flow
      case 'processing':
        return 2; // Placed, Paid, Preparing completed
      case 'shipped':
        return 3; // Placed, Paid, Preparing, Shipped completed
      case 'delivered':
        return 4; // All completed
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
              {t('orders.timeline.cancelled_desc', 'تم إلغاء الطلب من قبلك أو لعدم توفر المخزون.')}
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
                      {t(step.titleKey, step.titleAr)}
                    </h4>
                    {isCurrent && updatedAt && (
                      <span className="text-[9px] text-gold font-bold">
                        {formatDate(updatedAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
                    {t(`${step.titleKey}_desc`, step.descriptionAr)}
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
