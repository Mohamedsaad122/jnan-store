import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Clock, AlertCircle } from 'lucide-react';
import { useFlashSales, useCategories } from '@/hooks/useProducts';
import { useLanguageStore } from '@/store/language.store';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import ProductCardSkeleton from '@/features/home/components/product-card/ProductCardSkeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/features/shop/components/EmptyState';
import { twMerge } from 'tailwind-merge';

export const Offers: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<string>('discount_desc');

  // Countdown timer state: 12 hours countdown initialized daily
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Calculate seconds until end of the day as a countdown
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diffMs = endOfDay.getTime() - now.getTime();
      if (diffMs <= 0) return { hours: 0, minutes: 0, seconds: 0 };

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch flash sales products and categories
  const { data: flashProducts = [], isLoading: isProductsLoading, isError } = useFlashSales();
  const { data: categories = [] } = useCategories();

  // Helper to format Arabic/English numbers
  const formatNumber = (num: number) => {
    return isRtl
      ? new Intl.NumberFormat('ar-SA', { minimumIntegerDigits: 2 }).format(num)
      : new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(num);
  };

  // Derive active category name for product card
  const getCategoryName = (catId: string) => {
    const categoryObj = categories.find((c) => c.id === catId);
    if (!categoryObj) return '';
    return isRtl ? categoryObj.nameAr : categoryObj.nameEn;
  };

  // 1. Filter products by category
  let processedProducts = [...flashProducts];
  if (activeCategory !== 'all') {
    processedProducts = processedProducts.filter((p) => p.categoryId === activeCategory);
  }

  // 2. Sort products
  processedProducts.sort((a, b) => {
    const discountA = Math.round(((a.price - (a.salePrice ?? a.price)) / a.price) * 100);
    const discountB = Math.round(((b.price - (b.salePrice ?? b.price)) / b.price) * 100);
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;

    switch (activeSort) {
      case 'price_asc':
        return priceA - priceB;
      case 'price_desc':
        return priceB - priceA;
      case 'discount_desc':
      default:
        return discountB - discountA; // highest discount percentage first
    }
  });

  const breadcrumbItems = [
    { label: t('nav.home', { defaultValue: 'الرئيسية' }), path: '/' },
    { label: t('nav.offers', { defaultValue: 'العروض' }) },
  ];

  return (
    <div
      className="min-h-screen bg-background pb-16 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>
          {isRtl
            ? 'عروض حصرية | متجر جنان للقهوة الفاخرة'
            : 'Exclusive Offers | Jnan Premium Store'}
        </title>
        <meta
          name="description"
          content={
            isRtl
              ? 'تصفح العروض والخصومات الحصرية في متجر جنان. وفر أكثر عند تسوق القهوة السعودية والمكسرات والشوكولاتة الفاخرة.'
              : 'Browse exclusive offers and discount sales on Jnan Store. Save more on authentic Saudi coffee, nuts, and sweets.'
          }
        />
        <link rel="canonical" href="https://jnan-sa.com/offers" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content={
            isRtl
              ? 'عروض، خصومات، قهوة سعودية، مكسرات، تمور، شوكولاتة'
              : 'offers, discount, saudi coffee, nuts, dates, sweets'
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jnan-sa.com/offers" />
        <meta
          property="og:title"
          content={isRtl ? 'عروض حصرية | متجر جنان' : 'Exclusive Offers | Jnan Store'}
        />
        <meta
          property="og:description"
          content={
            isRtl
              ? 'خصومات وعروض مميزة لفترة محدودة'
              : 'Special discounts and offers for a limited time'
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={isRtl ? 'عروض حصرية | متجر جنان' : 'Exclusive Offers | Jnan Store'}
        />
      </Helmet>

      {/* Hero Breadcrumbs Banner */}
      <section className="relative overflow-hidden bg-cream/15 dark:bg-card/5 border-b border-border/30 py-8 select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-gold/5 dark:bg-gold/[0.02] rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative flex flex-col justify-center items-start text-right">
          <Breadcrumb items={breadcrumbItems} isRtl={isRtl} />
          <h1 className="text-3xl font-extrabold text-primary dark:text-gold tracking-tight mt-2 font-tajawal">
            {t('offers.title', { defaultValue: 'العروض والخصومات' })}
          </h1>
          <div className="mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Promotional Campaign Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-cardamom border border-gold/20 p-6 md:p-10 mb-10 shadow-lg">
          {/* Radial glow glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex-1 text-center md:text-right space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/25 border border-gold/45 text-gold text-xs font-bold font-tajawal">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isRtl ? 'عروض لفترة محدودة' : 'Limited-time Campaign'}</span>
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground leading-tight font-tajawal">
                {isRtl ? 'مهرجان القهوة والتمور الفاخرة' : 'Premium Coffee & Dates Festival'}
              </h2>
              <p className="text-sm text-primary-foreground/80 font-light max-w-xl font-tajawal leading-relaxed">
                {isRtl
                  ? 'وفر حتى ٥٠٪ على باقة من أفضل منتجاتنا من القهوة السعودية والمختصة، التمور المحشوة، والمكسرات المحمصة الطازجة.'
                  : 'Save up to 50% on premium selected Saudi specialty coffee, stuffed dates, and freshly roasted nuts.'}
              </p>
            </div>

            {/* Countdown timer container */}
            <div className="bg-background/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center min-w-[240px] text-center select-none shadow-md shrink-0">
              <div className="flex items-center gap-1.5 text-gold text-xs font-bold mb-3 font-tajawal">
                <Clock className="h-4 w-4 animate-pulse" />
                <span>{isRtl ? 'ينتهي العرض خلال' : 'Offer Ends In'}</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground font-sans">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold tracking-tight bg-white/5 border border-white/10 h-14 w-14 rounded-xl flex items-center justify-center shadow-inner">
                    {formatNumber(timeLeft.hours)}
                  </span>
                  <span className="text-[10px] text-white/60 font-tajawal mt-1">
                    {isRtl ? 'ساعة' : 'Hrs'}
                  </span>
                </div>
                <span className="text-3xl font-bold text-gold">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold tracking-tight bg-white/5 border border-white/10 h-14 w-14 rounded-xl flex items-center justify-center shadow-inner">
                    {formatNumber(timeLeft.minutes)}
                  </span>
                  <span className="text-[10px] text-white/60 font-tajawal mt-1">
                    {isRtl ? 'دقيقة' : 'Mins'}
                  </span>
                </div>
                <span className="text-3xl font-bold text-gold">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold tracking-tight bg-white/5 border border-white/10 h-14 w-14 rounded-xl flex items-center justify-center shadow-inner">
                    {formatNumber(timeLeft.seconds)}
                  </span>
                  <span className="text-[10px] text-white/60 font-tajawal mt-1">
                    {isRtl ? 'ثانية' : 'Secs'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card border border-border/40 p-4 rounded-2xl shadow-xs mb-8 select-none w-full">
          {/* Category Tabs list */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={twMerge(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground font-extrabold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
            >
              {isRtl ? 'الكل' : 'All'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={twMerge(
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground font-extrabold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                )}
              >
                {isRtl ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>

          {/* Sorting controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <label
              htmlFor="offers-sort"
              className="text-xs font-bold text-muted-foreground select-none"
            >
              {isRtl ? 'ترتيب حسب:' : 'Sort By:'}
            </label>
            <select
              id="offers-sort"
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="h-9 text-xs font-bold text-muted-foreground hover:text-foreground bg-background border border-border/60 rounded-xl px-3 py-1.5 font-tajawal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <option value="discount_desc">{isRtl ? 'الخصم الأعلى' : 'Highest Discount'}</option>
              <option value="price_asc">
                {isRtl ? 'السعر: الأقل إلى الأعلى' : 'Price: Low to High'}
              </option>
              <option value="price_desc">
                {isRtl ? 'السعر: الأعلى إلى الأقل' : 'Price: High to Low'}
              </option>
            </select>
          </div>
        </div>

        {/* Content catalog view */}
        {isError ? (
          <div className="flex flex-col items-center justify-center p-12 border border-destructive/20 bg-destructive/5 rounded-3xl text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <h3 className="text-base font-bold text-destructive mb-2 font-tajawal">
              {isRtl ? 'فشل تحميل العروض' : 'Failed to Load Offers'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm font-tajawal">
              {isRtl
                ? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالشبكة وإعادة المحاولة.'
                : 'Failed to retrieve active promotional deals. Please verify your network and retry.'}
            </p>
          </div>
        ) : isProductsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : processedProducts.length === 0 ? (
          <EmptyState
            hasSearch={false}
            hasFilters={true}
            onClearSearch={() => {}}
            onResetFilters={() => {
              setActiveCategory('all');
              setActiveSort('discount_desc');
            }}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {processedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={getCategoryName(product.categoryId)}
                layout="grid"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Offers;
