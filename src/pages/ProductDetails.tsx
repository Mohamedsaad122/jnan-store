import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProductDetails } from '@/hooks/useProducts';
import { useLanguageStore } from '@/store/language.store';
import ImageGallery from '@/features/products/components/ImageGallery';
import ProductInfo from '@/features/products/components/ProductInfo';
import ProductTabs from '@/features/products/components/ProductTabs';
import RelatedProducts from '@/features/products/components/RelatedProducts';
import RecentlyViewed from '@/features/products/components/RecentlyViewed';
import ProductDetailsSkeleton from '@/features/products/components/ProductDetailsSkeleton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import ROUTES from '@/constants/routes';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // Fetch product details reactive to parameters changes (by ID or Slug)
  const { data: product, isLoading, isError } = useProductDetails(id || '');

  // 1. Loading Skeleton viewport
  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  // 2. Product Not Found or fetch error panels
  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center font-tajawal">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-5 border border-destructive/15">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">
          {t('product.not_found', { defaultValue: 'عذراً، المنتج غير متوفر حالياً' })}
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
          {t('product.not_found_desc', {
            defaultValue:
              'ربما تم إزالة المنتج أو انتهت صلاحية الرابط. يمكنك تصفح المنتجات المتوفرة الأخرى في متجرنا.',
          })}
        </p>
        <Link to={ROUTES.SHOP}>
          <Button
            variant="primary"
            className="flex items-center gap-2 h-10 px-5 text-xs font-bold rounded-lg shadow-md"
          >
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('product.back_to_shop', { defaultValue: 'العودة للمتجر' })}</span>
          </Button>
        </Link>
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
    <div className="min-h-screen bg-background pb-16 font-tajawal text-right">
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

        {/* Recently Viewed shelf (tracks visited items) */}
        <section className="mt-4">
          <RecentlyViewed currentProductId={product.id} />
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
