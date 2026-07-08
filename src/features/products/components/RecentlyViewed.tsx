import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { useProductsByIds } from '@/hooks/useProducts';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import ProductCardSkeleton from '@/features/home/components/product-card/ProductCardSkeleton';

interface RecentlyViewedProps {
  currentProductId: string;
}

const STORAGE_KEY = 'jnan_recently_viewed_ids';
const MAX_ITEMS = 6;

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

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setIds([]);
    } catch (e) {
      console.error('Failed to clear search history', e);
    }
  };

  // 2. Fetch products data using hook
  const { data: products = [], isLoading } = useProductsByIds(ids);

  // If no other products were visited, do not render this section
  if (ids.length === 0) return null;

  return (
    <div className="w-full border-t border-border/30 pt-10 font-tajawal select-none">
      {/* Header with Clear Action */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-extrabold text-primary dark:text-gold text-right">
          {t('product.recently_viewed', { defaultValue: 'شاهدته مؤخراً' })}
        </h3>
        <button
          onClick={handleClearHistory}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:scale-105 active:scale-95 transition-all cursor-pointer bg-transparent border-0 py-1 px-2.5 rounded-lg hover:bg-destructive/5"
          aria-label="مسح سجل المشاهدة"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{t('product.clear_history', { defaultValue: 'مسح السجل' })}</span>
        </button>
      </div>

      {/* Horizontal Carousel Viewport */}
      {isLoading ? (
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
          {Array.from({ length: Math.min(4, ids.length) }).map((_, idx) => (
            <div key={idx} className="w-52 md:w-60 shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="relative">
          <div
            className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gold/10 scrollbar-track-transparent scroll-smooth snap-x"
            role="list"
          >
            {products.map((product) => (
              <div key={product.id} className="w-48 sm:w-56 shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {/* Subtle fade overlays to suggest horizontal scrolling */}
          <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        </div>
      ) : null}
    </div>
  );
};

export default RecentlyViewed;
