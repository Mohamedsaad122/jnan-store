import React from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '../section-header/SectionHeader';
import { Section } from '@/components/global/Section';
import { Container } from '@/components/global/Container';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface InstagramPost {
  id: string;
  imageUrl: string;
  altAr: string;
  altEn: string;
  link: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=500',
    altAr: 'حبوب القهوة المختصة المحمصة حديثاً في متجر جنان',
    altEn: 'Freshly roasted specialty coffee beans at Jnan Store',
    link: 'https://instagram.com',
  },
  {
    id: 'post-2',
    imageUrl:
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=500',
    altAr: 'تمور سكري فاخرة تقدم مع القهوة السعودية الأصيلة',
    altEn: 'Premium Sukkari dates served with authentic Saudi coffee',
    link: 'https://instagram.com',
  },
  {
    id: 'post-3',
    imageUrl:
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=500',
    altAr: 'تحضير القهوة السعودية بالهيل والزعفران الفواح',
    altEn: 'Preparing Saudi coffee with cardamom and aromatic saffron',
    link: 'https://instagram.com',
  },
  {
    id: 'post-4',
    imageUrl:
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=500',
    altAr: 'مكسرات محمصة طازجة ومملحة للتسالي والضيافة الراقية',
    altEn: 'Freshly roasted salted nuts for high-class hospitality',
    link: 'https://instagram.com',
  },
  {
    id: 'post-5',
    imageUrl:
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=500',
    altAr: 'شوكولاتة بلجيكية فاخرة مغلفة لتناسب كافة المناسبات والسهرات',
    altEn: 'Premium wrapped Belgian chocolates suitable for all occasions',
    link: 'https://instagram.com',
  },
  {
    id: 'post-6',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=500',
    altAr: 'أدوات تقديم نحاسية ودلة عربية أصيلة للقهوة المغلية',
    altEn: 'Copper serving gear and authentic Arabic dallah for brewed coffee',
    link: 'https://instagram.com',
  },
];

export const InstagramGallery: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <Section className="bg-cream/10 dark:bg-card/5 border-t border-border/30">
      <Container>
        {/* Section Header */}
        <SectionHeader
          title={t('home.instagram.title', 'جنان في إنستغرام')}
          subtitle={t(
            'home.instagram.subtitle',
            'تابعوا حسابنا لمزيد من لقطات الضيافة، وصفات البن الخاصة، وورشتنا المفتوحة'
          )}
          actionLabel={t('home.instagram.follow', 'تابعنا @jnan_store')}
          actionLink="https://instagram.com"
        />

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post) => {
            const altText = isRtl ? post.altAr : post.altEn;

            return (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square rounded-2xl overflow-hidden border border-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={altText}
              >
                <OptimizedImage
                  src={post.imageUrl}
                  alt={altText}
                  aspectRatioClassName="w-full h-full"
                  className="h-full w-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                />

                {/* Hover overlay with Instagram Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-gold shadow-md"
                  >
                    <Instagram className="h-5 w-5" />
                  </motion.div>
                </div>

                {/* Decorative gold border on hover */}
                <div className="absolute inset-0 border border-transparent group-hover:border-gold/30 rounded-2xl transition-theme pointer-events-none" />
              </a>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default InstagramGallery;
