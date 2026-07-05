import { Category } from '@/types/domain';

export const MOCK_CATEGORIES: (Category & { productCount: number })[] = [
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

export default MOCK_CATEGORIES;
