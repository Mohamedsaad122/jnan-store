import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductDetails } from '@/hooks/useProducts';
import { useLanguageStore } from '@/store/language.store';
import ImageGallery from '@/features/products/components/ImageGallery';
import ProductInfo from '@/features/products/components/ProductInfo';
import ProductTabs from '@/features/products/components/ProductTabs';
import RelatedProducts from '@/features/products/components/RelatedProducts';
import RecentlyViewed from '@/features/products/components/RecentlyViewed';
import ProductRecommendationSection from '@/components/global/ProductRecommendationSection';
import ProductDetailsSkeleton from '@/features/products/components/ProductDetailsSkeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ErrorState from '@/components/ui/ErrorState';
import ROUTES from '@/constants/routes';
import { Helmet } from 'react-helmet-async';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // Fetch product details reactive to parameters changes (by ID or Slug)
  const { data: product, isLoading, isError, refetch } = useProductDetails(id || '');

  // 1. Loading Skeleton viewport
  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  // 2. Product Not Found or fetch error panels
  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Helmet>
          <title>{isRtl ? 'المنتج غير موجود | متجر جنان' : 'Product Not Found | Jnan Store'}</title>
        </Helmet>
        <ErrorState
          type="404"
          title={t('product.not_found', { defaultValue: 'عذراً، المنتج غير متوفر حالياً' })}
          description={t('product.not_found_desc', {
            defaultValue:
              'ربما تم إزالة المنتج أو انتهت صلاحية الرابط. يمكنك تصفح المنتجات المتوفرة الأخرى في متجرنا.',
          })}
          onRetry={refetch}
          showHomeButton={true}
        />
      </div>
    );
  }

  // Breadcrumb navigation items
  const breadcrumbItems = [
    { label: t('nav.home', { defaultValue: 'الرئيسية' }), path: '/' },
    { label: t('nav.shop', { defaultValue: 'المتجر' }), path: ROUTES.SHOP },
    { label: isRtl ? product.nameAr : product.nameEn },
  ];

  return (
    <div
      className="min-h-screen bg-background pb-16 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>{isRtl ? `${product.nameAr} | متجر جنان` : `${product.nameEn} | Jnan Store`}</title>
        <meta name="description" content={isRtl ? product.descriptionAr : product.descriptionEn} />
        <meta property="og:title" content={isRtl ? product.nameAr : product.nameEn} />
        <meta
          property="og:description"
          content={isRtl ? product.descriptionAr : product.descriptionEn}
        />
        <meta property="og:image" content={product.images[0]?.url} />
        <meta name="twitter:title" content={isRtl ? product.nameAr : product.nameEn} />
        <meta
          name="twitter:description"
          content={isRtl ? product.descriptionAr : product.descriptionEn}
        />
        <meta name="twitter:image" content={product.images[0]?.url} />
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 py-6 select-none">
        {/* Navigation Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} isRtl={isRtl} />
      </div>

      <div className="container mx-auto px-4 md:px-6 flex flex-col gap-10">
        {/* Two-Column Details Area */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Viewport */}
          <div className="w-full">
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column: Information & Actions */}
          <div className="w-full">
            <ProductInfo product={product} />
          </div>
        </section>

        {/* Tabbed Info Panel: Specs, Descriptions, and Reviews */}
        <section className="mt-4">
          <ProductTabs product={product} />
        </section>

        {/* Related Products shelf (same category) */}
        <section className="mt-4">
          <RelatedProducts productId={product.id} />
        </section>

        {/* Frequently Bought Together recommendations */}
        <section className="mt-4">
          <ProductRecommendationSection
            type="frequently-together"
            productId={product.id}
            categoryId={product.categoryId}
            titleAr="غالباً ما يُشترى معاً"
            titleEn="Frequently Bought Together"
            limit={4}
          />
        </section>

        {/* Customers Also Bought recommendations */}
        <section className="mt-4">
          <ProductRecommendationSection
            type="also-bought"
            productId={product.id}
            categoryId={product.categoryId}
            titleAr="عملاء اشتروا هذا المنتج أيضاً اشتروا"
            titleEn="Customers Also Bought"
            limit={4}
          />
        </section>

        {/* Recently Viewed shelf (tracks visited items) */}
        <section className="mt-4">
          <RecentlyViewed currentProductId={product.id} />
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
