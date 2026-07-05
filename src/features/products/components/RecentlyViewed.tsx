import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductsByIds } from '@/hooks/useProducts';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import ProductCardSkeleton from '@/features/home/components/product-card/ProductCardSkeleton';

interface RecentlyViewedProps {
  currentProductId: string;
}

const STORAGE_KEY = 'jnan_recently_viewed_ids';
const MAX_ITEMS = 5;

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const { t } = useTranslation();
  const [ids, setIds] = useState<string[]>([]);

  // 1. Manage local storage items on component mount/update
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed: string[] = stored ? JSON.parse(stored) : [];

      // Filter out the current product from storage history, then add it to the front
      const updated = [currentProductId, ...parsed.filter((id) => id !== currentProductId)].slice(
        0,
        MAX_ITEMS
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // For rendering, get all IDs except the current product ID
      const displayIds = updated.filter((id) => id !== currentProductId);
      setIds(displayIds);
    } catch (e) {
      console.error('Failed to read/write recently viewed history in storage', e);
    }
  }, [currentProductId]);

  // 2. Fetch products data using hook
  const { data: products, isLoading } = useProductsByIds(ids);

  // If no other products were visited, do not render this section
  if (ids.length === 0) return null;

  return (
    <div className="w-full border-t border-border/30 pt-10 font-tajawal select-none">
      <h3 className="text-lg font-extrabold text-primary text-right mb-6">
        {t('product.recently_viewed', { defaultValue: 'شاهدته مؤخراً' })}
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: Math.min(4, ids.length) }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default RecentlyViewed;
