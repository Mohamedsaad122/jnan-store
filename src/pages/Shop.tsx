import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useProducts, useCategories, useBrands } from '@/hooks/useProducts';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import ProductCardSkeleton from '@/features/home/components/product-card/ProductCardSkeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Pagination from '@/components/ui/Pagination';
import Sheet from '@/components/ui/Sheet';
import FilterSidebar from '@/features/shop/components/FilterSidebar';
import ShopToolbar from '@/features/shop/components/ShopToolbar';
import EmptyState from '@/components/ui/EmptyState';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLanguageStore } from '@/store/language.store';
import { twMerge } from 'tailwind-merge';
import { Helmet } from 'react-helmet-async';
import analyticsService from '@/services/analytics.service';

export const Shop: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // URL Query synced state hook
  const {
    filters,
    setSearch,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    setRating,
    setDiscount,
    setInStock,
    setFeatured,
    setBestSeller,
    setNewArrival,
    toggleColor,
    toggleSize,
    setSort,
    setPage,
    setView,
    resetFilters,
  } = useProductFilters();

  // Mobile filters drawer sheet state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // TanStack queries for products (reactive to filters change), active categories & brands
  const {
    data: response,
    isLoading: isProductsLoading,
    isError,
    refetch,
  } = useProducts({
    search: filters.search,
    category: filters.category,
    categories: filters.categories,
    brands: filters.brands,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    rating: filters.rating,
    discount: filters.discount,
    inStock: filters.inStock,
    featured: filters.featured,
    bestSeller: filters.bestSeller,
    newArrival: filters.newArrival,
    colors: filters.colors,
    sizes: filters.sizes,
    sort: filters.sort,
    page: filters.page,
    limit: filters.view === 'list' ? 8 : 12,
  });

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const products = response?.data || [];
  const pagination = response?.pagination;

  // Track search executing for analytics preparation
  React.useEffect(() => {
    if (filters.search) {
      analyticsService.trackSearch(filters.search, products.length);
    }
  }, [filters.search, products.length]);

  // Derive if any filters are active
  const hasFiltersActive =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.rating !== null ||
    filters.discount !== null ||
    filters.inStock ||
    filters.featured ||
    filters.bestSeller ||
    filters.newArrival ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0;

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: t('nav.home', { defaultValue: 'الرئيسية' }), path: '/' },
    { label: t('nav.shop', { defaultValue: 'المتجر' }) },
  ];

  // Map category ID to its localized title for product cards
  const getCategoryName = (catId: string) => {
    const categoryObj = categories.find((c) => c.id === catId);
    if (!categoryObj) return '';
    return isRtl ? categoryObj.nameAr : categoryObj.nameEn;
  };

  const getBrandName = (brandId: string) => {
    const brandObj = brands.find((b) => b.id === brandId);
    return brandObj ? brandObj.nameAr : brandId;
  };

  return (
    <div
      className="min-h-screen bg-background font-tajawal text-right pb-16"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>
          {isRtl ? 'المتجر | متجر جنان للقهوة الفاخرة' : 'Shop | Jnan Store Premium Products'}
        </title>
        <meta
          name="description"
          content={
            isRtl
              ? 'تسوق تشكيلة فاخرة من القهوة السعودية والمختصة والتمور الفاخرة والمكسرات والشوكولاتة في متجر جنان.'
              : 'Shop our collection of premium Saudi coffee, dates, sweets and roasted nuts on Jnan Store.'
          }
        />
      </Helmet>

      {/* Decorative Hero Breadcrumbs Header Banner */}
      <section className="relative overflow-hidden bg-cream/15 dark:bg-card/5 border-b border-border/30 py-8 select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-gold/5 dark:bg-gold/[0.02] rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative flex flex-col justify-center items-start text-right">
          <Breadcrumb items={breadcrumbItems} isRtl={isRtl} />
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mt-2 font-tajawal">
            {t('shop.title', { defaultValue: 'المتجر' })}
          </h1>
          <div className="mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
        </div>
      </section>

      {/* Main Grid Shop Container */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar - Sticky */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 bg-card/60 backdrop-blur-xs border border-border/40 p-6 rounded-2xl shadow-xs">
            <FilterSidebar
              filters={filters}
              categories={categories}
              brands={brands}
              onToggleCategory={toggleCategory}
              onToggleBrand={toggleBrand}
              onPriceRangeChange={setPriceRange}
              onRatingChange={setRating}
              onDiscountChange={setDiscount}
              onInStockChange={setInStock}
              onFeaturedChange={setFeatured}
              onBestSellerChange={setBestSeller}
              onNewArrivalChange={setNewArrival}
              onToggleColor={toggleColor}
              onToggleSize={toggleSize}
              onReset={resetFilters}
            />
          </aside>

          {/* Shop content right side */}
          <div className="flex-1 w-full flex flex-col gap-5">
            {/* Toolbar: Search, view selector, sort dropdown */}
            <ShopToolbar
              filters={filters}
              totalItems={pagination?.totalItems || 0}
              onSearchChange={setSearch}
              onSortChange={setSort}
              onViewChange={setView}
              onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
            />

            {/* Active Filter Chips bar */}
            {hasFiltersActive && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/10 border border-border/40 rounded-xl select-none animate-fade-in text-right justify-end w-full">
                <span className="text-xs text-muted-foreground font-bold ml-2">
                  {isRtl ? 'الفلاتر النشطة:' : 'Active Filters:'}
                </span>

                {/* Categories Chips */}
                {filters.categories.map((catSlug) => (
                  <div
                    key={catSlug}
                    className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg"
                  >
                    <span>
                      {t(`category.${catSlug.replace('-', '_')}`, { defaultValue: catSlug })}
                    </span>
                    <button
                      onClick={() => toggleCategory(catSlug)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Brands Chips */}
                {filters.brands.map((brandId) => (
                  <div
                    key={brandId}
                    className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg"
                  >
                    <span>{getBrandName(brandId)}</span>
                    <button
                      onClick={() => toggleBrand(brandId)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Price range chip */}
                {(filters.minPrice !== null || filters.maxPrice !== null) && (
                  <div className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    <span>
                      {isRtl ? 'السعر' : 'Price'}: {filters.minPrice || 0} -{' '}
                      {filters.maxPrice || '∞'}
                    </span>
                    <button
                      onClick={() => setPriceRange(null, null)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Rating Level chip */}
                {filters.rating !== null && (
                  <div className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    <span>
                      {filters.rating} {isRtl ? 'نجوم وأعلى' : 'Stars & Up'}
                    </span>
                    <button
                      onClick={() => setRating(null)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Discount Level chip */}
                {filters.discount !== null && (
                  <div className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    <span>
                      {isRtl
                        ? `خصم ${filters.discount}% فما فوق`
                        : `${filters.discount}% Off & More`}
                    </span>
                    <button
                      onClick={() => setDiscount(null)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Collections tags */}
                {filters.featured && (
                  <div className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    <span>{isRtl ? 'المميزة' : 'Featured'}</span>
                    <button
                      onClick={() => setFeatured(false)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.bestSeller && (
                  <div className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    <span>{isRtl ? 'الأكثر مبيعاً' : 'Best Sellers'}</span>
                    <button
                      onClick={() => setBestSeller(false)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.newArrival && (
                  <div className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    <span>{isRtl ? 'وصلنا حديثاً' : 'New Arrivals'}</span>
                    <button
                      onClick={() => setNewArrival(false)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.inStock && (
                  <div className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    <span>{isRtl ? 'المتوفر في المخزن' : 'In Stock'}</span>
                    <button
                      onClick={() => setInStock(false)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Colors & Sizes */}
                {filters.colors.map((col) => (
                  <div
                    key={col}
                    className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg"
                  >
                    <span>{col}</span>
                    <button
                      onClick={() => toggleColor(col)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {filters.sizes.map((sz) => (
                  <div
                    key={sz}
                    className="inline-flex items-center gap-1 bg-gold/10 border border-gold/25 text-gold text-[10px] font-extrabold px-2.5 py-1 rounded-lg"
                  >
                    <span>{sz}</span>
                    <button
                      onClick={() => toggleSize(sz)}
                      className="hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Clear all action */}
                <button
                  onClick={resetFilters}
                  className="mr-auto text-[10px] font-black text-destructive hover:underline cursor-pointer"
                >
                  {isRtl ? 'مسح الكل' : 'Clear All'}
                </button>
              </div>
            )}

            {/* Error State Banner */}
            {isError ? (
              <div className="flex flex-col items-center justify-center p-10 border border-destructive/20 bg-destructive/5 rounded-2xl text-center">
                <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
                <h3 className="text-base font-bold text-destructive mb-1.5">
                  {t('common.error', { defaultValue: 'حدث خطأ ما' })}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mb-4">
                  {t('shop.error_desc', {
                    defaultValue:
                      'فشل تحميل المنتجات. يرجى التحقق من اتصالك بالشبكة والمحاولة مجدداً.',
                  })}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="text-xs font-bold px-5"
                >
                  {t('common.retry', { defaultValue: 'إعادة المحاولة' })}
                </Button>
              </div>
            ) : (
              <>
                {/* Loader Skeleton vs Loaded Products */}
                {isProductsLoading ? (
                  <div
                    className={twMerge(
                      filters.view === 'list'
                        ? 'flex flex-col gap-4'
                        : 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                    )}
                  >
                    {Array.from({ length: filters.view === 'list' ? 4 : 8 }).map((_, idx) => (
                      <ProductCardSkeleton key={idx} layout={filters.view} />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  /* Premium Empty search states */
                  <div className="w-full flex justify-center py-10">
                    <EmptyState
                      icon={<AlertTriangle className="h-8 w-8 text-gold" />}
                      title={
                        isRtl
                          ? 'لم نجد أي منتجات تطابق خيارات التصفية!'
                          : 'No products match your filters!'
                      }
                      description={
                        isRtl
                          ? 'يرجى مراجعة خيارات التصفية النشطة أو الضغط على زر إعادة التعيين لعرض كل المنتجات.'
                          : 'Please adjust your active selection parameters or clear filters to view all products.'
                      }
                      primaryAction={{
                        label: isRtl ? 'إعادة تعيين فلاتر البحث' : 'Reset Search Filters',
                        onClick: resetFilters,
                      }}
                    />
                  </div>
                ) : (
                  /* Render Products Catalog */
                  <div
                    className={twMerge(
                      filters.view === 'list'
                        ? 'flex flex-col gap-4 animate-fade-in'
                        : 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-fade-in'
                    )}
                  >
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        categoryName={getCategoryName(product.categoryId)}
                        layout={filters.view}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && !isProductsLoading && (
                  <div className="mt-8 border-t border-border/20 pt-6 select-none">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={setPage}
                      isRtl={isRtl}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Drawer Slide-out Sheet for Filters */}
      <Sheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        side={isRtl ? 'right' : 'left'}
        title={t('shop.filter_title', { defaultValue: 'تصفية المنتجات' })}
      >
        <div className="pt-2 px-1 select-none">
          <FilterSidebar
            filters={filters}
            categories={categories}
            brands={brands}
            onToggleCategory={toggleCategory}
            onToggleBrand={toggleBrand}
            onPriceRangeChange={setPriceRange}
            onRatingChange={setRating}
            onDiscountChange={setDiscount}
            onInStockChange={setInStock}
            onFeaturedChange={setFeatured}
            onBestSellerChange={setBestSeller}
            onNewArrivalChange={setNewArrival}
            onToggleColor={toggleColor}
            onToggleSize={toggleSize}
            onReset={() => {
              resetFilters();
              setIsMobileFilterOpen(false);
            }}
          />
        </div>
      </Sheet>
    </div>
  );
};

export default Shop;
