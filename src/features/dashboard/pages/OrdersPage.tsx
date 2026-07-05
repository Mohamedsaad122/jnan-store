import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import dashboardOrdersService from '../services/orders.service';
import Card from '@/components/ui/Card';
import SectionTitle from '../components/SectionTitle';
import EmptyDashboardState from '../components/EmptyDashboardState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Order } from '@/types/domain';

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dashboardOrdersService
        .getOrders(user.id)
        .then((res) => {
          setOrders(res);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const formatPrice = (num: number) => {
    return isRtl ? `${new Intl.NumberFormat('ar-SA').format(num)} ر.س` : `${num.toFixed(2)} SAR`;
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <SectionTitle
        title={t('dashboard.nav.orders')}
        subtitle={
          isRtl
            ? 'استعرض وتتبع جميع طلباتك السابقة وتفاصيل شحنها.'
            : 'Review and track all your past orders and shipping statuses.'
        }
      />

      {isLoading ? (
        <div className="py-12 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : orders.length === 0 ? (
        <EmptyDashboardState
          title={t('dashboard.overview.widgets.no_orders')}
          description={
            isRtl
              ? 'لم تقم بتقديم أي طلبات بعد. ابدأ بالتسوق الآن!'
              : 'No orders submitted yet. Start shopping now!'
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 border-border/40 shadow-xs text-right">
              {/* Order Metadata Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/20 pb-4 mb-4 gap-3 select-none">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-primary">{order.orderNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatDate(order.createdAt)})
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    ID: {order.id}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Shipping Status */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      order.status === 'delivered'
                        ? 'bg-green-500/10 text-green-500'
                        : order.status === 'processing'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-gold-light/10 text-gold'
                    }`}
                  >
                    {isRtl
                      ? order.status === 'delivered'
                        ? 'تم التوصيل'
                        : order.status === 'processing'
                          ? 'قيد التجهيز'
                          : 'معلق'
                      : order.status.toUpperCase()}
                  </span>

                  {/* Payment Status */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {isRtl
                      ? order.paymentStatus === 'paid'
                        ? 'مدفوع'
                        : 'معلق الدفع'
                      : order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Items Table/List */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={isRtl ? item.productNameAr : item.productNameEn}
                          className="h-10 w-10 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-muted/40 rounded-md border flex items-center justify-center text-muted-foreground text-[10px] select-none">
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

              {/* Total Summaries */}
              <div className="border-t border-border/20 mt-4 pt-4 flex items-center justify-between text-sm select-none">
                <span className="font-bold text-muted-foreground">
                  {isRtl ? 'المجموع الكلي:' : 'Total Amount:'}
                </span>
                <span className="font-black text-primary text-base">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
