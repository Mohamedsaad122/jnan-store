import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { twMerge } from 'tailwind-merge';

export interface ProductCardSkeletonProps {
  layout?: 'grid' | 'list';
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ layout = 'grid' }) => {
  return (
    <div
      className={twMerge(
        'flex justify-between rounded-2xl border border-border/40 bg-card p-3 shadow-sm select-none',
        layout === 'list' ? 'flex-col sm:flex-row gap-4 md:gap-6 w-full' : 'flex-col'
      )}
    >
      {/* Product Image Placeholder */}
      <Skeleton
        className={twMerge(
          'rounded-xl shrink-0',
          layout === 'list' ? 'aspect-square w-full sm:w-44 md:w-48' : 'aspect-square w-full'
        )}
      />

      {/* Product Details Placeholders */}
      <div
        className={twMerge(
          'flex flex-col text-right',
          layout === 'list' ? 'mt-0 flex-grow justify-between py-1' : 'mt-4 space-y-2'
        )}
      >
        <div className="space-y-2">
          {/* Category Tag Placeholder */}
          <Skeleton className="h-3 w-1/4 rounded self-start" />

          {/* Name Placeholder */}
          <Skeleton className="h-4 w-3/4 rounded" />

          {/* Rating Placeholder */}
          <div className="mt-1 flex items-center justify-start gap-1">
            <Skeleton className="h-3.5 w-1/5 rounded" />
            <Skeleton className="h-3.5 w-1/4 rounded" />
          </div>

          {/* Description Placeholder (Only in list view) */}
          {layout === 'list' && (
            <div className="space-y-1.5 mt-2.5 hidden sm:block">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-5/6 rounded" />
            </div>
          )}
        </div>

        {/* Price & Action Button Row Placeholder */}
        <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3 w-full">
          <Skeleton className="h-4.5 w-16 rounded" />
          {/* Desktop/Tablet Add Button or Mobile Quick Add */}
          {layout === 'list' ? (
            <Skeleton className="h-8.5 w-24 rounded-lg" />
          ) : (
            <Skeleton className="h-9 w-9 rounded-lg md:hidden" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
