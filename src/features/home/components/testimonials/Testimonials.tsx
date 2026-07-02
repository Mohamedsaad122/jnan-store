import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import TestimonialCard, { Testimonial } from './TestimonialCard';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

// Import Swiper styles inside component
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const Testimonials: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const testimonials: Testimonial[] = [
    {
      id: 't-1',
      name: t('home.testimonials.items.faisal.name', { defaultValue: 'فيصل العتيبي' }),
      location: t('home.testimonials.items.faisal.loc', { defaultValue: 'الرياض' }),
      rating: 5,
      comment: t('home.testimonials.items.faisal.comment', {
        defaultValue:
          'القهوة السعودية عندهم لا يعلى عليها، الهيل والزعفران موزونين بالملي والتغليف يواجه لضيوفك ويبيض الوجه.',
      }),
    },
    {
      id: 't-2',
      name: t('home.testimonials.items.sarah.name', { defaultValue: 'سارة الغامدي' }),
      location: t('home.testimonials.items.sarah.loc', { defaultValue: 'جدة' }),
      rating: 5,
      comment: t('home.testimonials.items.sarah.comment', {
        defaultValue:
          'صندوق تمور العجوة كان هدية رائعة للوالدة، الجودة فوق الممتازة وحبات التمر كبيرة ومحشية بطريقة مرتبة جداً.',
      }),
    },
    {
      id: 't-3',
      name: t('home.testimonials.items.abdul.name', { defaultValue: 'عبدالرحمن السبيعي' }),
      location: t('home.testimonials.items.abdul.loc', { defaultValue: 'الدمام' }),
      rating: 5,
      comment: t('home.testimonials.items.abdul.comment', {
        defaultValue:
          'المكسرات المحمصة طازجة ومقرمشة، وسرعة التوصيل صراحة أذهلتني. تجربة تسوق راقية وسأكررها بالتأكيد.',
      }),
    },
    {
      id: 't-4',
      name: t('home.testimonials.items.nouf.name', { defaultValue: 'نوف الحربي' }),
      location: t('home.testimonials.items.nouf.loc', { defaultValue: 'المدينة المنورة' }),
      rating: 5,
      comment: t('home.testimonials.items.nouf.comment', {
        defaultValue:
          'أدوات التقديم والنحاسيات جودتها ممتازة وتصميمها يجمع بين الأصالة والمظهر الحديث. خدمة عملاء سريعة ومتعاونة.',
      }),
    },
  ];

  return (
    <Section className="bg-primary/5 dark:bg-cardamom/5 border-t border-border/30 overflow-hidden">
      <Container>
        {/* Section Header */}
        <SectionHeader
          title={t('home.testimonials.title', 'قالوا عن جنان')}
          subtitle={t(
            'home.testimonials.subtitle',
            'نسعد بمشاركة آراء عملائنا الذين وثقوا بمنتجاتنا وشاركونا تجاربهم الفريدة'
          )}
        />

        {/* Swiper Slider Wrapper */}
        <div className="relative pt-2">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={24}
            slidesPerView={1}
            dir={isRtl ? 'rtl' : 'ltr'}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-14"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto">
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </Section>
  );
};

export default Testimonials;
