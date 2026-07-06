import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import dashboardOrdersService from '../services/orders.service';
import SectionHeader from '../components/SectionHeader';
import OrderCard from '../components/OrderCard';
import EmptyOrdersState from '../components/EmptyOrdersState';
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
        <EmptyOrdersState isRtl={isRtl} />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
              isRtl={isRtl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
