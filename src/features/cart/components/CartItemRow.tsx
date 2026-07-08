import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { CartItemState } from '@/store/cart.store';
import { formatCurrency } from '@/utils/currency';
import { useLanguageStore } from '@/store/language.store';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface CartItemRowProps {
  item: CartItemState;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onSaveForLater?: (productId: string) => void;
  variant?: 'page' | 'drawer';
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
  variant = 'page',
}) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const isDrawer = variant === 'drawer';

  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 border border-border/40 bg-card/30 rounded-2xl select-none ${
        isDrawer ? 'p-3 rounded-xl gap-2.5' : ''
      }`}
      role="listitem"
    >
      {/* Product Thumbnail & Details group */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Thumbnail Image */}
        <div
          className={`relative aspect-square rounded-xl bg-muted/20 border border-border/20 overflow-hidden shrink-0 ${
            isDrawer ? 'h-14 w-14 rounded-lg' : 'h-20 w-20'
          }`}
        >
          <OptimizedImage
            src={item.imageUrl || '/assets/images/placeholder.png'}
            alt={item.name}
            aspectRatioClassName="w-full h-full"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info detail block */}
        <div className="flex flex-col text-right min-w-0 flex-1">
          <h4
            className={`font-bold text-primary truncate leading-snug font-tajawal ${
              isDrawer ? 'text-xs' : 'text-sm'
            }`}
          >
            {item.name}
          </h4>
          <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-sans">
            {formatCurrency(item.price, language)}
          </span>

          {/* Save for Later shortcut link */}
          {!isDrawer && onSaveForLater && (
            <button
              onClick={() => onSaveForLater(item.productId)}
              className="text-[10px] font-bold text-gold hover:text-gold/80 hover:underline mt-1.5 text-right cursor-pointer self-start bg-transparent border-0"
            >
              {isRtl ? 'حفظ لوقت لاحق' : 'Save for Later'}
            </button>
          )}

          {/* Quantity selector on mobile for standard page layout */}
          {!isDrawer && (
            <QuantitySelector
              quantity={item.quantity}
              stock={99}
              onChange={(q) => onUpdateQuantity(item.productId, q)}
              size="sm"
              className="flex sm:hidden mt-2 border-border/50 bg-muted/10 w-24"
            />
          )}
        </div>
      </div>

      {/* Control Actions & Price block */}
      <div
        className={`flex items-center gap-4 shrink-0 ${
          isDrawer ? 'flex-col items-end gap-1.5' : 'flex-row items-center'
        }`}
      >
        {/* Quantity control for desktop or drawer */}
        {(isDrawer || !isDrawer) && (
          <QuantitySelector
            quantity={item.quantity}
            stock={99}
            onChange={(q) => onUpdateQuantity(item.productId, q)}
            size={isDrawer ? 'sm' : 'md'}
            className={`hidden sm:flex border-border/50 bg-muted/10 ${isDrawer ? 'flex' : ''}`}
          />
        )}

        {/* Sum Amount and Delete bin */}
        <div className={`flex items-center gap-3 ${isDrawer ? 'gap-1.5' : ''}`}>
          <span
            className={`font-extrabold text-primary font-sans text-right ${
              isDrawer ? 'text-xs text-gold' : 'text-sm sm:text-base text-gold'
            }`}
          >
            {formatCurrency(item.price * item.quantity, language)}
          </span>
          <button
            onClick={() => onRemove(item.productId)}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-2"
            aria-label={t('cart.clear_item', { defaultValue: 'إزالة المنتج' })}
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CartItemRow);
