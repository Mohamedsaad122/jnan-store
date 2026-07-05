import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrendingUp, UserCheck, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import { useAddressStore } from '@/store/address.store';
import { useWishlistStore } from '@/store/wishlist.store';
import dashboardOrdersService from '../services/orders.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SummaryCard from '../components/SummaryCard';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Order } from '@/types/domain';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const { addresses } = useAddressStore();
  const { itemIds } = useWishlistStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      dashboardOrdersService
        .getOrders(user.id)
        .then((res) => {
          setOrders(res);
        })
        .catch(() => {})
        .finally(() => setIsLoadingOrders(false));
    }
  }, [user]);

  const formatNumber = (num: number) => {
    return isRtl ? new Intl.NumberFormat('ar-SA').format(num) : num.toString();
  };

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

  const getProfileCompletion = () => {
    if (!user) return 0;
    let score = 0;
    if (user.firstName) score += 20;
    if (user.lastName) score += 20;
    if (user.email) score += 20;
    if (user.phone) score += 20;
    if (user.avatarUrl || user.firstName) score += 20;
    return score;
  };

  const completionScore = getProfileCompletion();
  const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Overview Dashboard Welcome Title */}
      <SectionTitle
        title={t('dashboard.title', 'لوحة التحكم')}
        subtitle={
          isRtl
            ? 'نظرة عامة على حسابك وتفاصيل نشاطاتك.'
            : 'Overview of your account and recent activities.'
        }
      />

      {/* Welcome & Profile completeness tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-cardamom/5 to-gold/5 border-gold/15 shadow-sm relative overflow-hidden select-none">
          <div className="relative z-10 space-y-4">
            <h2 className="text-xl md:text-2xl font-black text-primary">
              {t('dashboard.overview.welcome', { name: user?.firstName || '' })}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl">
              {isRtl
                ? 'مرحباً بك في لوحة تحكم حسابك الخاصة. من هنا يمكنك متابعة طلباتك الأخيرة، تعديل عناوين الشحن، وإدارة إعدادات الأمان الخاصة بملفك الشخصي.'
                : 'Welcome to your account dashboard. From here, you can track your recent orders, manage shipping addresses, and edit security credentials.'}
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold border-gold/30 hover:bg-gold/10"
                onClick={() => navigate('/dashboard/profile')}
              >
                {isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile'}
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5 text-gold transform rotate-12 select-none pointer-events-none">
            <TrendingUp className="h-44 w-44" />
          </div>
        </Card>

        {/* Profile progress */}
        <Card className="p-6 flex flex-col justify-between border-border/40 shadow-sm select-none text-right">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-primary">
                {t('dashboard.overview.completion')}
              </h3>
              <UserCheck className="h-4.5 w-4.5 text-gold" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isRtl
                ? 'أكمل إدخال بيانات حسابك للحصول على تجربة تسوق أسرع وأسهل.'
                : 'Complete your profile details for a smoother shopping experience.'}
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center text-xs font-bold text-primary">
              <span>{isRtl ? 'النسبة المكتملة' : 'Completed Ratio'}</span>
              <span>{formatNumber(completionScore)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gold h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Summary cards row using the reusable SummaryCard component */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          title={t('dashboard.nav.orders')}
          value={formatNumber(orders.length)}
          description={isRtl ? 'إجمالي الطلبات المسجلة' : 'Total registered orders'}
          iconName="ShoppingBag"
          linkText={t('dashboard.overview.widgets.orders_view_all')}
          linkPath="/dashboard/orders"
        />

        <SummaryCard
          title={t('dashboard.nav.addresses')}
          value={formatNumber(addresses.length)}
          description={
            defaultAddress
              ? `${isRtl ? 'الافتراضي:' : 'Default:'} ${defaultAddress.title}`
              : isRtl
                ? 'لا يوجد عناوين'
                : 'No addresses saved'
          }
          iconName="MapPin"
          linkText={t('dashboard.overview.widgets.addresses_view_all')}
          linkPath="/dashboard/addresses"
        />

        <SummaryCard
          title={t('dashboard.nav.wishlist')}
          value={formatNumber(itemIds.length)}
          description={isRtl ? 'عدد منتجاتك المفضلة' : 'Bookmarked products count'}
          iconName="Heart"
          linkText={t('dashboard.overview.widgets.wishlist_view_all')}
          linkPath="/dashboard/wishlist"
        />
      </div>

      {/* Recent Orders table summary list */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-5 border-border/40 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b pb-3 mb-4 select-none text-right">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-gold" />
              <h3 className="font-bold text-sm text-primary">
                {t('dashboard.overview.widgets.orders_title')}
              </h3>
            </div>
            <Link
              to="/dashboard/orders"
              className="text-xs font-bold text-primary hover:text-gold transition-colors flex items-center gap-1"
            >
              <span>{t('dashboard.overview.widgets.orders_view_all')}</span>
              {isRtl ? (
                <ChevronLeft className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </Link>
          </div>

          <div className="flex-1">
            {isLoadingOrders ? (
              <div className="py-6 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                {t('dashboard.overview.widgets.no_orders')}
              </p>
            ) : (
              <div className="divide-y divide-border/20">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-right"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-primary">{order.orderNumber}</span>
                        <span className="text-[10px] text-muted-foreground">
                          ({formatDate(order.createdAt)})
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate max-w-sm">
                        {order.items
                          .map((i) => (isRtl ? i.productNameAr : i.productNameEn))
                          .join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="font-bold text-xs text-primary">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold select-none ${
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
