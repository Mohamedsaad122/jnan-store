import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/domain';
import ProductCard from '../product-card/ProductCard';
import ProductCardSkeleton from '../product-card/ProductCardSkeleton';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

// Mock list of premium Saudi featured products for fallbacks/demonstrations
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    nameAr: 'القهوة السعودية الفاخرة - الخلطة الذهبية',
    nameEn: 'Premium Saudi Coffee - Golden Blend',
    slug: 'premium-saudi-coffee-golden-blend',
    descriptionAr: 'خلطة كلاسيكية محبوكة بالهيل والزعفران الفاخر.',
    descriptionEn: 'A classic blend prepared with cardamoms and premium saffron.',
    price: 85,
    salePrice: 75,
    images: [
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'saudi-coffee',
    sku: 'JNAN-COF-01',
    stock: 45,
    rating: 4.9,
    reviewsCount: 120,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'prod-2',
    nameAr: 'بن إثيوبي ييرغاشيفي مختص',
    nameEn: 'Ethiopian Yirgacheffe Specialty Coffee',
    slug: 'ethiopian-yirgacheffe-specialty',
    descriptionAr: 'حبوب بن مجففة ذات إيحاءات زهرية وحمضية لطيفة.',
    descriptionEn: 'Sun-dried coffee beans with floral notes and pleasant acidity.',
    price: 65,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'specialty-coffee',
    sku: 'JNAN-SPC-02',
    stock: 20,
    rating: 4.8,
    reviewsCount: 88,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'prod-3',
    nameAr: 'تمر سكري فاخر محشي باللوز والهيل',
    nameEn: 'Luxury Stuffed Sukkari Dates',
    slug: 'luxury-stuffed-sukkari-dates',
    descriptionAr: 'تمور سكري منتقاة حبة حبة، محشية باللوز المقرمش ونكهة الهيل.',
    descriptionEn: 'Selected Sukkari dates, stuffed with crunchy almonds and cardamom flavour.',
    price: 120,
    salePrice: 95,
    images: [
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'dates',
    sku: 'JNAN-DAT-03',
    stock: 15,
    rating: 4.9,
    reviewsCount: 95,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'prod-4',
    nameAr: 'مكسرات مشكلة فاخرة محمصة',
    nameEn: 'Roasted Premium Mixed Nuts',
    slug: 'roasted-premium-mixed-nuts',
    descriptionAr: 'مزيج فاخر من اللوز الكاجو والفستق المحمص بدون زيوت.',
    descriptionEn: 'Luxury blend of roasted almonds, cashews and pistachios oil-free.',
    price: 50,
    images: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'nuts',
    sku: 'JNAN-NUT-04',
    stock: 8,
    rating: 4.7,
    reviewsCount: 64,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

export const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation();

  // TanStack Query for products data fetching
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_PRODUCTS;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

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
