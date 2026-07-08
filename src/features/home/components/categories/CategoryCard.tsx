import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '@/types/domain';
import { useLanguageStore } from '@/store/language.store';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export interface CategoryCardProps {
  category: Category;
  productCount?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, productCount = 0 }) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const name = isRtl ? category.nameAr : category.nameEn;

  // Convert numbers to Arabic locale digits if language is Arabic
  const formatNumber = (num: number) => {
    return isRtl
      ? new Intl.NumberFormat('ar-SA').format(num)
      : new Intl.NumberFormat('en-US').format(num);
  };

  const countText = isRtl
    ? `${formatNumber(productCount)} منتج`
    : `${formatNumber(productCount)} ${productCount === 1 ? 'Product' : 'Products'}`;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group block relative rounded-2xl overflow-hidden border border-border/60 bg-card/45 dark:bg-card/20 hover:border-gold/40 transition-theme shadow-sm hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aspect-square"
      aria-label={`${name}, ${countText}`}
    >
      {/* Background Image Wrapper */}
      <div className="absolute inset-0 z-0">
        {category.imageUrl ? (
          <OptimizedImage
            src={category.imageUrl}
            alt={name}
            aspectRatioClassName="w-full h-full"
            className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gold/10 via-cream/20 to-cardamom/10 dark:from-primary/20 dark:to-cardamom/20" />
        )}
        {/* Soft elegant gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent dark:from-background/98 dark:via-background/30" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-radial from-gold/5 via-transparent to-transparent transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Card Content Overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end items-start text-right z-10">
        <motion.div className="w-full space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
          {/* Category Name */}
          <h3 className="text-base sm:text-lg font-bold text-primary dark:text-gold group-hover:text-gold dark:group-hover:text-foreground font-tajawal transition-colors">
            {name}
          </h3>

          {/* Product Count Badge */}
          <p className="text-[11px] sm:text-xs text-muted-foreground font-medium font-tajawal">
            {countText}
          </p>
        </motion.div>
      </div>

      {/* Decorative Border Glow on Hover */}
      <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 rounded-2xl transition-all duration-300 pointer-events-none" />
    </Link>
  );
};

export default CategoryCard;
