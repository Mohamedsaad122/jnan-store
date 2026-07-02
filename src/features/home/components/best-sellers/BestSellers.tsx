import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/domain';
import ProductCard from '../product-card/ProductCard';
import ProductCardSkeleton from '../product-card/ProductCardSkeleton';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

// Mock list of best-selling products matching Jnan storefront layout
const MOCK_BEST_SELLERS: Product[] = [
  {
    id: 'prod-5',
    nameAr: 'بن هرري سعودي حمصة فاتحة فاخرة',
    nameEn: 'Premium Saudi Harari Blend Coffee',
    slug: 'premium-saudi-harari-coffee',
    descriptionAr: 'حبوب قهوة هررية مختارة محمصة بعناية مع الهيل الفواح.',
    descriptionEn: 'Selected Harari coffee beans carefully roasted with fragrant cardamom.',
    price: 95,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'saudi-coffee',
    sku: 'JNAN-COF-05',
    stock: 40,
    rating: 4.9,
    reviewsCount: 154,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'prod-6',
    nameAr: 'صندوق هدايا تمور العجوة الفاخرة',
    nameEn: 'Luxury Stuffed Ajwa Dates Gift Box',
    slug: 'luxury-ajwa-dates-gift-box',
    descriptionAr: 'تمر عجوة المدينة حبة كبيرة منسقة في علبة هدايا جلدية فاخرة.',
    descriptionEn: 'Large-size Ajwa Al-Madinah dates curated in a premium leather gift box.',
    price: 240,
    salePrice: 190,
    images: [
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'dates',
    sku: 'JNAN-DAT-06',
    stock: 15,
    rating: 5.0,
    reviewsCount: 82,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'prod-7',
    nameAr: 'فستق حلبي محمص نخب أول بالليمون',
    nameEn: 'Premium Roasted Lemon Pistachios',
    slug: 'premium-roasted-lemon-pistachios',
    descriptionAr: 'فستق حلبي كبير محمص طازجاً بنكهة ملح الليمون والزعفران.',
    descriptionEn: 'Freshly roasted large pistachios seasoned with lemon salt and saffron.',
    price: 75,
    images: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'nuts',
    sku: 'JNAN-NUT-07',
    stock: 30,
    rating: 4.8,
    reviewsCount: 96,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'prod-8',
    nameAr: 'معمول بالتمر الفاخر بنكهة الهيل',
    nameEn: 'Premium Cardamom Dates Maamoul',
    slug: 'premium-cardamom-dates-maamoul',
    descriptionAr: 'معمول هش يذوب في الفم محشو بأجود أنواع التمر والبهارات الأصيلة.',
    descriptionEn: 'Melt-in-your-mouth soft maamoul filled with premium dates and spices.',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'sweets',
    sku: 'JNAN-SWE-08',
    stock: 50,
    rating: 4.7,
    reviewsCount: 110,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

export const BestSellers: React.FC = () => {
  const { t } = useTranslation();

  // Fetch best sellers data using TanStack Query
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['best-sellers'],
    queryFn: async () => {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_BEST_SELLERS;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

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
