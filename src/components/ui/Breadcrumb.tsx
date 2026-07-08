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
  // Generate SEO JSON-LD Breadcrumb Schema structured data
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: item.path ? `${window.location.origin}${item.path}` : window.location.href,
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={twMerge('flex py-3 text-sm font-tajawal select-none', className)}
    >
      <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      <ol className="inline-flex items-center space-x-1 md:space-x-2 space-x-reverse">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center text-xs sm:text-sm">
              {index > 0 && (
                <span className="mx-1 text-muted-foreground/60 md:mx-2">
                  {isRtl ? (
                    <ChevronLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </span>
              )}
              {isLast || !item.path ? (
                <span className="text-muted-foreground font-semibold">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-primary dark:text-gold hover:underline transition-all"
                >
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
