import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Share2,
  Copy,
  X,
  MessageSquare,
  Facebook,
  Twitter,
  Send,
  Flame,
  Clock,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Product, ProductVariant } from '@/types/domain';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/utils/currency';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import ROUTES from '@/constants/routes';
import { twMerge } from 'tailwind-merge';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // 0. Advanced Commerce Experience States
  const [liveViews, setLiveViews] = useState(12);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 30, seconds: 0 });
  const [shippingCity, setShippingCity] = useState('');
  const [shippingCost, setShippingCost] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [recentPurchase, setRecentPurchase] = useState<{
    city: string;
    time: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    // Dynamic views update
    const viewsInterval = setInterval(() => {
      setLiveViews(Math.floor(Math.random() * (18 - 5 + 1)) + 5);
    }, 10000);

    // Delivery countdown update
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(18, 0, 0, 0); // 6:00 PM shipping cutoff
      if (now.getTime() > target.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      const diff = target.getTime() - now.getTime();
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Simulated purchase toasts cycling
    const cities = [
      'الرياض',
      'جدة',
      'الدمام',
      'المدينة المنورة',
      'مكة المكرمة',
      'الخبر',
      'الجبيل',
      'خميس مشيط',
    ];
    const times = ['قبل دقيقتين', 'قبل ٥ دقائق', 'قبل دقيقة واحدة', 'قبل ٧ دقائق', 'قبل ١٢ دقيقة'];

    const showToast = () => {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      const randomProduct = isRtl ? product.nameAr : product.nameEn;
      setRecentPurchase({ city: randomCity, time: randomTime, name: randomProduct });
      setTimeout(() => setRecentPurchase(null), 5500);
    };

    const initialToastTimeout = setTimeout(showToast, 3500);
    const toastInterval = setInterval(showToast, 28000);

    return () => {
      clearInterval(viewsInterval);
      clearInterval(timer);
      clearTimeout(initialToastTimeout);
      clearInterval(toastInterval);
    };
  }, [product, isRtl]);

  const handleCalculateShipping = (city: string) => {
    setShippingCity(city);
    if (!city) {
      setShippingCost(null);
      setDeliveryDate(null);
      return;
    }
    const isRiyadh = city === 'الرياض' || city === 'Riyadh';
    setShippingCost('١٥ ر.س'); // default shipping rate

    const date = new Date();
    date.setDate(date.getDate() + (isRiyadh ? 1 : 3));
    setDeliveryDate(
      date.toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    );
  };

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Social Sharing States & Actions
  const [isShareOpen, setIsShareOpen] = useState(false);
  const productUrl = window.location.href;
  const shareTitle = isRtl ? product.nameAr : product.nameEn;

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: t('product.share_text', {
            defaultValue: `شاهد هذا المنتج الرائع في متجر جنان: ${shareTitle}`,
          }),
          url: productUrl,
        });
      } catch (err) {
        console.log('[Sharing] Native share failed, opening modal:', err);
        setIsShareOpen(true);
      }
    } else {
      setIsShareOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    toast.success(t('product.copied_success', { defaultValue: 'تم نسخ رابط المنتج بنجاح!' }));
    setIsShareOpen(false);
  };

  // 1. Variant Management
  const hasVariants = product.variants && product.variants.length > 0;

  // Extract all attribute keys (e.g. 'weight', 'grind')
  const attributeKeys = React.useMemo(() => {
    if (!hasVariants) return [];
    const keys = new Set<string>();
    product.variants.forEach((v) => {
      Object.keys(v.attributes).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [product.variants, hasVariants]);

  // Set initial selected options mapping to the first variant
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (hasVariants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedOptions(defaultVariant.attributes);
      setActiveVariant(defaultVariant);
    } else {
      setActiveVariant(null);
    }
  }, [product, hasVariants]);

  // Handle changing an option (e.g. picking a different weight)
  const handleOptionSelect = (key: string, value: string) => {
    const nextOptions = { ...selectedOptions, [key]: value };
    setSelectedOptions(nextOptions);

    // Find the variant that matches all selected options
    const matched = product.variants.find((v) =>
      Object.entries(nextOptions).every(([optKey, optVal]) => v.attributes[optKey] === optVal)
    );

    if (matched) {
      setActiveVariant(matched);
    }
  };

  // Derive active properties based on active variant or fallback to base product
  const price = activeVariant ? activeVariant.price : product.price;
  const salePrice = activeVariant ? activeVariant.salePrice : product.salePrice;
  const stock = activeVariant ? activeVariant.stock : product.stock;
  const sku = activeVariant ? activeVariant.sku : product.sku;

  const hasDiscount = !!salePrice && salePrice < price;
  const currentPrice = hasDiscount ? salePrice! : price;
  const originalPrice = price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= 8;

  // 2. Quantity Management
  const [quantity, setQuantity] = useState(1);

  // Reset quantity to 1 when active variant shifts
  useEffect(() => {
    setQuantity(1);
  }, [activeVariant]);

  // 3. Action Handlers
  const name = isRtl ? product.nameAr : product.nameEn;
  const isWishlisted = isInWishlist(product.id);

  const getVariantLabel = () => {
    if (!activeVariant) return '';
    return isRtl ? ` - ${activeVariant.nameAr}` : ` - ${activeVariant.nameEn}`;
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      name: `${name}${getVariantLabel()}`,
      price: currentPrice,
      imageUrl: product.images[0]?.url,
      quantity,
    });

    toast.success(t('cart.added_success', { defaultValue: 'تم إضافة المنتج إلى سلتك بنجاح' }));
  };

  const handleBuyNowClick = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      name: `${name}${getVariantLabel()}`,
      price: currentPrice,
      imageUrl: product.images[0]?.url,
      quantity,
    });

    navigate(ROUTES.CHECKOUT);
  };

  const handleWishlistToggleClick = () => {
    toggleWishlist(product.id);
    if (isWishlisted) {
      toast.success(t('wishlist.removed', { defaultValue: 'تمت الإزالة من المفضلة' }));
    } else {
      toast.success(t('wishlist.added', { defaultValue: 'تمت الإضافة للمفضلة' }));
    }
  };

  const formatNumber = (num: number) => {
    return isRtl
      ? new Intl.NumberFormat('ar-SA').format(num)
      : new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="flex flex-col text-right font-tajawal w-full">
      {/* Brand & Category row */}
      <div className="flex items-center justify-between text-xs font-semibold select-none mb-1">
        {product.brand && (
          <span className="text-gold font-tajawal uppercase tracking-wider">
            {isRtl ? product.brand.nameAr : product.brand.nameEn}
          </span>
        )}
        <span className="text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
          {product.category ? (isRtl ? product.category.nameAr : product.category.nameEn) : ''}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-xl md:text-2xl font-black text-primary leading-tight font-tajawal mb-2.5">
        {name}
      </h1>

      {/* Ratings & reviews sum */}
      <div className="flex items-center justify-start gap-1 text-xs text-muted-foreground select-none mb-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-0.5 text-gold">
          <span className="font-bold text-primary dark:text-gold text-sm">
            {formatNumber(product.rating)}
          </span>
          <span className="text-gold">★</span>
        </div>
        <span>
          (
          {t('product.reviews_count', {
            count: product.reviewsCount,
            defaultValue: `${formatNumber(product.reviewsCount)} تقييم`,
          })}
          )
        </span>
        <span className="text-border mx-1.5">•</span>
        <span className="font-sans text-xs">SKU: {sku}</span>
      </div>

      {/* Live views & popularity badge */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-gold select-none mb-4">
        <Flame className="h-4 w-4 fill-amber-500/10 animate-pulse text-amber-500" />
        <span>
          {isRtl
            ? `يشاهد هذا المنتج الآن ${formatNumber(liveViews)} عملاء`
            : `${liveViews} customers are viewing this product right now`}
        </span>
      </div>

      {/* Price Block */}
      <div className="flex flex-col gap-1 mb-5 select-text">
        {hasDiscount && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground line-through decoration-destructive/80 font-sans">
              {formatCurrency(originalPrice, language)}
            </span>
            <span className="inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-destructive/10 text-destructive select-none">
              {isRtl ? `خصم ${formatNumber(discountPercent)}٪` : `${discountPercent}% OFF`}
            </span>
          </div>
        )}
        <span className="text-2xl font-black text-primary dark:text-gold font-sans">
          {formatCurrency(currentPrice, language)}
        </span>
      </div>

      {/* Description Snippet */}
      <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed font-light mb-6 select-text">
        {isRtl ? product.descriptionAr : product.descriptionEn}
      </p>

      {/* Variants Options Selectors */}
      {hasVariants &&
        attributeKeys.map((key) => {
          // Collect all unique option values for this attribute key
          const uniqueValues = Array.from(
            new Set(product.variants.map((v) => v.attributes[key]).filter(Boolean))
          );

          return (
            <div key={key} className="mb-5 select-none border-t border-border/20 pt-4">
              <h4 className="text-xs font-bold text-primary mb-2.5">
                {key === 'weight'
                  ? t('product.option_weight', { defaultValue: 'الوزن / الحجم' })
                  : key === 'grind'
                    ? t('product.option_grind', { defaultValue: 'نوع الطحن' })
                    : key}
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {uniqueValues.map((val) => {
                  const isSelected = selectedOptions[key] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleOptionSelect(key, val)}
                      className={twMerge(
                        'px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-background border-border/60 hover:border-gold/40 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Stock Alerts & Status */}
      <div className="mb-6 select-none border-t border-border/20 pt-4">
        {isOutOfStock ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive text-xs font-bold">
            <AlertTriangle className="h-4 w-4" />
            <span>{t('product.out_of_stock', { defaultValue: 'نفذت الكمية من المخزن' })}</span>
          </div>
        ) : isLowStock ? (
          <div className="flex flex-col gap-2.5 w-full max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-500 text-xs font-bold self-start">
              <AlertTriangle className="h-4 w-4 text-red-500 animate-bounce" />
              <span>
                {t('product.low_stock_count', {
                  count: stock,
                  defaultValue: `عجّل بالطلب! متبقي ${formatNumber(stock)} قطع فقط في المخزون`,
                })}
              </span>
            </div>
            {/* Visual Urgency Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stock / 8) * 100}%` }}
                className="h-full bg-red-500 rounded-full"
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-xs font-bold">
            <CheckCircle className="h-4 w-4" />
            <span>{t('product.in_stock', { defaultValue: 'متوفر في المخزن وجاهز للشحن' })}</span>
          </div>
        )}
      </div>

      {/* Quantity and Actions row */}
      {/* Delivery Countdown Timer */}
      {!isOutOfStock && (
        <div className="mb-4 p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300 select-none animate-fade-in">
          <Clock className="h-4 w-4 text-amber-600 dark:text-gold shrink-0 animate-pulse" />
          <span className="font-medium leading-relaxed">
            {isRtl ? (
              <>
                اطلب خلال{' '}
                <span className="font-extrabold font-mono bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200">
                  {timeLeft.hours.toString().padStart(2, '0')}:
                  {timeLeft.minutes.toString().padStart(2, '0')}:
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>{' '}
                للحصول على شحن سريع غداً!
              </>
            ) : (
              <>
                Order within{' '}
                <span className="font-extrabold font-mono bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200">
                  {timeLeft.hours.toString().padStart(2, '0')}:
                  {timeLeft.minutes.toString().padStart(2, '0')}:
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>{' '}
                to get fast delivery tomorrow!
              </>
            )}
          </span>
        </div>
      )}

      {/* Quantity and Actions row */}
      {!isOutOfStock && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 select-none mb-6">
          {/* Quantity selector */}
          <QuantitySelector
            quantity={quantity}
            stock={stock}
            onChange={setQuantity}
            className="h-12 w-full sm:w-32 bg-muted/20 border-border/60"
          />

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full">
            <Button
              onClick={handleAddToCartClick}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 h-12 border-primary text-primary hover:bg-primary/5 font-bold rounded-xl text-xs sm:text-sm transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{t('product.add_to_cart', { defaultValue: 'أضف للسلة' })}</span>
            </Button>
            <Button
              onClick={handleBuyNowClick}
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all border border-gold/10"
            >
              <CreditCard className="h-4 w-4" />
              <span>{t('product.buy_now', { defaultValue: 'شراء الآن' })}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Wishlist and Share */}
      <div className="border-t border-border/30 pt-4 flex items-center justify-start gap-3 select-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWishlistToggleClick}
          className={`flex items-center gap-1.5 text-xs font-bold transition-all py-1.5 px-3 rounded-lg border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
            isWishlisted
              ? 'text-red-500 border-red-500/20 bg-red-500/5'
              : 'text-muted-foreground border-border/40 hover:border-red-500/30 hover:text-red-500 hover:bg-red-500/5'
          }`}
          aria-label={isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <motion.div
            animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`h-4.5 w-4.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
            />
          </motion.div>
          <span>
            {isWishlisted
              ? t('wishlist.remove_label', { defaultValue: 'في المفضلة' })
              : t('wishlist.add_label', { defaultValue: 'إضافة للمفضلة' })}
          </span>
        </motion.button>

        <button
          onClick={handleShareClick}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground border border-border/40 hover:border-gold/30 hover:text-gold hover:bg-gold/5 transition-colors py-1.5 px-3 rounded-lg cursor-pointer"
          aria-label="مشاركة المنتج"
        >
          <Share2 className="h-4 w-4" />
          <span>{t('product.share_label', { defaultValue: 'مشاركة' })}</span>
        </button>
      </div>

      {/* Shipping Calculator */}
      <div className="mt-6 border-t border-border/20 pt-5 select-none">
        <h4 className="text-xs font-black text-primary dark:text-gold mb-3 flex items-center gap-1.5">
          <Truck className="h-4 w-4 text-gold" />
          <span>{isRtl ? 'حاسبة الشحن والتوصيل' : 'Shipping & Delivery Calculator'}</span>
        </h4>
        <div className="flex gap-2">
          <select
            value={shippingCity}
            onChange={(e) => handleCalculateShipping(e.target.value)}
            className="flex-1 h-10 px-3 rounded-xl border border-border/60 bg-background text-xs font-bold font-tajawal focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">{isRtl ? 'اختر المدينة...' : 'Select City...'}</option>
            <option value="الرياض">{isRtl ? 'الرياض' : 'Riyadh'}</option>
            <option value="جدة">{isRtl ? 'جدة' : 'Jeddah'}</option>
            <option value="الدمام">{isRtl ? 'الدمام' : 'Dammam'}</option>
            <option value="مكة المكرمة">{isRtl ? 'مكة المكرمة' : 'Mecca'}</option>
            <option value="المدينة المنورة">{isRtl ? 'المدينة المنورة' : 'Medina'}</option>
            <option value="الخبر">{isRtl ? 'الخبر' : 'Khobar'}</option>
          </select>
        </div>
        {shippingCost && deliveryDate && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-muted/30 border border-border/40 rounded-xl text-xs space-y-1.5"
          >
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isRtl ? 'تكلفة الشحن:' : 'Shipping Cost:'}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-500">
                {shippingCost}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isRtl ? 'تاريخ التوصيل المتوقع:' : 'Estimated Delivery:'}
              </span>
              <span className="font-bold text-primary dark:text-gold">{deliveryDate}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Trust & Safe Badges Card */}
      <div className="mt-5 p-4 border border-border/40 bg-card/25 rounded-2xl space-y-4">
        <div className="flex flex-col gap-2">
          {/* Return policy */}
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <RotateCcw className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <div className="text-right">
              <span className="font-bold text-primary dark:text-gold block">
                {isRtl ? 'سياسة إرجاع مرنة وسهلة' : 'Easy 14-Day Returns'}
              </span>
              <span className="text-[11px] leading-relaxed block">
                {isRtl
                  ? 'إرجاع مجاني خلال ١٤ يوماً. نستلم الشحنة من باب منزلك دون تعقيد.'
                  : 'Free returns within 14 days. Hassle-free courier pickup at your doorstep.'}
              </span>
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground pt-2.5 border-t border-border/10">
            <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <div className="text-right">
              <span className="font-bold text-primary dark:text-gold block">
                {isRtl ? 'ضمان الأصالة والجودة' : 'Authentic Quality Guarantee'}
              </span>
              <span className="text-[11px] leading-relaxed block">
                {isRtl
                  ? 'نضمن لك منتجات طبيعية وأصلية ١٠٠٪ معبأة ومخزنة بأعلى معايير سلامة الأغذية.'
                  : 'We guarantee 100% authentic premium grade product packed and handled under strict safety conditions.'}
              </span>
            </div>
          </div>
        </div>

        {/* Secure Checkout Badge */}
        <div className="pt-3 border-t border-border/15 flex flex-col items-center gap-2 select-none text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {isRtl ? 'دفع آمن وموثوق ١٠٠٪' : '100% SECURE & ENCRYPTED CHECKOUT'}
          </span>
          <div className="flex items-center justify-center gap-3 opacity-95">
            <span className="text-[10px] bg-muted/40 font-bold px-2 py-0.5 rounded border text-muted-foreground font-sans">
              mada
            </span>
            <span className="text-[10px] bg-muted/40 font-bold px-2 py-0.5 rounded border text-muted-foreground font-sans">
              Visa
            </span>
            <span className="text-[10px] bg-muted/40 font-bold px-2 py-0.5 rounded border text-muted-foreground font-sans">
              Mastercard
            </span>
            <span className="text-[10px] bg-muted/40 font-bold px-2 py-0.5 rounded border text-muted-foreground font-sans">
              Apple Pay
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Specifications Accordion */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-5 border border-border/40 bg-card/25 rounded-2xl overflow-hidden select-none">
          <details className="group">
            <summary className="flex items-center justify-between p-4 text-xs font-bold text-primary dark:text-gold cursor-pointer hover:bg-muted/15 focus:outline-none list-none">
              <span>{isRtl ? 'المواصفات الفنية للمنتج' : 'Technical Specifications'}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="p-4 pt-0 border-t border-border/10">
              <table className="w-full text-xs text-right border-collapse">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr
                      key={idx}
                      className={
                        idx % 2 === 0
                          ? 'bg-muted/15 border-b border-border/10'
                          : 'border-b border-border/10'
                      }
                    >
                      <td className="px-3 py-2 font-bold text-primary border-l border-border/10 w-1/3 bg-muted/5">
                        {key}
                      </td>
                      <td className="px-3 py-2 font-medium text-muted-foreground">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}

      {/* Live Recent Purchase Toast Indicator */}
      <AnimatePresence>
        {recentPurchase && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 start-4 z-40 bg-card border border-gold/20 shadow-2xl p-3.5 rounded-2xl flex items-center gap-3 max-w-xs select-none"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="h-10 w-10 rounded-xl bg-gold-light/20 flex items-center justify-center text-gold text-lg shrink-0">
              🛒
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                {isRtl ? 'عملية شراء حديثة' : 'Live Purchase'}
              </span>
              <p className="text-xs font-bold text-primary dark:text-gold line-clamp-1">
                {recentPurchase.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                {isRtl
                  ? `اشترى عميل في ${recentPurchase.city} (${recentPurchase.time})`
                  : `A customer in ${recentPurchase.city} bought this (${recentPurchase.time})`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal Dialog overlay */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-tajawal">
          <div className="fixed inset-0" onClick={() => setIsShareOpen(false)} />
          <div
            className="relative z-10 w-full max-w-sm bg-card border rounded-2xl p-5 shadow-2xl text-right animate-fade-in"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b select-none">
              <button
                onClick={() => setIsShareOpen(false)}
                className="p-1.5 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground border-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <h4 className="text-sm font-extrabold text-primary dark:text-gold">
                {isRtl ? 'مشاركة المنتج' : 'Share Product'}
              </h4>
            </div>

            {/* Sharing list of options */}
            <div className="flex flex-col gap-2.5">
              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:border-gold/40 text-xs font-bold text-foreground cursor-pointer bg-card hover:bg-gold/5"
              >
                <span className="flex items-center gap-2">
                  <Copy className="h-4 w-4 text-gold" />
                  <span>{isRtl ? 'نسخ رابط المنتج' : 'Copy Product Link'}</span>
                </span>
              </button>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' - ' + productUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:border-gold/40 text-xs font-bold text-foreground cursor-pointer bg-card hover:bg-gold/5 decoration-none"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span>{isRtl ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}</span>
                </span>
              </a>

              {/* Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(productUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:border-gold/40 text-xs font-bold text-foreground cursor-pointer bg-card hover:bg-gold/5 decoration-none"
              >
                <span className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-sky-500" />
                  <span>{isRtl ? 'مشاركة عبر إكس (تويتر)' : 'Share on X (Twitter)'}</span>
                </span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:border-gold/40 text-xs font-bold text-foreground cursor-pointer bg-card hover:bg-gold/5 decoration-none"
              >
                <span className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <span>{isRtl ? 'مشاركة عبر فيسبوك' : 'Share on Facebook'}</span>
                </span>
              </a>

              {/* Telegram */}
              <a
                href={`https://telegram.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:border-gold/40 text-xs font-bold text-foreground cursor-pointer bg-card hover:bg-gold/5 decoration-none"
              >
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-sky-600" />
                  <span>{isRtl ? 'مشاركة عبر تليجرام' : 'Share on Telegram'}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
