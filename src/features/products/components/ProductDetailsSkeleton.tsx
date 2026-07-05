import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 select-none">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-4 w-40 rounded mb-6" />

      {/* Main product column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <Skeleton className="h-20 w-20 rounded-xl" />
            <Skeleton className="h-20 w-20 rounded-xl" />
          </div>
        </div>

        {/* Right Column: Details Info Skeleton */}
        <div className="flex flex-col gap-4 text-right">
          {/* Brand and Category row */}
          <div className="flex items-center justify-between mb-1">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>

          {/* Title skeleton */}
          <Skeleton className="h-7 w-5/6 rounded" />

          {/* Ratings row */}
          <div className="flex items-center justify-start gap-1 pb-4 border-b border-border/40">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>

          {/* Price skeleton */}
          <Skeleton className="h-8 w-28 rounded mt-2" />

          {/* Description paragraphs skeleton */}
          <div className="space-y-2 mt-2">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>

          {/* Variants selection skeleton */}
          <div className="border-t border-border/20 pt-4 mt-2">
            <Skeleton className="h-3 w-16 rounded mb-2.5" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-xl" />
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </div>

          {/* Actions row skeleton */}
          <div className="flex items-center gap-3 mt-6 border-t border-border/20 pt-6">
            <Skeleton className="h-12 w-32 rounded-xl shrink-0" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
