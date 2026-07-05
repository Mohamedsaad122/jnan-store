import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useCountdown } from '@/hooks/useCountdown';
import { useFlashSales } from '@/hooks/useProducts';
import ProductCard from '../product-card/ProductCard';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';
import ProductCardSkeleton from '../product-card/ProductCardSkeleton';

// Import Swiper styles inside component
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const FlashSale: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { data: products, isLoading } = useFlashSales();

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

  const getCategoryName = (catId: string) => {
    switch (catId) {
      case 'dates':
        return t('category.dates', { defaultValue: 'تمور فاخرة' });
      case 'saudi-coffee':
        return t('category.saudi_coffee', { defaultValue: 'قهوة سعودية' });
      case 'accessories':
        return t('category.accessories', { defaultValue: 'مستلزمات القهوة' });
      case 'sweets':
        return t('category.sweets', { defaultValue: 'حلويات وشوكولاتة' });
      default:
        return '';
    }
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
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
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
              {products?.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    product={product}
                    categoryName={getCategoryName(product.categoryId)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default FlashSale;
