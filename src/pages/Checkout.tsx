import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddressesQuery';
import { useCreateOrder } from '@/hooks/useCheckoutMutation';
import AddressSelector from '@/features/checkout/components/AddressSelector';
import ShippingMethodCard from '@/features/checkout/components/ShippingMethodCard';
import PaymentMethodCard from '@/features/checkout/components/PaymentMethodCard';
import { ordersService } from '@/services/orders/orders.service';
import { Address, ShippingMethod, PaymentMethodType, OrderItem } from '@/types/domain';
import { useLanguageStore } from '@/store/language.store';
import { formatCurrency } from '@/utils/currency';
import Button from '@/components/ui/Button';
import Logo from '@/components/global/Logo';
import { toast } from 'react-hot-toast';
import ROUTES from '@/constants/routes';
import analyticsService from '@/services/analytics.service';

export const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { items, getSubtotal, getDiscountAmount, appliedCoupon, giftWrap, getGiftWrapFee } =
    useCart();
  const { data: addresses = [] } = useAddresses();
  const createOrderMutation = useCreateOrder();

  // Checkout Form States
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
  const isSubmitting = createOrderMutation.isPending;

  // Set default selected shipping/billing addresses on mount if addresses exist
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find((addr) => addr.isDefault) || addresses[0];
      setShippingAddress(defaultAddr);
      if (sameAsShipping) {
        setBillingAddress(defaultAddr);
      }
    }
  }, [addresses, sameAsShipping]);

  // If cart is empty, block checkout and redirect to shop
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      toast.error(t('cart.empty_title', { defaultValue: 'سلتك فارغة حالياً' }));
      navigate(ROUTES.CART);
    } else {
      analyticsService.trackCheckout(1, 'Checkout Initiated');
    }
  }, [items, navigate, isSubmitting, t]);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shippingFee = shippingMethod ? shippingMethod.cost : 15;
  const giftFee = giftWrap ? getGiftWrapFee() : 0;

  // Calculate dynamic totals using orders service helper
  const totals = ordersService.calculateTotals(subtotal, discount, shippingFee);
  const finalTotalAmount = totals.totalAmount + giftFee;

  // Derive active checkout steps for the progress visual stepper
  const steps = [
    {
      key: 'address',
      labelAr: 'العنوان',
      labelEn: 'Address',
      icon: MapPin,
      done: !!shippingAddress,
    },
    {
      key: 'shipping',
      labelAr: 'التوصيل',
      labelEn: 'Shipping',
      icon: Truck,
      done: !!shippingMethod,
    },
    {
      key: 'payment',
      labelAr: 'الدفع',
      labelEn: 'Payment',
      icon: CreditCard,
      done: !!paymentMethod,
    },
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeBilling = sameAsShipping ? shippingAddress : billingAddress;
    const checkoutValidation = ordersService.validateCheckout({
      shippingAddress: shippingAddress || undefined,
      shippingMethod: shippingMethod || undefined,
      paymentMethod: paymentMethod || undefined,
      itemsCount: items.length,
    });

    if (!checkoutValidation.isValid) {
      toast.error(checkoutValidation.errors[0]);
      return;
    }

    if (!activeBilling) {
      toast.error(
        t('checkout.validation.billing_required', { defaultValue: 'يرجى تحديد عنوان الفواتير' })
      );
      return;
    }

    try {
      const orderItems: OrderItem[] = items.map((item, idx) => ({
        id: `oi-${idx}-${Date.now()}`,
        productId: item.productId,
        productNameAr: item.name,
        productNameEn: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      analyticsService.trackPurchaseIntent({
        subtotal,
        totalAmount: finalTotalAmount,
        couponCode: appliedCoupon?.code,
      });

      await createOrderMutation.mutateAsync({
        items: orderItems,
        shippingAddress: shippingAddress!,
        billingAddress: activeBilling,
        shippingMethod: shippingMethod!,
        paymentMethod: paymentMethod!,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        shippingFee: totals.shippingFee,
        taxAmount: totals.taxAmount,
        totalAmount: finalTotalAmount,
        couponCode: appliedCoupon?.code,
      });

      // Clear local state cart or trigger success redirects
      navigate(ROUTES.ORDER_SUCCESS || '/checkout/success');
    } catch {
      // Handled in mutation toasts
    }
  };

  const formatNumber = (num: number) => {
    return isRtl ? new Intl.NumberFormat('ar-SA').format(num) : num.toString();
  };

  return (
    <div
      className="min-h-screen bg-background pb-16 font-tajawal text-right flex flex-col"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Minimal Checkout Topbar */}
      <header className="border-b border-border/20 py-4 select-none">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to={ROUTES.CART}>
            <Button
              variant="ghost"
              className="text-xs font-bold text-muted-foreground flex items-center gap-1"
            >
              {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              <span>{t('cart.title', { defaultValue: 'العودة للسلة' })}</span>
            </Button>
          </Link>
          <Logo />
        </div>
      </header>

      {/* Main Form content */}
      <main className="container mx-auto px-4 md:px-6 py-8 flex-grow">
        {/* Checkout Header and Progress Stepper */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 select-none">
          <h1 className="text-xl md:text-2xl font-black text-primary">
            {t('checkout.title', { defaultValue: 'إتمام الطلب' })}
          </h1>

          {/* Stepper progress */}
          <div
            className="flex items-center gap-2.5 bg-muted/10 border border-border/40 p-2.5 rounded-xl text-xs"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center border ${
                        step.done
                          ? 'bg-emerald-500 border-emerald-500 text-card'
                          : 'bg-transparent border-border text-muted-foreground'
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-card" />
                      ) : (
                        <StepIcon className="h-3 w-3" />
                      )}
                    </div>
                    <span
                      className={`font-bold ${step.done ? 'text-emerald-600' : 'text-muted-foreground'}`}
                    >
                      {isRtl ? step.labelAr : step.labelEn}
                    </span>
                  </div>
                  {idx < steps.length - 1 && <div className="h-0.5 w-6 bg-border/60" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* Left Column: Address, Shipping speed & Payments (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Shipping Address Section */}
            <section className="bg-card/30 border border-border/40 p-5 rounded-2xl">
              <AddressSelector
                selectedId={shippingAddress?.id}
                onSelect={(addr) => {
                  setShippingAddress(addr);
                  if (sameAsShipping) setBillingAddress(addr);
                }}
                title={t('checkout.shipping_address', { defaultValue: 'عنوان الشحن والتوصيل' })}
              />
            </section>

            {/* 2. Billing Address Section */}
            <section className="bg-card/30 border border-border/40 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 select-none">
                <input
                  id="sameAsShipping"
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => {
                    setSameAsShipping(e.target.checked);
                    if (e.target.checked) setBillingAddress(shippingAddress);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold cursor-pointer"
                />
                <label
                  htmlFor="sameAsShipping"
                  className="text-xs font-bold text-primary cursor-pointer"
                >
                  {t('checkout.same_as_shipping', {
                    defaultValue: 'عنوان الفواتير هو نفس عنوان الشحن',
                  })}
                </label>
              </div>

              {!sameAsShipping && (
                <div className="mt-4 pt-4 border-t border-border/20 animate-fade-in">
                  <AddressSelector
                    selectedId={billingAddress?.id}
                    onSelect={(addr) => setBillingAddress(addr)}
                    title={t('checkout.billing_address', {
                      defaultValue: 'عنوان الفواتير والبطاقة',
                    })}
                  />
                </div>
              )}
            </section>

            {/* 3. Shipping Methods Section */}
            <section className="bg-card/30 border border-border/40 p-5 rounded-2xl">
              <ShippingMethodCard
                selectedId={shippingMethod?.id}
                onSelect={(method) => {
                  setShippingMethod(method);
                  analyticsService.trackCheckout(2, 'Shipping Speed Chosen');
                }}
              />
            </section>

            {/* 4. Payment Methods Section */}
            <section className="bg-card/30 border border-border/40 p-5 rounded-2xl">
              <PaymentMethodCard
                selectedId={paymentMethod || undefined}
                onSelect={(id) => {
                  setPaymentMethod(id);
                  analyticsService.trackCheckout(3, 'Payment Option Picked');
                }}
              />
            </section>
          </div>

          {/* Right Column: Order items and totals (1/3 width) - Sticky */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-[100px]">
            {/* Summary details */}
            <div className="bg-card/40 border border-border/40 p-5 rounded-2xl select-text">
              <h3 className="text-base font-black text-primary border-b border-border/20 pb-3 mb-4 select-none">
                {t('checkout.order_summary', { defaultValue: 'ملخص الطلب' })}
              </h3>

              {/* Items checklist */}
              <div className="max-h-48 overflow-y-auto space-y-3 mb-5 border-b border-border/20 pb-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-semibold text-primary max-w-[150px] truncate">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 text-muted-foreground font-sans">
                      <span>x{formatNumber(item.quantity)}</span>
                      <span>{formatCurrency(item.price * item.quantity, language)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial calculations */}
              <div className="space-y-3.5 text-xs font-medium text-muted-foreground/90">
                <div className="flex justify-between items-center">
                  <span className="select-none">
                    {t('cart.subtotal', { defaultValue: 'المجموع الفرعي' })}
                  </span>
                  <span className="font-sans text-primary">
                    {formatCurrency(totals.subtotal, language)}
                  </span>
                </div>

                {totals.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span className="select-none">
                      {t('cart.coupon_discount', { defaultValue: 'خصم الكوبون' })}
                    </span>
                    <span className="font-sans">
                      - {formatCurrency(totals.discountAmount, language)}
                    </span>
                  </div>
                )}

                {giftWrap && giftFee > 0 && (
                  <div className="flex justify-between items-center text-gold font-semibold">
                    <span className="select-none">
                      {isRtl ? 'رسوم التغليف كهدية' : 'Gift Wrapping Fee'}
                    </span>
                    <span className="font-sans">+ {formatCurrency(giftFee, language)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="select-none">
                    {t('cart.shipping', { defaultValue: 'رسوم الشحن والتوصيل' })}
                  </span>
                  <span className="font-sans text-primary">
                    {totals.shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md select-none">
                        {t('cart.shipping_free', { defaultValue: 'مجاني' })}
                      </span>
                    ) : (
                      formatCurrency(totals.shippingFee, language)
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="select-none">
                    {t('cart.tax', { defaultValue: 'ضريبة القيمة المضافة (١٥٪)' })}
                  </span>
                  <span className="font-sans text-primary">
                    {formatCurrency(totals.taxAmount, language)}
                  </span>
                </div>

                <div className="flex justify-between items-center font-black text-sm text-primary pt-3 border-t border-border/20">
                  <span className="select-none">
                    {t('cart.total', { defaultValue: 'المجموع الإجمالي' })}
                  </span>
                  <span className="font-sans text-gold text-base">
                    {formatCurrency(finalTotalAmount, language)}
                  </span>
                </div>
              </div>

              {/* Delivery Preview indicator */}
              {shippingMethod && (
                <div className="mt-4 p-3 bg-muted/15 border border-border/30 rounded-xl select-none text-[10px] text-muted-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gold shrink-0" />
                  <div className="flex flex-col text-right">
                    <span className="font-black text-primary">
                      {isRtl ? 'سرعة الشحن المحددة' : 'Selected delivery speed'}
                    </span>
                    <span className="mt-0.5">
                      {isRtl
                        ? shippingMethod.estimatedDeliveryAr
                        : shippingMethod.estimatedDeliveryEn}
                    </span>
                  </div>
                </div>
              )}

              {/* Guarantee badge */}
              <div className="flex items-center gap-1.5 justify-center mt-6 text-[10px] text-muted-foreground select-none">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  {t('checkout.secure_guarantee', { defaultValue: 'دفع مشفر وآمن ١٠٠٪' })}
                </span>
              </div>

              {/* Order Placement CTA */}
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                className="w-full flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground hover:bg-primary/95 text-xs sm:text-sm font-bold rounded-xl mt-4 shadow-md border border-gold/10 disabled:opacity-50 select-none cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? t('checkout.processing', { defaultValue: 'جاري معالجة الطلب...' })
                    : t('checkout.place_order', { defaultValue: 'تأكيد الطلب والدفع' })}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
