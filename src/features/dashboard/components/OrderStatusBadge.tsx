import React from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className,
  ...props
}) => {
  const { t } = useTranslation();

  const getStatusStyles = () => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15';
      case 'processing':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15';
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15';
      case 'pending':
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'delivered':
        return t('orders.status.delivered', 'تم التوصيل');
      case 'processing':
        return t('orders.status.processing', 'قيد التجهيز');
      case 'shipped':
        return t('orders.status.shipped', 'تم الشحن');
      case 'cancelled':
        return t('orders.status.cancelled', 'ملغي');
      case 'pending':
      default:
        return t('orders.status.pending', 'معلق');
    }
  };

  return (
    <span
      className={twMerge(
        'text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold select-none capitalize tracking-wide',
        getStatusStyles(),
        className
      )}
      {...props}
    >
      {getStatusLabel()}
    </span>
  );
};

export default OrderStatusBadge;
