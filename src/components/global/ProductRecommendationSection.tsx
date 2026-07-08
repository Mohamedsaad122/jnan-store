import React from 'react';
import { useRecommendations, RecommendationType } from '@/hooks/useRecommendations';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';

interface ProductRecommendationSectionProps {
  type: RecommendationType;
  titleAr: string;
  titleEn: string;
  productId?: string;
  categoryId?: string;
  limit?: number;
}

export const ProductRecommendationSection: React.FC<ProductRecommendationSectionProps> = ({
  type,
  titleAr,
  titleEn,
  productId,
  categoryId,
  limit = 4,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { data: recommendations, isLoading } = useRecommendations({
    type,
    productId,
    categoryId,
    limit,
  });

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = direction === 'left' ? -300 : 300;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="w-full select-none font-tajawal mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-5 w-5 rounded-full bg-gold/15 animate-pulse" />
          <div className="h-6 w-48 bg-muted/30 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, idx) => (
            <div key={idx} className="border border-border/40 rounded-2xl p-3 bg-card space-y-3">
              <div className="aspect-square bg-muted/30 rounded-xl animate-pulse w-full" />
              <div className="h-4 bg-muted/30 rounded-sm w-3/4 animate-pulse" />
              <div className="h-3 bg-muted/30 rounded-sm w-1/2 animate-pulse" />
              <div className="h-5 bg-muted/30 rounded-sm w-1/3 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  const sectionTitle = isRtl ? titleAr : titleEn;

  return (
    <div className="w-full select-none font-tajawal mb-12 relative group/section">
      {/* Title & Scroll Control Buttons */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h3 className="text-base md:text-lg font-black text-primary flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-gold fill-gold/10" />
          <span>{sectionTitle}</span>
        </h3>

        {recommendations.length > 2 && (
          <div className="flex items-center gap-1.5" dir="ltr">
            <button
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-lg border border-border/50 bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-all active:scale-95"
              aria-label={isRtl ? 'السابق' : 'Previous'}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-lg border border-border/50 bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-all active:scale-95"
              aria-label={isRtl ? 'التالي' : 'Next'}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Carousel Tray */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory text-right w-full"
        style={{ scrollBehavior: 'smooth' }}
      >
        {recommendations.map((product) => (
          <div key={product.id} className="w-[185px] md:w-[245px] shrink-0 snap-start select-text">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Overflow Edge Shadows */}
      <div className="absolute top-12 bottom-4 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity" />
      <div className="absolute top-12 bottom-4 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity" />
    </div>
  );
};

export default ProductRecommendationSection;
