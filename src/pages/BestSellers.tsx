import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Flame, AlertCircle } from 'lucide-react';
import { useBestSellers, useCategories } from '@/hooks/useProducts';
import { useLanguageStore } from '@/store/language.store';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import ProductCardSkeleton from '@/features/home/components/product-card/ProductCardSkeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/features/shop/components/EmptyState';
import { twMerge } from 'tailwind-merge';

export const BestSellers: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<string>('rating_desc');

  // Fetch best sellers products and categories
  const { data: bestProducts = [], isLoading: isProductsLoading, isError } = useBestSellers();
  const { data: categories = [] } = useCategories();

  // Derive active category name for product card
  const getCategoryName = (catId: string) => {
    const categoryObj = categories.find((c) => c.id === catId);
    if (!categoryObj) return '';
    return isRtl ? categoryObj.nameAr : categoryObj.nameEn;
  };

  // 1. Filter products by category
  let processedProducts = [...bestProducts];
  if (activeCategory !== 'all') {
    processedProducts = processedProducts.filter((p) => p.categoryId === activeCategory);
  }

  // 2. Sort products
  processedProducts.sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;

    switch (activeSort) {
      case 'price_asc':
        return priceA - priceB;
      case 'price_desc':
        return priceB - priceA;
      case 'rating_desc':
      default:
        return b.rating - a.rating; // highest rating first
    }
  });

  const breadcrumbItems = [
    { label: t('nav.home', { defaultValue: 'الرئيسية' }), path: '/' },
    { label: t('nav.best_sellers', { defaultValue: 'الأكثر مبيعاً' }) },
  ];

  return (
    <div
      className="min-h-screen bg-background pb-16 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>
          {isRtl ? 'الأكثر مبيعاً | متجر جنان للقهوة الفاخرة' : 'Best Sellers | Jnan Premium Store'}
        </title>
        <meta
          name="description"
          content={
            isRtl
              ? 'تصفح المنتجات الأكثر مبيعاً ونقداً لدى عملاء متجر جنان. القهوة السعودية والمكسرات والشوكولاتة الفاخرة.'
              : 'Browse top selling premium Saudi specialty coffee, dates, sweets and roasted nuts on Jnan Store.'
          }
        />
        <link rel="canonical" href="https://jnan-sa.com/best-sellers" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content={
            isRtl
              ? 'الأكثر مبيعاً، المنتجات المميزة، قهوة سعودية، مكسرات، تمور، شوكولاتة'
              : 'best sellers, top sales, saudi coffee, nuts, dates, sweets'
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jnan-sa.com/best-sellers" />
        <meta
          property="og:title"
          content={isRtl ? 'الأكثر مبيعاً | متجر جنان' : 'Best Sellers | Jnan Store'}
        />
        <meta
          property="og:description"
          content={
            isRtl
              ? 'المنتجات الأكثر مبيعاً وطلباً لدى عملائنا'
              : 'Top selling products most ordered by our customers'
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={isRtl ? 'الأكثر مبيعاً | متجر جنان' : 'Best Sellers | Jnan Store'}
        />
      </Helmet>

      {/* Hero Breadcrumbs Header Banner */}
      <section className="relative overflow-hidden bg-cream/15 dark:bg-card/5 border-b border-border/30 py-8 select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-gold/5 dark:bg-gold/[0.02] rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative flex flex-col justify-center items-start text-right">
          <Breadcrumb items={breadcrumbItems} isRtl={isRtl} />
          <h1 className="text-3xl font-extrabold text-primary dark:text-gold tracking-tight mt-2 font-tajawal">
            {t('best_sellers.title', { defaultValue: 'الأكثر مبيعاً' })}
          </h1>
          <div className="mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Campaign Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b1916] to-[#123524]/20 border border-gold/15 p-6 md:p-8 mb-10 shadow-xs">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-right space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold font-tajawal">
                <Flame className="h-3.5 w-3.5 fill-gold text-gold" />
                <span>{isRtl ? 'المفضلة لدى عملائنا' : 'Customer Favorites'}</span>
              </span>
              <h2 className="text-2xl font-extrabold text-primary dark:text-gold font-tajawal mt-2">
                {isRtl ? 'خيارات مجربة ونالت استحسان الجميع' : 'Tried & Loved by Everyone'}
              </h2>
              <p className="text-xs text-muted-foreground font-light max-w-xl font-tajawal leading-relaxed">
                {isRtl
                  ? 'هذه المنتجات حصلت على أعلى تقييمات من عملائنا الكرام وتكرر طلبها بفضل جودتها الفريدة ومذاقها الأصيل.'
                  : 'These items are highly rated and most ordered by our customers, representing Jnan highest standards of quality.'}
              </p>
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
              htmlFor="bestseller-sort"
              className="text-xs font-bold text-muted-foreground select-none"
            >
              {isRtl ? 'ترتيب حسب:' : 'Sort By:'}
            </label>
            <select
              id="bestseller-sort"
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="h-9 text-xs font-bold text-muted-foreground hover:text-foreground bg-background border border-border/60 rounded-xl px-3 py-1.5 font-tajawal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <option value="rating_desc">{isRtl ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
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
              {isRtl ? 'فشل تحميل المنتجات' : 'Failed to Load Products'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm font-tajawal">
              {isRtl
                ? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالشبكة وإعادة المحاولة.'
                : 'Failed to retrieve bestseller items. Please verify your network and retry.'}
            </p>
          </div>
        ) : isProductsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
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
              setActiveSort('rating_desc');
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

export default BestSellers;
