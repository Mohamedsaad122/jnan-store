import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryCard from './CategoryCard';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

import { MOCK_CATEGORIES } from '@/services/categories/categories.mock';

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
