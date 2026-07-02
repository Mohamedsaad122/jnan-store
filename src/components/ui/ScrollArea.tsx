import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        'h-full w-full overflow-auto pr-1 select-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ScrollArea;
