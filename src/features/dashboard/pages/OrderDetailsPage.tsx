import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, ShieldCheck, CreditCard, MapPin } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import dashboardOrdersService from '../services/orders.service';
import SectionHeader from '../components/SectionHeader';
import OrderStatusBadge, { OrderStatus } from '../components/OrderStatusBadge';
import OrderTimeline from '../components/OrderTimeline';
import OrderSummaryCard from '../components/OrderSummaryCard';
import InvoiceSummary from '../components/InvoiceSummary';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '@/components/ui/Card';
import { Order } from '@/types/domain';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dashboardOrdersService
        .getOrderById(id)
        .then((res) => {
          if (res) {
            setOrder(res);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (num: number) => {
    return isRtl ? `${new Intl.NumberFormat('ar-SA').format(num)} ر.س` : `${num.toFixed(2)} SAR`;
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 font-tajawal select-none">
        <h3 className="text-base font-bold text-primary mb-2">
          {t('orders.details.not_found', 'تفاصيل الطلب غير متوفرة')}
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          {t('orders.details.not_found_desc', 'عذراً، لم نتمكن من العثور على تفاصيل هذا الطلب.')}
        </p>
        <Link to="/dashboard/orders">
          <Button size="sm" variant="outline" className="text-xs font-bold gap-1">
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('orders.details.back', 'العودة لطلباتي')}</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header with back link */}
      <SectionHeader
        title={`${t('orders.details.number_title', 'تفاصيل الطلب')} ${order.orderNumber}`}
        subtitle={`${t('orders.details.created_at', 'تاريخ الطلب')}: ${formatDate(order.createdAt)}`}
      >
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status as OrderStatus} />
          <Link to="/dashboard/orders">
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-bold gap-1 border-border/40 hover:bg-gold/10"
            >
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              <span>{t('orders.details.back', 'العودة لطلباتي')}</span>
            </Button>
          </Link>
        </div>
      </SectionHeader>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Order Items & Delivery Timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline Card */}
          <Card className="p-6 border border-border/40 bg-card/40 backdrop-blur-md shadow-xs">
            <div className="border-b border-border/10 pb-3 mb-4 select-none text-right">
              <h3 className="text-sm font-bold text-primary">
                {t('orders.details.timeline_title', 'حالة الشحنة والتوصيل')}
              </h3>
            </div>
            <OrderTimeline status={order.status as OrderStatus} updatedAt={order.updatedAt} />
          </Card>

          {/* Purchased Items Card */}
          <Card className="p-6 border border-border/40 bg-card/40 backdrop-blur-md shadow-xs">
            <div className="border-b border-border/10 pb-3 mb-4 select-none text-right">
              <h3 className="text-sm font-bold text-primary">
                {t('orders.details.items_title', 'المنتجات المشتراة')}
              </h3>
            </div>

            <div className="divide-y divide-border/10">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 text-right">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={isRtl ? item.productNameAr : item.productNameEn}
                        className="h-12 w-12 object-cover rounded-lg border border-border/40 shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted/40 rounded-lg border border-border/40 flex items-center justify-center text-muted-foreground text-[10px] shrink-0">
                        {isRtl ? 'صورة' : 'Img'}
                      </div>
                    )}
                    <div className="truncate">
                      <span className="font-bold text-primary text-sm block truncate">
                        {isRtl ? item.productNameAr : item.productNameEn}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        {isRtl ? 'سعر الوحدة:' : 'Unit Price:'} {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="font-black text-primary block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      {isRtl ? 'الكمية:' : 'Qty:'} {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Billing & Shipping Summary Widgets (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shipping Address Summary */}
          <OrderSummaryCard title={t('orders.details.shipping_address', 'عنوان الشحن')}>
            <div className="flex gap-2 items-start text-xs pt-1">
              <MapPin className="h-4.5 w-4.5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-primary">{order.shippingAddress.title}</p>
                <p className="text-muted-foreground mt-1 leading-relaxed text-[11px]">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `، ${order.shippingAddress.addressLine2}`}
                  <br />
                  {order.shippingAddress.city}، {order.shippingAddress.state}
                  <br />
                  {order.shippingAddress.country}
                  {order.shippingAddress.postalCode && `، ${order.shippingAddress.postalCode}`}
                </p>
              </div>
            </div>
          </OrderSummaryCard>

          {/* Payment Method Summary */}
          <OrderSummaryCard title={t('orders.details.payment_method', 'طريقة الدفع')}>
            <div className="flex gap-2 items-center text-xs pt-1 select-none">
              <CreditCard className="h-4.5 w-4.5 text-gold shrink-0" />
              <div>
                <span className="font-bold text-primary block">
                  {isRtl ? 'بطاقة ائتمانية / دفع إلكتروني' : 'Credit Card / Online Payment'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>
                    {order.paymentStatus === 'paid'
                      ? t('orders.details.paid_status', 'تمت تسوية المدفوعات بأمان')
                      : t('orders.details.unpaid_status', 'بانتظار سداد الدفعة')}
                  </span>
                </span>
              </div>
            </div>
          </OrderSummaryCard>

          {/* Invoice Summary */}
          <OrderSummaryCard title={t('orders.details.invoice_summary', 'خلاصة الفاتورة')}>
            <InvoiceSummary
              subtotal={order.subtotal}
              discountAmount={order.discountAmount}
              shippingFee={order.shippingFee}
              taxAmount={order.taxAmount}
              totalAmount={order.totalAmount}
              isRtl={isRtl}
            />
          </OrderSummaryCard>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
