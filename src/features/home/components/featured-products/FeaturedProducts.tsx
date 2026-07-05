import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductCard from '../product-card/ProductCard';
import ProductCardSkeleton from '../product-card/ProductCardSkeleton';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

export const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation();

  // TanStack Query for featured products data fetching via modular hook
  const { data: products, isLoading } = useFeaturedProducts();

  // Map category slug to translation name
  const getCategoryName = (catId: string) => {
    switch (catId) {
      case 'saudi-coffee':
        return t('category.saudi_coffee', { defaultValue: 'قهوة سعودية' });
      case 'specialty-coffee':
        return t('category.specialty_coffee', { defaultValue: 'قهوة مختصة' });
      case 'dates':
        return t('category.dates', { defaultValue: 'تمور فاخرة' });
      case 'nuts':
        return t('category.nuts', { defaultValue: 'مكسرات' });
      default:
        return '';
    }
  };

  return (
    <Section className="bg-background">
      <Container>
        {/* Section Title */}
        <SectionHeader
          title={t('home.featured.title', 'المنتجات المميزة')}
          subtitle={t(
            'home.featured.subtitle',
            'مجموعة مختارة بعناية من أفضل وأكثر منتجاتنا طلباً وجودة'
          )}
          actionLabel={t('home.featured.all', 'عرض كل المنتجات')}
          actionLink="/shop"
        />

        {/* Responsive Grid */}
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

export default FeaturedProducts;
