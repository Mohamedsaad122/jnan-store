import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

interface BrandPartner {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
}

const BRAND_PARTNERS: BrandPartner[] = [
  {
    id: 'brand-1',
    nameAr: 'مزارع جبال الفيفا',
    nameEn: 'Fifa Mountain Estates',
    locationAr: 'جازان',
    locationEn: 'Jazan',
  },
  {
    id: 'brand-2',
    nameAr: 'تمور الأحساء الفاخرة',
    nameEn: 'Al-Ahsa Premium Dates',
    locationAr: 'الأحساء',
    locationEn: 'Al-Ahsa',
  },
  {
    id: 'brand-3',
    nameAr: 'هيل ونخبة البن',
    nameEn: 'Elixir Coffee Co.',
    locationAr: 'الرياض',
    locationEn: 'Riyadh',
  },
  {
    id: 'brand-4',
    nameAr: 'مطاحن الأصالة التراثية',
    nameEn: 'Al-Asalah Mills',
    locationAr: 'القصيم',
    locationEn: 'Al-Qassim',
  },
  {
    id: 'brand-5',
    nameAr: 'شوكولاتة النخلة الذهبية',
    nameEn: 'Golden Palm Chocolates',
    locationAr: 'جدة',
    locationEn: 'Jeddah',
  },
  {
    id: 'brand-6',
    nameAr: 'مستلزمات السدو والتقديم',
    nameEn: 'Al-Sadu Heritage Gear',
    locationAr: 'حائل',
    locationEn: 'Hail',
  },
];

export const PartnerBrands: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <Section className="bg-background border-t border-border/30">
      <Container>
        {/* Section Header */}
        <SectionHeader
          title={t('home.brands.title', 'شركاء النجاح والأصالة')}
          subtitle={t(
            'home.brands.subtitle',
            'نفخر بالتعاون مع أرقى مزارع البن المحلية ومصانع التمور الوطنية لضمان الجودة الفائقة'
          )}
        />

        {/* Responsive Brand Partner Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {BRAND_PARTNERS.map((brand, idx) => {
            const name = isRtl ? brand.nameAr : brand.nameEn;
            const location = isRtl ? brand.locationAr : brand.locationEn;

            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative flex flex-col items-center justify-center p-6 rounded-xl border border-border/40 bg-card/40 hover:bg-card/90 dark:hover:bg-card/85 transition-all duration-300 filter grayscale hover:grayscale-0 shadow-sm hover:shadow-md cursor-pointer select-none"
              >
                {/* Brand Logo Stylized Text Shield */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gold/15 bg-primary/5 group-hover:bg-primary/10 text-gold transition-theme mb-3">
                  <span className="font-serif text-sm font-bold tracking-widest text-gold">🇸🇦</span>
                </div>

                {/* Brand Name */}
                <h4 className="text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-primary dark:group-hover:text-gold transition-colors font-tajawal text-center">
                  {name}
                </h4>

                {/* Estate Location */}
                <span className="text-[9px] sm:text-[10px] text-muted-foreground/60 group-hover:text-muted-foreground/80 font-tajawal text-center mt-1">
                  {location}
                </span>

                {/* Subtle border accent */}
                <div className="absolute inset-0 border border-transparent group-hover:border-gold/25 rounded-xl pointer-events-none transition-theme" />
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default PartnerBrands;
