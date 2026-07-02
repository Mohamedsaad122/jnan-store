import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Product } from '@/types/domain';
import { useCountdown } from '@/hooks/useCountdown';
import ProductCard from '../product-card/ProductCard';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

// Import Swiper styles inside component
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MOCK_FLASH_PRODUCTS: Product[] = [
  {
    id: 'flash-1',
    nameAr: 'تمور عجوة المدينة المنورة الفاخرة',
    nameEn: 'Premium Ajwa Al-Madinah Dates',
    slug: 'premium-ajwa-madinah-dates',
    descriptionAr: 'عجوة المدينة المنورة الفاخرة ذات الحجم الكبير المنتقاة.',
    descriptionEn: 'Selected large-size premium Ajwa dates from Al-Madinah.',
    price: 180,
    salePrice: 120,
    images: [
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'dates',
    sku: 'JNAN-FLASH-01',
    stock: 10,
    rating: 4.9,
    reviewsCount: 140,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'flash-2',
    nameAr: 'قهوة خولانية برية نادرة',
    nameEn: 'Rare Saudi Wild Khawlani Coffee',
    slug: 'rare-saudi-wild-khawlani-coffee',
    descriptionAr: 'حبوب قهوة خولانية برية نادرة من مرتفعات جازان.',
    descriptionEn: 'Rare wild Khawlani coffee beans from Jazan highlands.',
    price: 150,
    salePrice: 99,
    images: [
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'saudi-coffee',
    sku: 'JNAN-FLASH-02',
    stock: 4,
    rating: 4.9,
    reviewsCount: 72,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'flash-3',
    nameAr: 'طقم فناجيل تقديم القهوة النحاسي الفاخر',
    nameEn: 'Luxury Copper Coffee Serving Set',
    slug: 'luxury-copper-serving-set',
    descriptionAr: 'طقم نحاسي منقوش يدوياً يضم دلة و٦ فناجيل تراثية.',
    descriptionEn: 'Hand-engraved copper set containing 1 dallah and 6 cups.',
    price: 280,
    salePrice: 196,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'accessories',
    sku: 'JNAN-FLASH-03',
    stock: 3,
    rating: 4.8,
    reviewsCount: 25,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'flash-4',
    nameAr: 'شوكولاتة بلجيكية فاخرة بالهيل والزعفران',
    nameEn: 'Luxury Belgian Saffron & Cardamom Chocolate',
    slug: 'luxury-belgian-saffron-cardamom-chocolate',
    descriptionAr: 'شوكولاتة بلجيكية داكنة بنكهة الهيل الطبيعي والزعفران الحر.',
    descriptionEn: 'Dark Belgian chocolate infused with natural cardamom and premium saffron.',
    price: 90,
    salePrice: 63,
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'sweets',
    sku: 'JNAN-FLASH-04',
    stock: 12,
    rating: 4.8,
    reviewsCount: 41,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

export const FlashSale: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // Set the target date dynamically to 3 days in the future to keep the countdown active
  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  }, []);

  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  const formatNumber = (num: number) => {
    return isRtl
      ? new Intl.NumberFormat('ar-SA', { minimumIntegerDigits: 2 }).format(num)
      : new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(num);
  };

  return (
    <Section className="bg-primary/5 dark:bg-cardamom/5 overflow-hidden">
      <Container>
        {/* Section Header containing Countdown */}
        <SectionHeader
          title={t('home.flash.title', 'عروض حصرية لفترة محدودة')}
          subtitle={t(
            'home.flash.subtitle',
            'اغتنم الفرصة الآن واحصل على تشكيلة فاخرة بخصومات استثنائية'
          )}
          actionLabel={t('home.flash.all', 'تصفح العروض')}
          actionLink="/shop?filter=sale"
        >
          {/* Countdown Clock Display */}
          {!isExpired && (
            <div
              className="flex items-center gap-1.5 font-sans text-xs font-bold text-primary dark:text-gold select-none mt-2 sm:mt-0"
              dir="ltr"
            >
              <span className="bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground px-2 py-1.5 rounded-lg text-center min-w-[34px]">
                {formatNumber(seconds)}
              </span>
              <span className="text-primary dark:text-gold animate-pulse">:</span>
              <span className="bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground px-2 py-1.5 rounded-lg text-center min-w-[34px]">
                {formatNumber(minutes)}
              </span>
              <span className="text-primary dark:text-gold animate-pulse">:</span>
              <span className="bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground px-2 py-1.5 rounded-lg text-center min-w-[34px]">
                {formatNumber(hours)}
              </span>
              <span className="text-primary dark:text-gold animate-pulse">:</span>
              <span className="bg-primary text-primary-foreground dark:bg-gold dark:text-gold-foreground px-2 py-1.5 rounded-lg text-center min-w-[34px]">
                {formatNumber(days)}
              </span>
            </div>
          )}
        </SectionHeader>

        {/* Carousel Slider */}
        <div className="relative pt-2">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            spaceBetween={20}
            slidesPerView={1}
            dir={isRtl ? 'rtl' : 'ltr'}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {MOCK_FLASH_PRODUCTS.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  product={product}
                  categoryName={
                    product.categoryId === 'dates'
                      ? t('category.dates', { defaultValue: 'تمور فاخرة' })
                      : product.categoryId === 'saudi-coffee'
                        ? t('category.saudi_coffee', { defaultValue: 'قهوة سعودية' })
                        : product.categoryId === 'accessories'
                          ? t('category.accessories', { defaultValue: 'مستلزمات القهوة' })
                          : t('category.sweets', { defaultValue: 'حلويات وشوكولاتة' })
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </Section>
  );
};

export default FlashSale;
