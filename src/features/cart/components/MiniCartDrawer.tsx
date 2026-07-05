import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import CartItemRow from './CartItemRow';
import Sheet from '@/components/ui/Sheet';
import Button from '@/components/ui/Button';
import ROUTES from '@/constants/routes';
import { useLanguageStore } from '@/store/language.store';
import { formatCurrency } from '@/utils/currency';

export const MiniCartDrawer: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const { isOpen, setOpen, items, updateQuantity, removeItem, totalAmount } = useCart();

  return (
    <Sheet
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      side="left" // Cart slides from left in both LTR & RTL
      title={t('cart.title', { defaultValue: 'سلة التسوق' })}
    >
      <div
        className="flex flex-col h-full justify-between font-tajawal text-right py-2 select-none"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {items.length === 0 ? (
          /* Empty Cart state */
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-muted-foreground mb-4">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-primary mb-1">
              {t('cart.empty_title', { defaultValue: 'سلتك فارغة حالياً' })}
            </p>
            <p className="text-xs text-muted-foreground mb-6 max-w-[200px] leading-relaxed mx-auto">
              {t('cart.empty_desc', { defaultValue: 'تصفح أقسام المتجر وأضف منتجاتك المفضلة' })}
            </p>
            <Button
              onClick={() => setOpen(false)}
              variant="gold"
              size="sm"
              className="h-9 px-4 text-xs font-bold rounded-lg"
            >
              {t('cart.continue_shopping', { defaultValue: 'تصفح المنتجات' })}
            </Button>
          </div>
        ) : (
          /* Populated Cart drawer items and actions */
          <div className="flex flex-col h-full justify-between">
            {/* Scrollable list area */}
            <div className="flex-grow overflow-y-auto space-y-3 pr-0.5 max-h-[calc(100vh-230px)]">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  variant="drawer"
                />
              ))}
            </div>

            {/* Footer Summary details */}
            <div className="border-t border-border/40 pt-4 mt-4 space-y-4">
              <div className="flex items-center justify-between font-bold text-sm sm:text-base text-primary select-text">
                <span>{t('cart.total', { defaultValue: 'المجموع الإجمالي:' })}</span>
                <span className="text-gold font-sans">{formatCurrency(totalAmount, language)}</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Checkout Trigger */}
                <Link to={ROUTES.CHECKOUT} onClick={() => setOpen(false)}>
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 h-11 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-xl shadow-xs"
                  >
                    <span>{t('cart.checkout_btn', { defaultValue: 'إإتمام الطلب' })}</span>
                    <ArrowRight className={`h-4 w-4 ${language === 'ar' ? '' : 'rotate-180'}`} />
                  </Button>
                </Link>

                {/* View Cart Page Trigger */}
                <Link to={ROUTES.CART} onClick={() => setOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full h-11 border-border/60 hover:bg-muted/30 text-xs font-bold rounded-xl"
                  >
                    <span>{t('cart.view_cart_btn', { defaultValue: 'عرض تفاصيل السلة' })}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
};

export default MiniCartDrawer;
