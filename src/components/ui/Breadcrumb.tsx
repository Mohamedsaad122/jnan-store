import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  isRtl?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, isRtl = true, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={twMerge('flex py-3 text-sm font-tajawal', className)}>
      <ol className="inline-flex items-center space-x-1 md:space-x-2 space-x-reverse">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <span className="mx-1 text-muted-foreground md:mx-2">
                  {isRtl ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              )}
              {isLast || !item.path ? (
                <span className="text-muted-foreground font-medium">{item.label}</span>
              ) : (
                <Link to={item.path} className="text-primary hover:text-gold transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
