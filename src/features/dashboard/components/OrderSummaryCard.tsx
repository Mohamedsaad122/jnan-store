import React from 'react';
import Card from '@/components/ui/Card';
import { twMerge } from 'tailwind-merge';

interface OrderSummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  title,
  children,
  className,
  ...props
}) => {
  return (
    <Card
      className={twMerge(
        'p-5 border border-border/40 bg-card/40 backdrop-blur-md shadow-xs text-right font-tajawal select-none',
        className
      )}
      {...props}
    >
      <div className="border-b border-border/10 pb-3 mb-3">
        <h4 className="text-xs font-black text-primary uppercase tracking-wider">{title}</h4>
      </div>
      <div className="space-y-1.5">{children}</div>
    </Card>
  );
};

export default OrderSummaryCard;
