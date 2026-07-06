import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4 select-none text-right font-tajawal',
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h2 className="text-lg md:text-xl font-bold text-primary tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-2 self-start sm:self-auto">{children}</div>
      )}
    </div>
  );
};

export default SectionHeader;
