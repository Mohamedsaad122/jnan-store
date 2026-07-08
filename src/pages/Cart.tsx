import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Tag,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  Heart,
  Gift,
  Truck,
  Calendar,
  Undo,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartItemState } from '@/store/cart.store';
import CartItemRow from '@/features/cart/components/CartItemRow';
import { useLanguageStore } from '@/store/language.store';
import { formatCurrency } from '@/utils/currency';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { couponService } from '@/services/coupon/coupon.service';
import { toast } from 'react-hot-toast';
import ROUTES from '@/constants/routes';
import { Helmet } from 'react-helmet-async';
import EmptyState from '@/components/ui/EmptyState';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { motion, AnimatePresence } from 'framer-motion';
import analyticsService from '@/services/analytics.service';

export const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const {
    items,
    savedForLater,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTaxAmount,
    getGiftWrapFee,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    moveToSaved,
    moveToCart,
    removeFromSaved,
    setGiftOptions,
    giftWrap,
    giftMessage,
    addItem,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Undo delete tracker
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItemState | null>(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);

  // Sync Gift Local Options
  const [localGiftWrap, setLocalGiftWrap] = useState(giftWrap);
  const [localGiftMessage, setLocalGiftMessage] = useState(giftMessage);

  useEffect(() => {
    setLocalGiftWrap(giftWrap);
    setLocalGiftMessage(giftMessage);
  }, [giftWrap, giftMessage]);

  const handleGiftOptionsChange = (wrap: boolean, msg: string) => {
    setLocalGiftWrap(wrap);
    setLocalGiftMessage(msg);
    setGiftOptions(wrap, msg);
  };

  // Derived values from store
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const tax = getTaxAmount();
  const giftFee = getGiftWrapFee();
  const total = getTotal();

  // Free shipping threshold calculation
  const FREE_SHIPPING_LIMIT = 200;
  const isFreeShipping = subtotal >= FREE_SHIPPING_LIMIT;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_LIMIT) * 100);

  // Estimated delivery calculation (Current Date + 3 days)
  const getEstimatedDeliveryDate = () => {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);
    return delivery.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleRemoveItem = (productId: string) => {
    const removedItem = items.find((i) => i.productId === productId);
    if (removedItem) {
      setLastRemovedItem(removedItem);
      setShowUndoBanner(true);
      analyticsService.trackRemoveFromCart({
        productId: removedItem.productId,
        name: removedItem.name,
        price: removedItem.price,
        quantity: removedItem.quantity,
      });

      // Auto dismiss undo banner after 6 seconds
      setTimeout(() => {
        setShowUndoBanner(false);
      }, 6000);
    }
    removeItem(productId);
  };

  const handleUndoRemove = () => {
    if (lastRemovedItem) {
      addItem(lastRemovedItem);
      setShowUndoBanner(false);
      setLastRemovedItem(null);
      toast.success(isRtl ? 'تم تراجع عن الحذف وإعادة المنتج' : 'Restored deleted cart item');
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    await applyCouponCode(couponCode);
  };

  const applyCouponCode = async (code: string) => {
    setIsValidating(true);
    try {
      const coupon = await couponService.validateCoupon(code, subtotal);
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
  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Helmet>
          <title>{isRtl ? 'سلة التسوق | متجر جنان' : 'Shopping Cart | Jnan Store'}</title>
        </Helmet>
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8 text-gold" />}
          title={t('cart.empty_title', { defaultValue: 'سلة التسوق فارغة حالياً' })}
          description={t('cart.empty_desc', {
            defaultValue: 'تصفح أقسام المتجر وأضف منتجاتك المفضلة لبدء التسوق معنا.',
          })}
          primaryAction={{
            label: t('cart.continue_shopping', { defaultValue: 'العودة للمتجر والبدء بالتسوق' }),
            to: ROUTES.SHOP,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 md:px-6 py-8 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>{isRtl ? 'سلة التسوق | متجر جنان' : 'Shopping Cart | Jnan Store'}</title>
      </Helmet>

      <h1 className="text-2xl font-black text-primary dark:text-gold leading-tight mb-8 select-none">
        {t('cart.title', { defaultValue: 'سلة التسوق' })}
      </h1>

      {/* Floating Undo delete banner */}
      <AnimatePresence>
        {showUndoBanner && lastRemovedItem && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 z-50 bg-primary border border-gold/15 text-primary-foreground p-4 rounded-xl flex items-center justify-between gap-4 shadow-xl select-none"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="h-4.5 w-4.5 text-gold" />
              <span className="text-xs font-semibold">
                {isRtl
                  ? `تم حذف "${lastRemovedItem.name}" من سلة التسوق.`
                  : `Removed "${lastRemovedItem.name}" from shopping cart.`}
              </span>
            </div>
            <button
              onClick={handleUndoRemove}
              className="inline-flex items-center gap-1 bg-gold text-card text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:opacity-90"
            >
              <Undo className="h-3 w-3 stroke-[2.5]" />
              <span>{isRtl ? 'تراجع' : 'Undo'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cart Rows List & Saved For Later */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Cart Section */}
          {items.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-4" role="list">
                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={handleRemoveItem}
                    onSaveForLater={moveToSaved}
                    variant="page"
                  />
                ))}
              </div>

              {/* Cart Global Actions row */}
              <div className="flex items-center justify-between pt-2 select-none">
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
          ) : (
            <div className="p-8 text-center border border-dashed rounded-2xl bg-card/20 select-none">
              <ShoppingBag className="h-8 w-8 text-gold opacity-50 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-bold">
                {isRtl
                  ? 'لا توجد منتجات نشطة حالياً في سلة تسوقك'
                  : 'No active items in your shopping cart.'}
              </p>
            </div>
          )}

          {/* Saved For Later Shelf */}
          {savedForLater.length > 0 && (
            <div className="border-t border-border/40 pt-8 animate-fade-in text-right w-full select-none">
              <h3 className="text-sm font-black text-primary flex items-center gap-2 mb-4">
                <Heart className="h-4 w-4 text-gold fill-gold/10" />
                <span>{isRtl ? 'المحفوظات لوقت لاحق' : 'Saved For Later'}</span>
                <span className="text-[10px] text-muted-foreground">({savedForLater.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedForLater.map((saved) => (
                  <div
                    key={saved.productId}
                    className="p-4 border border-border/40 bg-card/40 rounded-2xl flex gap-3.5 items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <OptimizedImage
                        src={saved.imageUrl}
                        alt={saved.name}
                        aspectRatioClassName="h-14 w-14"
                        className="h-full w-full object-cover rounded-xl border border-border/30"
                      />
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-extrabold text-primary line-clamp-1">
                          {saved.name}
                        </span>
                        <span className="text-xs font-black font-sans text-gold mt-1">
                          {formatCurrency(saved.price, language)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        onClick={() => moveToCart(saved.productId)}
                        variant="primary"
                        className="h-8 px-3 rounded-lg text-[10px] font-bold bg-primary text-primary-foreground border-0 hover:bg-primary/95 cursor-pointer"
                      >
                        {isRtl ? 'نقل للسلة' : 'Move to Cart'}
                      </Button>
                      <button
                        onClick={() => removeFromSaved(saved.productId)}
                        className="text-[10px] font-bold text-destructive hover:underline cursor-pointer border-0 bg-transparent"
                      >
                        {isRtl ? 'حذف من المحفوظات' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Summary & Shipping Options */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-[120px]">
          {/* Free Shipping Status Box */}
          <div className="bg-card/40 border border-border/40 p-5 rounded-2xl select-none">
            <div className="flex items-center gap-2 text-primary font-bold text-xs mb-3">
              <Truck className="h-4 w-4 text-gold" />
              <span>{isRtl ? 'حالة التوصيل والشحن' : 'Delivery & Shipping Status'}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-primary">
                {isFreeShipping
                  ? t('cart.free_shipping_success', { defaultValue: 'لقد حصلت على شحن مجاني!' })
                  : t('cart.free_shipping_alert', {
                      amount: formatNumber(remainingForFreeShipping),
                      defaultValue: `أضف بقيمة ${formatNumber(remainingForFreeShipping)} ر.س إضافية لشحن مجاني`,
                    })}
              </span>
              <span className="text-[10px] text-muted-foreground font-sans font-bold">
                {formatNumber(subtotal)} / {formatNumber(FREE_SHIPPING_LIMIT)} ر.س
              </span>
            </div>

            {/* Progress bar line */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isFreeShipping ? 'bg-emerald-500' : 'bg-gold'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>

            {/* Estimated delivery tag */}
            {items.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold border-t border-border/20 pt-2.5 mt-2">
                <Calendar className="h-3.5 w-3.5 text-gold shrink-0" />
                <span>{isRtl ? 'التوصيل المتوقع:' : 'Estimated Delivery:'}</span>
                <span className="text-primary font-black">{getEstimatedDeliveryDate()}</span>
              </div>
            )}
          </div>

          {/* Coupon codes panel */}
          <div className="bg-card/40 border border-border/40 p-5 rounded-2xl select-none">
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-1.5 justify-start">
              <Tag className="h-4 w-4 text-gold" />
              <span>{t('cart.apply_coupon_title', { defaultValue: 'قسيمة التخفيض' })}</span>
            </h4>

            {appliedCoupon ? (
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
              <div className="space-y-3">
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
                    className="h-10 text-xs px-4 font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl border-0 cursor-pointer"
                    disabled={isValidating || !couponCode.trim()}
                  >
                    {isValidating ? '...' : t('cart.coupon_apply', { defaultValue: 'تطبيق' })}
                  </Button>
                </form>

                {/* Clickable Coupon Suggestion chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-muted-foreground font-bold block">
                    {isRtl ? 'كوبونات مميزة ومتاحة:' : 'Available coupons:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {['JNAN10', 'WELCOME50'].map((code) => (
                      <button
                        key={code}
                        onClick={() => applyCouponCode(code)}
                        className="px-2 py-1 border border-dashed border-gold/40 text-gold hover:bg-gold/5 rounded-lg text-[9px] font-black font-sans cursor-pointer transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gift Options panel */}
          {items.length > 0 && (
            <div className="bg-card/40 border border-border/40 p-5 rounded-2xl select-none">
              <div className="flex items-center gap-2 text-primary font-bold text-xs mb-3">
                <Gift className="h-4 w-4 text-gold" />
                <span>{isRtl ? 'تغليف الهدايا والإهداء' : 'Gift Wrapping Options'}</span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleGiftOptionsChange(!localGiftWrap, localGiftMessage)}
                  className="flex items-center justify-between w-full text-xs font-semibold py-1 hover:text-primary transition-colors text-right cursor-pointer"
                >
                  <span className={localGiftWrap ? 'text-gold font-bold' : 'text-muted-foreground'}>
                    {isRtl
                      ? 'تغليف الطلب كهدية فاخرة (+١٠ ر.س)'
                      : 'Premium Gift Wrapping (+10 SAR)'}
                  </span>
                  <div
                    className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                      localGiftWrap
                        ? 'border-gold bg-gold text-card'
                        : 'border-border/60 bg-transparent'
                    }`}
                  >
                    {localGiftWrap && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>

                <AnimatePresence>
                  {localGiftWrap && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 overflow-hidden pt-1"
                    >
                      <label
                        htmlFor="gift-message"
                        className="text-[10px] font-bold text-muted-foreground"
                      >
                        {isRtl ? 'رسالة الإهداء المكتوبة:' : 'Written Gift Message:'}
                      </label>
                      <Textarea
                        id="gift-message"
                        placeholder={
                          isRtl ? 'اكتب رسالة الإهداء للداخل...' : 'Write your gift message here...'
                        }
                        value={localGiftMessage}
                        onChange={(e) => handleGiftOptionsChange(localGiftWrap, e.target.value)}
                        className="text-xs p-2 rounded-xl min-h-[60px] resize-none border-border/60 text-right"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Sticky Summary calculation block */}
          {items.length > 0 && (
            <div className="bg-card/40 border border-border/40 p-5 rounded-2xl select-text">
              <h3 className="text-base font-black text-primary border-b border-border/20 pb-3 mb-4 select-none">
                {t('cart.summary_title', { defaultValue: 'ملخص الطلب' })}
              </h3>

              <div className="space-y-3.5 text-xs font-medium text-muted-foreground/90">
                <div className="flex justify-between items-center">
                  <span className="select-none">
                    {t('cart.subtotal', { defaultValue: 'المجموع الفرعي' })}
                  </span>
                  <span className="font-sans text-primary">
                    {formatCurrency(subtotal, language)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span className="select-none">
                      {t('cart.coupon_discount', { defaultValue: 'خصم الكوبون' })}
                    </span>
                    <span className="font-sans">- {formatCurrency(discount, language)}</span>
                  </div>
                )}

                {giftFee > 0 && (
                  <div className="flex justify-between items-center text-gold font-semibold">
                    <span className="select-none">{isRtl ? 'رسوم التغليف' : 'Gift Wrap Fee'}</span>
                    <span className="font-sans">+ {formatCurrency(giftFee, language)}</span>
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
                  className="w-full flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground hover:bg-primary/95 text-xs sm:text-sm font-bold rounded-xl shadow-md border border-gold/10 cursor-pointer"
                >
                  <span>{t('cart.checkout_btn', { defaultValue: 'إتمام الطلب' })}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
