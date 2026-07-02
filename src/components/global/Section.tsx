import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Section: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <section className={twMerge('py-12 sm:py-16 lg:py-20', className)} {...props}>
      {children}
    </section>
  );
};

export default Section;
