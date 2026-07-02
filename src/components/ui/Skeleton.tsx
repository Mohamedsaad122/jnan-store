import React from 'react';
import { twMerge } from 'tailwind-merge';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge('animate-pulse rounded-md bg-muted/60', className)}
      {...props}
    />
  );
};

export default Skeleton;
