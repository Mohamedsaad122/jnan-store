import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import dashboardOrdersService from '../services/orders.service';
import SectionHeader from '../components/SectionHeader';
import OrderCard from '../components/OrderCard';
import { EmptyState } from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Order } from '@/types/domain';

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');

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

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/orders/${id}`);
  };

  // Filter orders based on active tab state
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'active') {
      return ['pending', 'processing', 'shipped'].includes(order.status);
    }
    if (activeTab === 'delivered') {
      return ['delivered'].includes(order.status);
    }
    if (activeTab === 'cancelled') {
      return ['cancelled', 'refunded'].includes(order.status);
    }
    return true;
  });

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header */}
      <SectionHeader
        title={t('dashboard.nav.orders', 'طلباتي')}
        subtitle={
          isRtl
            ? 'مراجعة وتتبع جميع طلباتك السابقة وتفاصيل شحنها وحالتها.'
            : 'Review, track, and manage all your past orders and shipping statuses.'
        }
      />

      {isLoading ? (
        <div className="py-12 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-8 bg-card border border-border/40 rounded-2xl flex items-center justify-center p-6 shadow-xs select-none">
          <EmptyState
            icon={<ShoppingBag className="h-10 w-10 text-gold/60" />}
            title={isRtl ? 'لا توجد أي طلبات سابقة' : 'No past orders found'}
            description={
              isRtl
                ? 'تصفح تشكيلة منتجاتنا المميزة من القهوة السعودية الفاخرة والتمور وابدأ التسوق الآن!'
                : 'Browse our signature coffee and date selections to start shopping now!'
            }
            primaryAction={{
              label: isRtl ? 'تصفح المتجر' : 'Go to Shop',
              to: '/shop',
            }}
          />
        </div>
      ) : (
        <>
          {/* Tabs Segment Control */}
          <div className="flex border-b border-border/40 select-none pb-0 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 sm:px-6 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent ${
                activeTab === 'all'
                  ? 'border-gold text-gold font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
            >
              {isRtl ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 sm:px-6 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent ${
                activeTab === 'active'
                  ? 'border-gold text-gold font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
            >
              {isRtl ? 'طلبات نشطة' : 'Active Orders'}
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-4 sm:px-6 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent ${
                activeTab === 'delivered'
                  ? 'border-gold text-gold font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
            >
              {isRtl ? 'تم التوصيل' : 'Delivered'}
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 sm:px-6 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer border-0 bg-transparent ${
                activeTab === 'cancelled'
                  ? 'border-gold text-gold font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
            >
              {isRtl ? 'طلبات ملغاة' : 'Cancelled Orders'}
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl bg-card/10 select-none">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4 border border-gold/15">
                <ShoppingBag className="h-5 w-5 text-gold/60" />
              </div>
              <h3 className="text-sm font-bold text-primary mb-1">
                {activeTab === 'active'
                  ? isRtl
                    ? 'لا توجد طلبات نشطة حالياً'
                    : 'No active orders'
                  : activeTab === 'delivered'
                    ? isRtl
                      ? 'لا توجد طلبات تم توصيلها بعد'
                      : 'No delivered orders yet'
                    : activeTab === 'cancelled'
                      ? isRtl
                        ? 'لا توجد طلبات ملغاة'
                        : 'No cancelled orders'
                      : isRtl
                        ? 'لا توجد طلبات مطابقة'
                        : 'No matching orders'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                {isRtl
                  ? 'لا توجد لديك طلبات تندرج تحت هذا القسم في الوقت الحالي.'
                  : 'There are no orders categorized under this list right now.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 pt-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewDetails}
                  isRtl={isRtl}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
