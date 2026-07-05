import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className,
  ...props
}) => {
  return (
    <div className={twMerge('text-right space-y-1 select-none', className)} {...props}>
      <h2 className="text-lg md:text-xl font-bold text-primary tracking-tight font-tajawal">
        {title}
      </h2>
      {subtitle && <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
