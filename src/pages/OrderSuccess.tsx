import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Truck,
  CreditCard,
} from 'lucide-react';
import { Order } from '@/types/domain';
import { useLanguageStore } from '@/store/language.store';
import { formatCurrency } from '@/utils/currency';
import Button from '@/components/ui/Button';
import ROUTES from '@/constants/routes';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export const OrderSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [order, setOrder] = useState<Order | null>(null);

  // Retrieve the completed order from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jnan_last_order');
      if (stored) {
        setOrder(JSON.parse(stored));
      } else {
        // Fallback to home if no order context is found
        navigate(ROUTES.HOME);
      }
    } catch (e) {
      console.error('Failed to parse completed order from storage', e);
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  if (!order) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return t('checkout.cod', { defaultValue: 'الدفع عند الاستلام' });
      case 'card':
        return t('checkout.card', { defaultValue: 'بطاقة ائتمانية' });
      case 'applepay':
        return t('checkout.applepay', { defaultValue: 'Apple Pay' });
      case 'mada':
        return t('checkout.mada', { defaultValue: 'بطاقة مدى البنكية' });
      case 'stcpay':
        return t('checkout.stcpay', { defaultValue: 'STC Pay' });
      default:
        return method;
    }
  };

  const formatNumber = (num: number) => {
    return isRtl ? new Intl.NumberFormat('ar-SA').format(num) : num.toString();
  };

  return (
    <div
      className="container mx-auto px-4 md:px-6 py-12 max-w-3xl font-tajawal text-right select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Visual Header animations */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <div className="relative mb-6">
          {/* Animated pulsing rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 scale-125 animate-ping" />
          <div className="h-16 w-16 bg-emerald-500 text-background rounded-full flex items-center justify-center relative z-10 shadow-lg">
            <CheckCircle2 className="h-10 w-10 fill-emerald-500 text-background" />
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-black text-primary mb-2.5">
          {t('checkout.success_title', { defaultValue: 'تم استلام طلبك بنجاح!' })}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed select-text">
          {t('checkout.success_desc', {
            defaultValue: 'شكراً لثقتك بنا. تم تسجيل طلبك بنجاح وجاري تجهيزه للشحن الآن.',
          })}
        </p>
      </div>

      {/* Invoice Overview details box */}
      <div className="bg-card/30 border border-border/40 rounded-2xl p-5 md:p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs border-b border-border/10 pb-2">
            <span className="text-muted-foreground">
              {t('checkout.order_number', { defaultValue: 'رقم الطلب:' })}
            </span>
            <span className="font-sans font-black text-primary tracking-wide text-sm">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-b border-border/10 pb-2">
            <span className="text-muted-foreground">
              {t('checkout.order_date', { defaultValue: 'تاريخ الطلب:' })}
            </span>
            <span className="font-medium text-primary text-xs">{formatDate(order.createdAt)}</span>
          </div>

          <div className="flex justify-between items-center text-xs border-b border-border/10 pb-2">
            <span className="text-muted-foreground">
              {t('checkout.payment_method', { defaultValue: 'طريقة الدفع:' })}
            </span>
            <span className="font-bold text-primary text-xs flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-gold shrink-0" />
              {getPaymentLabel(order.paymentMethod || '')}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4 text-xs border-b border-border/10 pb-2">
            <span className="text-muted-foreground shrink-0">
              {t('checkout.shipping_address', { defaultValue: 'العنوان:' })}
            </span>
            <span className="font-medium text-primary text-xs text-left md:text-right flex items-start gap-1">
              <MapPin className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{order.shippingAddress.title}</p>
                <p className="text-[10px] text-muted-foreground/80 leading-snug mt-0.5">
                  {order.shippingAddress.addressLine1}، {order.shippingAddress.city}
                </p>
              </div>
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-b border-border/10 pb-2">
            <span className="text-muted-foreground">
              {t('checkout.shipping_method', { defaultValue: 'طريقة الشحن:' })}
            </span>
            <span className="font-bold text-primary text-xs flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-gold shrink-0" />
              {order.shippingMethod
                ? isRtl
                  ? order.shippingMethod.nameAr
                  : order.shippingMethod.nameEn
                : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Invoice details */}
      <div className="border border-border/40 bg-card/20 rounded-2xl p-5 md:p-6 mb-8 select-text">
        <h3 className="text-sm font-black text-primary border-b border-border/20 pb-3 mb-4 select-none">
          {t('checkout.order_details', { defaultValue: 'تفاصيل المنتجات' })}
        </h3>

        {/* List of items */}
        <div className="space-y-4 border-b border-border/20 pb-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-muted/20 border border-border/20 overflow-hidden shrink-0 select-none">
                  <OptimizedImage
                    src={item.imageUrl}
                    alt={isRtl ? item.productNameAr : item.productNameEn}
                    aspectRatioClassName="w-full h-full"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-bold text-primary">
                    {isRtl ? item.productNameAr : item.productNameEn}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {formatCurrency(item.price, language)} × {formatNumber(item.quantity)}
                  </span>
                </div>
              </div>
              <span className="font-sans font-extrabold text-gold">
                {formatCurrency(item.price * item.quantity, language)}
              </span>
            </div>
          ))}
        </div>

        {/* Sum Breakdown details */}
        <div className="space-y-3.5 text-xs font-medium text-muted-foreground/90">
          <div className="flex justify-between items-center">
            <span className="select-none">
              {t('cart.subtotal', { defaultValue: 'المجموع الفرعي' })}
            </span>
            <span className="font-sans text-primary">
              {formatCurrency(order.subtotal, language)}
            </span>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-semibold">
              <span className="select-none">
                {t('cart.coupon_discount', { defaultValue: 'خصم الكوبون' })}
              </span>
              <span className="font-sans">- {formatCurrency(order.discountAmount, language)}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="select-none">
              {t('cart.shipping', { defaultValue: 'رسوم الشحن والتوصيل' })}
            </span>
            <span className="font-sans text-primary">
              {order.shippingFee === 0 ? (
                <span className="text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md select-none">
                  {t('cart.shipping_free', { defaultValue: 'مجاني' })}
                </span>
              ) : (
                formatCurrency(order.shippingFee, language)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="select-none">
              {t('cart.tax', { defaultValue: 'ضريبة القيمة المضافة (١٥٪)' })}
            </span>
            <span className="font-sans text-primary">
              {formatCurrency(order.taxAmount, language)}
            </span>
          </div>

          <div className="flex justify-between items-center font-black text-sm text-primary pt-3 border-t border-border/20">
            <span className="select-none">
              {t('cart.total', { defaultValue: 'المجموع النهائي' })}
            </span>
            <span className="font-sans text-gold text-base">
              {formatCurrency(order.totalAmount, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Security note and Return home button */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-border/30 pt-6 select-none">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{t('checkout.safe_guarantee', { defaultValue: 'دفع مشفر وآمن ١٠٠٪' })}</span>
        </div>

        <Link to={ROUTES.SHOP}>
          <Button
            variant="primary"
            className="flex items-center gap-2 h-11 px-6 text-xs font-bold rounded-xl shadow-md"
          >
            <span>{t('checkout.success_continue', { defaultValue: 'مواصلة التسوق' })}</span>
            {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
