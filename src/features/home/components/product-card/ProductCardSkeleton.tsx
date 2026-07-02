import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/40 bg-card p-3 shadow-sm select-none">
      {/* Product Image Placeholder */}
      <Skeleton className="aspect-square w-full rounded-xl" />

      {/* Product Details Placeholders */}
      <div className="mt-4 flex flex-col space-y-2 text-right">
        {/* Category Tag Placeholder */}
        <Skeleton className="h-3 w-1/4 rounded self-start" />

        {/* Name Placeholder */}
        <Skeleton className="h-4 w-3/4 rounded" />

        {/* Rating Placeholder */}
        <div className="mt-1 flex items-center justify-start gap-1">
          <Skeleton className="h-3 w-1/5 rounded" />
          <Skeleton className="h-3 w-1/4 rounded" />
        </div>

        {/* Price & Action Button Row Placeholder */}
        <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-4.5 w-16 rounded" />
          </div>
          {/* Mobile Quick Add Button Placeholder */}
          <Skeleton className="h-9 w-9 rounded-lg md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
