import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRelatedProducts } from '@/hooks/useProducts';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import ProductCardSkeleton from '@/features/home/components/product-card/ProductCardSkeleton';

interface RelatedProductsProps {
  productId: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
  const { t } = useTranslation();
  const { data: products, isLoading } = useRelatedProducts(productId);

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <div className="w-full border-t border-border/30 pt-10 font-tajawal select-none">
      <h3 className="text-lg font-extrabold text-primary text-right mb-6">
        {t('product.related_products', { defaultValue: 'منتجات ذات صلة' })}
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
