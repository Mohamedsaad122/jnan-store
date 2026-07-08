import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

import { useCategories } from '@/hooks/useProducts';
import { useLanguageStore } from '@/store/language.store';
import { Category } from '@/types/domain';
import CategoryCard from '@/features/home/components/categories/CategoryCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

export const Categories: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { data: categories = [], isLoading, isError, refetch } = useCategories();

  const breadcrumbItems = [
    { label: t('nav.home', { defaultValue: 'الرئيسية' }), path: '/' },
    { label: t('nav.categories', { defaultValue: 'الأقسام' }) },
  ];

  return (
    <div
      className="min-h-screen bg-background pb-16 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>{isRtl ? 'أقسام المنتجات | متجر جنان' : 'Product Categories | Jnan Store'}</title>
        <meta
          name="description"
          content={
            isRtl
              ? 'تصفح أقسام متجر جنان للقهوة السعودية والمختصة والتمور الفاخرة والمكسرات والشوكولاتة.'
              : 'Browse Jnan Store categories including premium Saudi coffee, dates, fresh nuts, and traditional sweets.'
          }
        />
      </Helmet>

      {/* Hero Breadcrumbs Banner */}
      <section className="relative overflow-hidden bg-cream/15 dark:bg-card/5 border-b border-border/30 py-8 select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-gold/5 dark:bg-gold/[0.02] rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative flex flex-col justify-center items-start text-right">
          <Breadcrumb items={breadcrumbItems} isRtl={isRtl} />
          <h1 className="text-3xl font-extrabold text-primary dark:text-gold tracking-tight mt-2 font-tajawal">
            {t('categories.title', { defaultValue: 'أقسام المنتجات' })}
          </h1>
          <div className="mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-6 py-12">
        {isError ? (
          <div className="py-12">
            <ErrorState type="network" onRetry={refetch} showHomeButton={true} />
          </div>
        ) : isLoading ? (
          /* Structured Grid Skeleton to prevent layout shifts */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden border border-border/40 aspect-square p-5 flex flex-col justify-end bg-card"
              >
                <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
                <div className="relative z-10 space-y-2">
                  <Skeleton className="h-6 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12">
            <ErrorState
              type="default"
              title={isRtl ? 'لا توجد أقسام متوفرة' : 'No Categories Available'}
              description={
                isRtl
                  ? 'لم نجد أي أقسام للمنتجات حالياً.'
                  : 'We could not find any categories at the moment.'
              }
              onRetry={refetch}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                productCount={(category as Category & { productCount?: number }).productCount ?? 0}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Categories;
