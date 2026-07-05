import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBestSellers } from '@/hooks/useProducts';
import ProductCard from '../product-card/ProductCard';
import ProductCardSkeleton from '../product-card/ProductCardSkeleton';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

export const BestSellers: React.FC = () => {
  const { t } = useTranslation();

  // Fetch best sellers data using TanStack Query via modular hook
  const { data: products, isLoading } = useBestSellers();

  const getCategoryName = (catId: string) => {
    switch (catId) {
      case 'saudi-coffee':
        return t('category.saudi_coffee', { defaultValue: 'قهوة سعودية' });
      case 'dates':
        return t('category.dates', { defaultValue: 'تمور فاخرة' });
      case 'nuts':
        return t('category.nuts', { defaultValue: 'مكسرات' });
      case 'sweets':
        return t('category.sweets', { defaultValue: 'حلويات وشوكولاتة' });
      default:
        return '';
    }
  };

  return (
    <Section className="bg-cream/5 dark:bg-card/5 border-t border-border/30">
      <Container>
        {/* Section Header */}
        <SectionHeader
          title={t('home.best_sellers.title', 'الأكثر مبيعاً')}
          subtitle={t(
            'home.best_sellers.subtitle',
            'الخيارات المفضلة لدى عملائنا والمنتجات الأكثر مبيعاً في متجرنا'
          )}
          actionLabel={t('home.best_sellers.all', 'تصفح جميع المنتجات')}
          actionLink="/shop?filter=best-sellers"
        />

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
            : products?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={getCategoryName(product.categoryId)}
                />
              ))}
        </div>
      </Container>
    </Section>
  );
};

export default BestSellers;
