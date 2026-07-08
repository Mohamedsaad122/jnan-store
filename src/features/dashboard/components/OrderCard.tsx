import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye, Truck, FileText, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OrderStatusBadge, { OrderStatus } from './OrderStatusBadge';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Order } from '@/types/domain';
import { toast } from 'react-hot-toast';
import { useCartStore as useCartStoreActual } from '@/store/cart.store';

interface OrderCardProps {
  order: Order;
  onViewDetails: (id: string) => void;
  isRtl: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, isRtl }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'mada':
        return isRtl ? 'مدى' : 'Mada';
      case 'visa':
        return isRtl ? 'فيزا' : 'Visa';
      case 'applepay':
      case 'apple_pay':
        return isRtl ? 'أبل باي' : 'Apple Pay';
      case 'cod':
      case 'cash_on_delivery':
        return isRtl ? 'الدفع عند الاستلام' : 'Cash on Delivery';
      case 'stcpay':
        return isRtl ? 'stc pay' : 'STC Pay';
      default:
        return isRtl ? 'بطاقة ائتمانية' : 'Credit Card';
    }
  };

  const getDeliveryMethodLabel = () => {
    if (!order.shippingMethod) return isRtl ? 'شحن قياسي' : 'Standard Shipping';
    return isRtl ? order.shippingMethod.nameAr : order.shippingMethod.nameEn;
  };

  const getDeliveryDateLabel = () => {
    if (order.status === 'delivered') {
      return isRtl
        ? `تم التوصيل في ${formatDate(order.updatedAt)}`
        : `Delivered on ${formatDate(order.updatedAt)}`;
    }
    if (order.status === 'cancelled') {
      return isRtl ? 'طلب ملغي' : 'Cancelled';
    }
    return isRtl
      ? `التوصيل المتوقع: ${order.shippingMethod?.estimatedDeliveryAr || '٣-٥ أيام عمل'}`
      : `Est. Delivery: ${order.shippingMethod?.estimatedDeliveryEn || '3-5 business days'}`;
  };

  const handleTrackOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(
      isRtl
        ? `رقم التتبع: ${order.trackingNumber || 'JN-TRK-9831749'} عبر شركة شحن ناقل (التسليم المتوقع خلال يومين)`
        : `Tracking Ref: ${order.trackingNumber || 'JN-TRK-9831749'} via Naqel Express (Est. Delivery 2 days)`,
      {
        duration: 5000,
        style: {
          border: '1px solid rgba(196, 160, 84, 0.3)',
          padding: '12px',
          borderRadius: '16px',
          background: 'var(--card)',
          color: 'var(--card-foreground)',
        },
      }
    );
  };

  const handleDownloadInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(
      isRtl
        ? `جاري تحميل الفاتورة للطلب ${order.orderNumber}...`
        : `Downloading invoice for order ${order.orderNumber}...`
    );
  };

  const handleReorder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      order.items.forEach((item) => {
        useCartStoreActual.getState().addItem({
          productId: item.productId,
          name: isRtl ? item.productNameAr : item.productNameEn,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        });
      });
      toast.success(
        isRtl
          ? 'تمت إعادة إضافة منتجات هذا الطلب إلى سلتك بنجاح!'
          : 'Order items have been successfully added to your cart!'
      );
      navigate('/cart');
    } catch {
      toast.error(isRtl ? 'فشل إعادة طلب المنتجات' : 'Failed to reorder items');
    }
  };

  return (
    <Card className="p-5 sm:p-6 border border-border/40 shadow-xs text-right font-tajawal relative hover:border-gold/30 transition-all select-none">
      {/* Card Header metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/10 pb-4 mb-4 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-primary">{order.orderNumber}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              ({formatDate(order.createdAt)})
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {t('orders.id_label', 'معرف الطلب')}: {order.id}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Custom Status and Payment Badges */}
          <OrderStatusBadge status={order.status as OrderStatus} />
          <span
            className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold border ${
              order.paymentStatus === 'paid'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15'
            }`}
          >
            {isRtl
              ? order.paymentStatus === 'paid'
                ? 'تم السداد'
                : 'بانتظار الدفع'
              : order.paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Sub-row for payment & delivery status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs py-3 bg-muted/10 px-4 rounded-xl border border-border/5 mb-4 select-text">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[10px]">
            {isRtl ? 'طريقة الدفع' : 'Payment Method'}
          </span>
          <span className="font-bold text-primary">
            {getPaymentMethodLabel(order.paymentMethod)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[10px]">
            {isRtl ? 'طريقة التوصيل' : 'Delivery Method'}
          </span>
          <span className="font-bold text-primary">{getDeliveryMethodLabel()}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[10px]">
            {isRtl ? 'موعد التوصيل' : 'Delivery Date'}
          </span>
          <span className="font-bold text-primary">{getDeliveryDateLabel()}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[10px]">
            {isRtl ? 'رقم التتبع' : 'Tracking Number'}
          </span>
          <span className="font-bold text-primary font-sans">{order.trackingNumber || '-'}</span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="space-y-3 py-1">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-xs py-1.5 border-b border-border/5 last:border-b-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.imageUrl ? (
                <OptimizedImage
                  src={item.imageUrl}
                  alt={isRtl ? item.productNameAr : item.productNameEn}
                  aspectRatioClassName="w-10 h-10 shrink-0"
                  className="h-full w-full object-cover rounded-lg border border-border/40"
                />
              ) : (
                <div className="h-10 w-10 bg-muted/40 rounded-lg border border-border/40 flex items-center justify-center text-muted-foreground text-[10px] shrink-0">
                  {isRtl ? 'صورة' : 'Img'}
                </div>
              )}
              <div className="truncate">
                <span className="font-bold text-primary block truncate">
                  {isRtl ? item.productNameAr : item.productNameEn}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {isRtl ? 'الكمية:' : 'Qty:'} {item.quantity} × {formatPrice(item.price)}
                </span>
              </div>
            </div>
            <span className="font-bold text-primary shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer view action */}
      <div className="border-t border-border/10 mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <span className="text-xs font-bold text-muted-foreground">
            {isRtl ? 'المجموع الكلي:' : 'Total Amount:'}
          </span>
          <span className="font-black text-primary text-base">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
          {/* Invoice action */}
          <Button
            onClick={handleDownloadInvoice}
            variant="ghost"
            size="sm"
            className="text-xs font-bold gap-1 text-muted-foreground hover:text-primary hover:bg-muted/30"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{isRtl ? 'الفاتورة' : 'Invoice'}</span>
          </Button>

          {/* Track Order action */}
          {['processing', 'shipped', 'delivered'].includes(order.status) && (
            <Button
              onClick={handleTrackOrder}
              variant="ghost"
              size="sm"
              className="text-xs font-bold gap-1.5 text-gold hover:bg-gold/5 border border-transparent hover:border-gold/15"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>{isRtl ? 'تتبع الشحنة' : 'Track'}</span>
            </Button>
          )}

          {/* Reorder action */}
          <Button
            onClick={handleReorder}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 border-gold/25 text-gold hover:bg-gold/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{isRtl ? 'إعادة طلب' : 'Reorder'}</span>
          </Button>

          {/* View Details action */}
          <Button
            onClick={() => onViewDetails(order.id)}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1 border-border/40 hover:bg-gold/10"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t('orders.action.view', 'عرض التفاصيل')}</span>
            {isRtl ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
