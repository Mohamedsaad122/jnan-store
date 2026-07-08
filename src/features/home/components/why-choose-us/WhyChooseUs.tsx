import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, ShieldCheck, Gift, Truck, Star, Award, Sparkles } from 'lucide-react';
import FeatureCard from './FeatureCard';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';

// High-performance scroll-triggered counter using requestAnimationFrame
const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string }> = ({
  value,
  duration = 1.5,
  suffix = '',
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, value, duration]);

  return (
    <span ref={elementRef} className="font-sans font-black text-3xl md:text-4xl text-gold">
      {count}
      {suffix}
    </span>
  );
};

export const WhyChooseUs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

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

  const stats = [
    {
      value: 99,
      suffix: '٪',
      labelAr: 'نسبة رضا العملاء',
      labelEn: 'Customer Satisfaction',
      icon: Star,
    },
    {
      value: 50,
      suffix: 'ألف+',
      labelAr: 'طلب تم توصيله',
      labelEn: 'Orders Delivered',
      icon: Sparkles,
    },
    {
      value: 100,
      suffix: '٪',
      labelAr: 'تسوق آمن وموثوق',
      labelEn: 'Secure Shopping',
      icon: Award,
    },
    {
      value: 24,
      suffix: '/٧',
      labelAr: 'دعم وخدمة متميزة',
      labelEn: '24/7 Dedicated Support',
      icon: ShieldCheck,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        {/* Animated Statistics & Customer Trust Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 md:p-8 rounded-3xl bg-primary/5 dark:bg-cardamom/5 border border-gold/15 select-none items-center justify-center">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center space-y-1.5 p-2"
              >
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-1">
                  <StatIcon className="h-5 w-5" />
                </div>
                <div className="flex items-baseline gap-0.5 justify-center">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {isRtl ? stat.labelAr : stat.labelEn}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;
