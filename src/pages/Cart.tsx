import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Tag, X, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import CartItemRow from '@/features/cart/components/CartItemRow';
import { useLanguageStore } from '@/store/language.store';
import { formatCurrency } from '@/utils/currency';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { couponService } from '@/services/coupon/coupon.service';
import { toast } from 'react-hot-toast';
import ROUTES from '@/constants/routes';

export const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTaxAmount,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Derived values from store
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const tax = getTaxAmount();
  const total = getTotal();

  // Free shipping threshold calculation
  const FREE_SHIPPING_LIMIT = 200;
  const isFreeShipping = subtotal >= FREE_SHIPPING_LIMIT;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_LIMIT) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidating(true);
    try {
      const coupon = await couponService.validateCoupon(couponCode, subtotal);
      applyCoupon(coupon);
      toast.success(t('cart.coupon_applied', { defaultValue: 'تم تطبيق الكوبون بنجاح!' }));
      setCouponCode('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || t('cart.coupon_error', { defaultValue: 'رمز الكوبون غير صحيح' }));
    } finally {
      setIsValidating(false);
    }
  };

  const formatNumber = (num: number) => {
    return isRtl ? new Intl.NumberFormat('ar-SA').format(num) : num.toString();
  };

  // 1. Empty Cart Layout View
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center font-tajawal select-none">
        <div className="w-20 h-20 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center mb-6">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h2 className="text-xl font-black text-primary mb-2">
          {t('cart.empty_title', { defaultValue: 'سلة التسوق فارغة حالياً' })}
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
          {t('cart.empty_desc', {
            defaultValue: 'تصفح أقسام المتجر وأضف منتجاتك المفضلة لبدء التسوق معنا.',
          })}
        </p>
        <Link to={ROUTES.SHOP}>
          <Button
            variant="primary"
            className="flex items-center gap-2 h-11 px-6 text-xs font-bold rounded-xl shadow-md"
          >
            <span>
              {t('cart.continue_shopping', { defaultValue: 'العودة للمتجر والبدء بالتسوق' })}
            </span>
            {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 md:px-6 py-8 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <h1 className="text-2xl font-black text-primary leading-tight mb-8 select-none">
        {t('cart.title', { defaultValue: 'سلة التسوق' })}
      </h1>

      {/* Two-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cart Rows List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-4" role="list">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                variant="page"
              />
            ))}
          </div>

          {/* Cart Global Actions row */}
          <div className="flex items-center justify-between pt-4 select-none">
            <Link to={ROUTES.SHOP}>
              <Button
                variant="ghost"
                className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 h-10 px-3 rounded-lg"
              >
                {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                <span>{t('cart.continue_shopping', { defaultValue: 'مواصلة التسوق' })}</span>
              </Button>
            </Link>

            <Button
              onClick={clearCart}
              variant="outline"
              className="text-xs font-bold text-muted-foreground hover:text-destructive border-border/60 hover:bg-destructive/5 flex items-center gap-1.5 h-10 px-3 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
              <span>{t('cart.clear_cart', { defaultValue: 'تفريغ السلة' })}</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Coupons */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-[120px]">
          {/* Free Shipping Status Box */}
          <div className="bg-card/40 border border-border/40 p-5 rounded-2xl select-none">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary">
                {isFreeShipping
                  ? t('cart.free_shipping_success', { defaultValue: 'لقد حصلت على شحن مجاني!' })
                  : t('cart.free_shipping_alert', {
                      amount: formatNumber(remainingForFreeShipping),
                      defaultValue: `أضف بقيمة ${formatNumber(remainingForFreeShipping)} ر.س إضافية لشحن مجاني`,
                    })}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatNumber(subtotal)} / {formatNumber(FREE_SHIPPING_LIMIT)} ر.س
              </span>
            </div>

            {/* Progress bar line */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isFreeShipping ? 'bg-emerald-500' : 'bg-gold'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Coupon codes panel */}
          <div className="bg-card/40 border border-border/40 p-5 rounded-2xl select-none">
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-1.5 justify-start">
              <Tag className="h-4 w-4 text-gold" />
              <span>{t('cart.apply_coupon_title', { defaultValue: 'قسيمة التخفيض' })}</span>
            </h4>

            {appliedCoupon ? (
              /* Display Applied Coupon Badge */
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-emerald-500/25 text-emerald-600 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 font-sans tracking-wide">
                    {appliedCoupon.code}
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
                  aria-label="إلغاء قسيمة الخصم"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              /* Coupon Application Form */
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={t('cart.coupon_placeholder', {
                    defaultValue: 'أدخل رمز الكوبون...',
                  })}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="h-10 text-xs text-right border-border/60 rounded-xl flex-1 px-3"
                  disabled={isValidating}
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="h-10 text-xs px-4 font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl"
                  disabled={isValidating || !couponCode.trim()}
                >
                  {isValidating ? '...' : t('cart.coupon_apply', { defaultValue: 'تطبيق' })}
                </Button>
              </form>
            )}

            {/* Quick Helper Tips */}
            {!appliedCoupon && (
              <div className="text-[10px] text-muted-foreground/80 mt-2 text-right">
                جرب إدخال الرمز <strong className="text-primary font-sans">JNAN10</strong> للحصول
                على خصم 10% أو الرمز <strong className="text-primary font-sans">WELCOME50</strong>{' '}
                لخصم 50 ر.س.
              </div>
            )}
          </div>

          {/* Sticky Summary calculation block */}
          <div className="bg-card/40 border border-border/40 p-5 rounded-2xl select-text">
            <h3 className="text-base font-black text-primary border-b border-border/20 pb-3 mb-4 select-none">
              {t('cart.summary_title', { defaultValue: 'ملخص الطلب' })}
            </h3>

            <div className="space-y-3.5 text-xs font-medium text-muted-foreground/90">
              <div className="flex justify-between items-center">
                <span className="select-none">
                  {t('cart.subtotal', { defaultValue: 'المجموع الفرعي' })}
                </span>
                <span className="font-sans text-primary">{formatCurrency(subtotal, language)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-semibold">
                  <span className="select-none">
                    {t('cart.coupon_discount', { defaultValue: 'خصم الكوبون' })}
                  </span>
                  <span className="font-sans">- {formatCurrency(discount, language)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="select-none">
                  {t('cart.shipping', { defaultValue: 'رسوم الشحن والتوصيل' })}
                </span>
                <span className="font-sans text-primary">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md select-none">
                      {t('cart.shipping_free', { defaultValue: 'مجاني' })}
                    </span>
                  ) : (
                    formatCurrency(shipping, language)
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="select-none">
                  {t('cart.tax', { defaultValue: 'ضريبة القيمة المضافة (١٥٪)' })}
                </span>
                <span className="font-sans text-primary">{formatCurrency(tax, language)}</span>
              </div>

              <div className="flex justify-between items-center font-black text-sm text-primary pt-3 border-t border-border/20">
                <span className="select-none">
                  {t('cart.total', { defaultValue: 'المجموع الإجمالي' })}
                </span>
                <span className="font-sans text-gold text-base">
                  {formatCurrency(total, language)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link to={ROUTES.CHECKOUT} className="block mt-6 select-none">
              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground hover:bg-primary/95 text-xs sm:text-sm font-bold rounded-xl shadow-md border border-gold/10"
              >
                <span>{t('cart.checkout_btn', { defaultValue: 'إتمام الطلب' })}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
