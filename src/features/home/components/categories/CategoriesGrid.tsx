import React from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/types/domain';
import CategoryCard from './CategoryCard';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

// Mock high-quality curated Saudi-themed images representing Jnan Store categories
const MOCK_CATEGORIES: (Category & { productCount: number })[] = [
  {
    id: 'cat-1',
    nameAr: 'القهوة السعودية الفاخرة',
    nameEn: 'Premium Saudi Coffee',
    slug: 'saudi-coffee',
    imageUrl:
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    productCount: 18,
  },
  {
    id: 'cat-2',
    nameAr: 'القهوة المختصة',
    nameEn: 'Specialty Coffee',
    slug: 'specialty-coffee',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    productCount: 24,
  },
  {
    id: 'cat-3',
    nameAr: 'التمور الفاخرة',
    nameEn: 'Premium Dates',
    slug: 'dates',
    imageUrl:
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    productCount: 15,
  },
  {
    id: 'cat-4',
    nameAr: 'المكسرات الطازجة',
    nameEn: 'Fresh Nuts',
    slug: 'nuts',
    imageUrl:
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    productCount: 30,
  },
  {
    id: 'cat-5',
    nameAr: 'الحلويات والشوكولاتة',
    nameEn: 'Sweets & Chocolates',
    slug: 'sweets',
    imageUrl:
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    productCount: 12,
  },
  {
    id: 'cat-6',
    nameAr: 'أدوات القهوة والتقديم',
    nameEn: 'Coffee Accessories',
    slug: 'accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    productCount: 21,
  },
];

export const CategoriesGrid: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section className="bg-cream/10 dark:bg-card/5">
      <Container>
        {/* Section Header */}
        <SectionHeader
          title={t('home.categories.title', 'تسوق حسب الأقسام')}
          subtitle={t(
            'home.categories.subtitle',
            'اختر من تشكيلاتنا الفاخرة التي أعددناها خصيصاً لتناسب ذوقك الرفيع'
          )}
          actionLabel={t('home.categories.all', 'تصفح جميع الأقسام')}
          actionLink="/categories"
        />

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {MOCK_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              productCount={category.productCount}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default CategoriesGrid;
