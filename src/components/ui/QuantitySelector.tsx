import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import { twMerge } from 'tailwind-merge';

export interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  stock,
  onChange,
  disabled = false,
  className = '',
  size = 'md',
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const formatNumber = (num: number) => {
    return isRtl ? new Intl.NumberFormat('ar-SA').format(num) : num.toString();
  };

  const handleIncrement = () => {
    if (quantity < stock && !disabled) {
      onChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1 && !disabled) {
      onChange(quantity - 1);
    }
  };

  const isSm = size === 'sm';

  return (
    <div
      className={twMerge(
        'flex items-center justify-between border border-border/50 bg-muted/10 rounded-xl px-2.5 shrink-0 select-none',
        isSm ? 'h-8 px-2 w-22 rounded-lg' : 'h-9 px-2.5 w-26',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      role="group"
      aria-label="محدد الكمية"
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 1 || disabled}
        className={twMerge(
          'flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors',
          isSm ? 'h-6 w-6' : 'h-7 w-7',
          (quantity <= 1 || disabled) && 'opacity-30 cursor-not-allowed'
        )}
        aria-label={isRtl ? 'تقليل الكمية' : 'Decrease quantity'}
      >
        <Minus className={twMerge('stroke-[2.5]', isSm ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      </button>

      <span
        className={twMerge(
          'font-bold font-sans text-primary text-center flex-1',
          isSm ? 'text-xs' : 'text-sm'
        )}
        aria-live="polite"
      >
        {formatNumber(quantity)}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= stock || disabled}
        className={twMerge(
          'flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors',
          isSm ? 'h-6 w-6' : 'h-7 w-7',
          (quantity >= stock || disabled) && 'opacity-30 cursor-not-allowed'
        )}
        aria-label={isRtl ? 'زيادة الكمية' : 'Increase quantity'}
      >
        <Plus className={twMerge('stroke-[2.5]', isSm ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      </button>
    </div>
  );
};

export default QuantitySelector;
