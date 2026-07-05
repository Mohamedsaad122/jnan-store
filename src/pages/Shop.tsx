import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useProducts, useCategories } from '@/hooks/useProducts';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import ProductCardSkeleton from '@/features/home/components/product-card/ProductCardSkeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Pagination from '@/components/ui/Pagination';
import Sheet from '@/components/ui/Sheet';
import FilterSidebar from '@/features/shop/components/FilterSidebar';
import ShopToolbar from '@/features/shop/components/ShopToolbar';
import EmptyState from '@/features/shop/components/EmptyState';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLanguageStore } from '@/store/language.store';
import { twMerge } from 'tailwind-merge';

export const Shop: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // URL Query synced state hook
  const {
    filters,
    setSearch,
    setCategory,
    setPriceRange,
    setRating,
    setInStock,
    setSort,
    setPage,
    setView,
    resetFilters,
  } = useProductFilters();

  // Mobile filters drawer sheet state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // TanStack queries for products (reactive to filters change) and active categories
  const {
    data: response,
    isLoading: isProductsLoading,
    isError,
    refetch,
  } = useProducts({
    search: filters.search,
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    rating: filters.rating,
    inStock: filters.inStock,
    sort: filters.sort,
    page: filters.page,
    limit: filters.view === 'list' ? 8 : 12, // Standard count for paginated views
  });

  const { data: categories = [] } = useCategories();

  const products = response?.data || [];
  const pagination = response?.pagination;

  // Derive if any non-default filters or search elements are active for EmptyState displays
  const hasSearchActive = filters.search !== '';
  const hasFiltersActive =
    filters.category !== 'all' ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.rating !== null ||
    filters.inStock;

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

  return (
    <div className="min-h-screen bg-background font-tajawal text-right pb-16">
      {/* Decorative Hero Breadcrumbs Header Banner */}
      <section className="relative overflow-hidden bg-cream/15 dark:bg-card/5 border-b border-border/30 py-8 select-none">
        {/* Background radial gold glow */}
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
            <h2 className="text-base font-extrabold text-primary mb-5 border-b pb-3">
              {t('shop.filter_title', { defaultValue: 'تصفية المنتجات' })}
            </h2>
            <FilterSidebar
              filters={filters}
              categories={categories}
              onCategoryChange={setCategory}
              onPriceRangeChange={setPriceRange}
              onRatingChange={setRating}
              onInStockChange={setInStock}
              onReset={resetFilters}
            />
          </aside>

          {/* Shop content right side (or left side in LTR) */}
          <div className="flex-1 w-full flex flex-col gap-6">
            {/* Toolbar: Search, view selector, sort dropdown */}
            <ShopToolbar
              filters={filters}
              totalItems={pagination?.totalItems || 0}
              onSearchChange={setSearch}
              onSortChange={setSort}
              onViewChange={setView}
              onMobileFilterOpen={() => setIsMobileFilterOpen(true)}
            />

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
                  /* Empty state panels */
                  <EmptyState
                    hasSearch={hasSearchActive}
                    hasFilters={hasFiltersActive}
                    onClearSearch={() => setSearch('')}
                    onResetFilters={resetFilters}
                  />
                ) : (
                  /* Render Products Catalog */
                  <div
                    className={twMerge(
                      filters.view === 'list'
                        ? 'flex flex-col gap-4'
                        : 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
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
                  <div className="mt-8 border-t border-border/20 pt-6">
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
        side={isRtl ? 'right' : 'left'} // Drawer slides out from correct language direction
        title={t('shop.filter_title', { defaultValue: 'تصفية المنتجات' })}
      >
        <div className="pt-2 px-1 select-none">
          <FilterSidebar
            filters={filters}
            categories={categories}
            onCategoryChange={(cat) => {
              setCategory(cat);
              setIsMobileFilterOpen(false); // Auto dismiss on mobile category change
            }}
            onPriceRangeChange={setPriceRange}
            onRatingChange={setRating}
            onInStockChange={setInStock}
            onReset={() => {
              resetFilters();
              setIsMobileFilterOpen(false); // Auto dismiss on reset
            }}
          />
        </div>
      </Sheet>
    </div>
  );
};

export default Shop;
