import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  MapPin,
  Bell,
  Activity,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import { useAddresses } from '@/hooks/useAddressesQuery';
import { useWishlist } from '@/hooks/useWishlist';
import { useNotifications } from '@/hooks/useNotificationsQuery';
import { productsService } from '@/services/products/products.service';
import dashboardOrdersService from '../services/orders.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Order, Product } from '@/types/domain';
import { Helmet } from 'react-helmet-async';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import ROUTES from '@/constants/routes';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const { data: addresses = [] } = useAddresses();
  const { itemIds } = useWishlist();
  const { data: notifications = [] } = useNotifications();

  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([dashboardOrdersService.getOrders(user.id), productsService.getProducts()])
        .then(([ordersList, productsRes]) => {
          setOrders(ordersList);
          // Get 2 recommended products
          setRecommendedProducts(productsRes.data.slice(0, 2));
          // Get first 3 wishlist products
          const bookmarked = productsRes.data.filter((p) => itemIds.includes(p.id)).slice(0, 3);
          setWishlistProducts(bookmarked);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [user, itemIds]);

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
      month: 'short',
      day: 'numeric',
    });
  };

  const getProfileCompletion = () => {
    if (!user) return 0;
    let score = 0;
    if (user.firstName) score += 20;
    if (user.lastName) score += 20;
    if (user.phone) score += 20;
    if (user.city) score += 20;
    if (user.address) score += 20;
    return score;
  };

  const completionScore = getProfileCompletion();
  const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
  const recentOrders = orders.slice(0, 2);
  const recentNotifs = notifications.slice(0, 2);

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right font-tajawal" dir={isRtl ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{isRtl ? 'لوحة التحكم | متجر جنان' : 'Dashboard | Jnan Store'}</title>
      </Helmet>

      {/* Greeting Banner & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-cardamom/10 via-background to-gold/5 border-gold/15 shadow-sm relative overflow-hidden select-none flex flex-col justify-between min-h-[160px]">
          <div className="relative z-10 space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-primary">
              {isRtl
                ? `مرحباً بك، ${user?.firstName || 'عميلنا العزيز'} 👋`
                : `Welcome back, ${user?.firstName || 'Guest'} 👋`}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              {isRtl
                ? 'من لوحة التحكم الخاصة بك، يمكنك تتبع شحناتك الأخيرة، وإدارة العناوين المسجلة وتعديل تفضيلات حسابك وإعدادات الأمان بسهولة.'
                : 'From your personalized dashboard, you can track active shipments, manage saved locations, and adjust security preferences.'}
            </p>
          </div>
          <div className="flex gap-3 pt-4 select-none relative z-10">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-gold/30 hover:bg-gold/10 cursor-pointer"
              onClick={() => navigate('/dashboard/profile')}
            >
              {isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile'}
            </Button>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5 text-gold transform rotate-12 select-none pointer-events-none">
            <TrendingUp className="h-44 w-44" />
          </div>
        </Card>

        {/* Profile Completion percentage */}
        <Card className="p-6 flex flex-col justify-between border-border/40 shadow-sm select-none text-right">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-primary">
                {isRtl ? 'نسبة اكتمال الحساب' : 'Profile Completion'}
              </h3>
              <UserCheck className="h-4.5 w-4.5 text-gold" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {isRtl
                ? 'أكمل إدخال عنوانك وهاتفك للحصول على تجربة شحن وتسوق أسرع.'
                : 'Complete address details for an optimized checkout workflow.'}
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center text-xs font-bold text-primary">
              <span>{isRtl ? 'النسبة المكتملة' : 'Completed Ratio'}</span>
              <span>{formatNumber(completionScore)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gold h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Left 2/3 Content, Right 1/3 Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions, Recent Orders, Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <Card className="p-5 border border-border/40 shadow-xs">
            <h3 className="font-bold text-xs sm:text-sm text-primary border-b border-border/10 pb-2.5 mb-4 select-none">
              {isRtl ? 'إجراءات سريعة' : 'Quick Actions'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
              <button
                onClick={() => navigate(ROUTES.SHOP)}
                className="p-3 bg-muted/20 border border-border/40 hover:border-gold/30 hover:bg-gold/5 rounded-xl text-center group cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-primary block">
                  {isRtl ? 'تسوق المنتجات' : 'Browse Shop'}
                </span>
              </button>

              <button
                onClick={() => navigate('/dashboard/addresses')}
                className="p-3 bg-muted/20 border border-border/40 hover:border-gold/30 hover:bg-gold/5 rounded-xl text-center group cursor-pointer"
              >
                <MapPin className="h-5 w-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-primary block">
                  {isRtl ? 'عناوين الشحن' : 'Addresses'}
                </span>
              </button>

              <button
                onClick={() => navigate('/dashboard/profile')}
                className="p-3 bg-muted/20 border border-border/40 hover:border-gold/30 hover:bg-gold/5 rounded-xl text-center group cursor-pointer"
              >
                <UserCheck className="h-5 w-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-primary block">
                  {isRtl ? 'تعديل الحساب' : 'Edit Profile'}
                </span>
              </button>

              <button
                onClick={() => navigate('/dashboard/support')}
                className="p-3 bg-muted/20 border border-border/40 hover:border-gold/30 hover:bg-gold/5 rounded-xl text-center group cursor-pointer"
              >
                <HelpCircle className="h-5 w-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-primary block">
                  {isRtl ? 'الدعم الفني' : 'Get Help'}
                </span>
              </button>
            </div>
          </Card>

          {/* Recent Orders Widget */}
          <Card className="p-5 border border-border/40 shadow-xs flex flex-col">
            <div className="flex items-center justify-between border-b border-border/10 pb-3 mb-4 select-none">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-gold" />
                <h3 className="font-bold text-sm text-primary">
                  {isRtl ? 'الطلبات الأخيرة' : 'Recent Orders'}
                </h3>
              </div>
              <Link
                to="/dashboard/orders"
                className="text-xs font-bold text-gold hover:text-primary transition-colors flex items-center gap-1"
              >
                <span>{isRtl ? 'عرض الكل' : 'View All'}</span>
                {isRtl ? (
                  <ChevronLeft className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </Link>
            </div>

            <div className="divide-y divide-border/10 select-text">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  {isRtl ? 'لا توجد طلبات مسجلة بعد.' : 'No orders found.'}
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-right"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/orders/${order.id}`}
                          className="font-bold text-xs text-primary hover:text-gold transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
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

                    <div className="flex items-center justify-between sm:justify-end gap-4 select-none">
                      <span className="font-black text-xs text-primary">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                          order.status === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15'
                            : order.status === 'cancelled'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/15'
                        }`}
                      >
                        {isRtl
                          ? order.status === 'delivered'
                            ? 'تم التوصيل'
                            : order.status === 'cancelled'
                              ? 'ملغي'
                              : 'قيد التجهيز'
                          : order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recommended Products */}
          <Card className="p-5 border border-border/40 shadow-xs">
            <div className="flex items-center gap-1.5 border-b border-border/10 pb-2.5 mb-4 select-none">
              <Sparkles className="h-4.5 w-4.5 text-gold animate-pulse" />
              <h3 className="font-bold text-xs sm:text-sm text-primary">
                {isRtl ? 'مقترحات مخصصة لك' : 'Recommended For You'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-muted/10 border border-border/30 rounded-xl hover:border-gold/30 transition-all select-text"
                >
                  <OptimizedImage
                    src={product.images?.[0]?.url || ''}
                    alt={isRtl ? product.nameAr : product.nameEn}
                    aspectRatioClassName="h-14 w-14 shrink-0"
                    className="object-cover rounded-lg border border-border/40 select-none"
                  />
                  <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <Link
                        to={`/products/${product.slug}`}
                        className="font-bold text-xs text-primary hover:text-gold block leading-tight truncate"
                      >
                        {isRtl ? product.nameAr : product.nameEn}
                      </Link>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {product.brand ? (isRtl ? product.brand.nameAr : product.brand.nameEn) : ''}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-gold font-sans select-none">
                      {formatPrice(product.salePrice || product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Address summary, Wishlist tray, Notifications tray, Timeline */}
        <div className="space-y-6">
          {/* Default Address Summary widget */}
          <Card className="p-5 border border-border/40 shadow-xs">
            <h3 className="font-bold text-xs sm:text-sm text-primary border-b border-border/10 pb-2.5 mb-3 select-none">
              {isRtl ? 'العنوان الافتراضي للشحن' : 'Default Delivery Address'}
            </h3>
            {defaultAddress ? (
              <div className="space-y-2 pt-1 select-text">
                <p className="font-bold text-xs text-primary flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gold" />
                  <span>{defaultAddress.title}</span>
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                  {defaultAddress.addressLine1}
                  {defaultAddress.addressLine2 && `، ${defaultAddress.addressLine2}`}
                  <br />
                  {defaultAddress.city}، {defaultAddress.state}
                  <br />
                  {defaultAddress.country}
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground select-none">
                {isRtl ? 'لا يوجد عناوين مسجلة حالياً.' : 'No saved addresses.'}
              </p>
            )}
          </Card>

          {/* Wishlist Summary Tray */}
          <Card className="p-5 border border-border/40 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/10 pb-2.5 mb-3 select-none">
              <h3 className="font-bold text-xs sm:text-sm text-primary">
                {isRtl ? 'المفضلة' : 'Wishlist Summary'}
              </h3>
              <Link
                to="/dashboard/wishlist"
                className="text-[10px] font-bold text-gold hover:text-primary"
              >
                {isRtl ? 'عرض الكل' : 'View All'}
              </Link>
            </div>

            {wishlistProducts.length === 0 ? (
              <p className="text-[11px] text-muted-foreground select-none">
                {isRtl ? 'المفضلة فارغة حالياً.' : 'Wishlist is empty.'}
              </p>
            ) : (
              <div className="flex items-center gap-2 pt-1 select-none">
                {wishlistProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="h-12 w-12 rounded-lg border border-border/40 overflow-hidden hover:border-gold/30 shrink-0 shadow-xs"
                    title={isRtl ? p.nameAr : p.nameEn}
                  >
                    <OptimizedImage
                      src={p.images?.[0]?.url || ''}
                      alt={isRtl ? p.nameAr : p.nameEn}
                      aspectRatioClassName="h-full w-full"
                      className="object-cover h-full w-full"
                    />
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Notifications summary tray */}
          <Card className="p-5 border border-border/40 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/10 pb-2.5 mb-3 select-none">
              <h3 className="font-bold text-xs sm:text-sm text-primary">
                {isRtl ? 'آخر التنبيهات' : 'Notifications'}
              </h3>
              <Link
                to="/dashboard/notifications"
                className="text-[10px] font-bold text-gold hover:text-primary"
              >
                {isRtl ? 'عرض الكل' : 'View All'}
              </Link>
            </div>

            <div className="space-y-3 pt-1 select-text">
              {recentNotifs.length === 0 ? (
                <p className="text-[11px] text-muted-foreground select-none">
                  {isRtl ? 'لا توجد تنبيهات جديدة.' : 'No alerts.'}
                </p>
              ) : (
                recentNotifs.map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-2.5 items-start text-xs border-b border-border/5 pb-2 last:border-b-0 last:pb-0"
                  >
                    <Bell className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[11px] text-primary block leading-tight">
                        {isRtl ? n.titleAr : n.titleEn}
                      </span>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {isRtl ? n.descAr : n.descEn}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Activity Timeline logger */}
          <Card className="p-5 border border-border/40 shadow-xs select-none">
            <h3 className="font-bold text-xs sm:text-sm text-primary border-b border-border/10 pb-2.5 mb-4">
              {isRtl ? 'سجل النشاطات الأخيرة' : 'Activity Log'}
            </h3>
            <div className="space-y-4 relative pl-1 text-right">
              {/* Connector */}
              <div className="absolute right-2 top-2 bottom-2 w-0.5 bg-border/40" />

              <div className="flex gap-2.5 items-start relative">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0 z-10 text-emerald-600 dark:text-emerald-400">
                  <Activity className="h-2.5 w-2.5" />
                </div>
                <div className="pt-0.5 space-y-0.5">
                  <span className="text-[10px] font-bold text-primary block">
                    {isRtl ? 'تسجيل دخول ناجح' : 'Successful login session'}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-sans">
                    {isRtl ? 'اليوم، ٠٣:١٠ ص' : 'Today, 03:10 AM'}
                  </span>
                </div>
              </div>

              {orders.length > 0 && (
                <div className="flex gap-2.5 items-start relative">
                  <div className="h-4.5 w-4.5 rounded-full bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0 z-10 text-blue-600 dark:text-blue-400">
                    <Clock className="h-2.5 w-2.5" />
                  </div>
                  <div className="pt-0.5 space-y-0.5">
                    <span className="text-[10px] font-bold text-primary block">
                      {isRtl
                        ? `شحن الطلب ${orders[0].orderNumber}`
                        : `Shipped order ${orders[0].orderNumber}`}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-sans">
                      {isRtl ? 'منذ يومين' : '2 days ago'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 items-start relative">
                <div className="h-4.5 w-4.5 rounded-full bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0 z-10 text-purple-600 dark:text-purple-400">
                  <UserCheck className="h-2.5 w-2.5" />
                </div>
                <div className="pt-0.5 space-y-0.5">
                  <span className="text-[10px] font-bold text-primary block">
                    {isRtl ? 'إنشاء وتوثيق الحساب' : 'Account created & verified'}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-sans">
                    {user?.createdAt ? formatDate(user.createdAt) : ''}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
