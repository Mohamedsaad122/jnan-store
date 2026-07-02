import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, ShieldCheck, Gift, Truck } from 'lucide-react';
import FeatureCard from './FeatureCard';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

export const WhyChooseUs: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Heart,
      title: t('home.why_us.features.hospitality.title', { defaultValue: 'كرم الضيافة السعودية' }),
      description: t('home.why_us.features.hospitality.desc', {
        defaultValue:
          'نقدم منتجات منتقاة بعناية لتمثيل التراث والهوية السعودية العريقة في ضيافتكم.',
      }),
    },
    {
      icon: ShieldCheck,
      title: t('home.why_us.features.quality.title', { defaultValue: 'جودة طبيعية مضمونة' }),
      description: t('home.why_us.features.quality.desc', {
        defaultValue: 'منتجاتنا طازجة وخالية من المواد الحافظة والإضافات، نضمن نقاءها ١٠٠٪.',
      }),
    },
    {
      icon: Gift,
      title: t('home.why_us.features.packaging.title', { defaultValue: 'تغليف فاخر وراقٍ' }),
      description: t('home.why_us.features.packaging.desc', {
        defaultValue: 'تغليف متميز وأنيق صمم خصيصاً ليليق بالإهداء ولتزيين مجالس ضيوفكم.',
      }),
    },
    {
      icon: Truck,
      title: t('home.why_us.features.delivery.title', { defaultValue: 'شحن سريع وموثوق' }),
      description: t('home.why_us.features.delivery.desc', {
        defaultValue: 'نصل إليكم في أسرع وقت ممكن وبأعلى معايير الحفاظ على جودة ونضارة المنتجات.',
      }),
    },
  ];

  return (
    <Section className="bg-background border-t border-border/30">
      <Container>
        {/* Section Header */}
        <SectionHeader
          title={t('home.why_us.title', 'لماذا متجر جنان؟')}
          subtitle={t(
            'home.why_us.subtitle',
            'نجمع لك بين أصالة المذاق وفخامة التقديم لتجربة ضيافة سعودية فريدة'
          )}
        />

        {/* Features Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delayIndex={idx}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;
