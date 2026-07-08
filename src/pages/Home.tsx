import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/language.store';
import Hero from '@/components/global/Hero';
import CategoriesGrid from '@/features/home/components/categories/CategoriesGrid';
import FeaturedProducts from '@/features/home/components/featured-products/FeaturedProducts';
import FlashSale from '@/features/home/components/flash-sale/FlashSale';
import BestSellers from '@/features/home/components/best-sellers/BestSellers';
import WhyChooseUs from '@/features/home/components/why-choose-us/WhyChooseUs';
import Testimonials from '@/features/home/components/testimonials/Testimonials';
import PartnerBrands from '@/features/home/components/partner-brands/PartnerBrands';
import Newsletter from '@/features/home/components/newsletter/Newsletter';
import InstagramGallery from '@/features/home/components/instagram/InstagramGallery';

const Home: React.FC = () => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="flex flex-col overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>
          {isRtl
            ? 'الرئيسية | متجر جنان للقهوة والمكسرات والتمور'
            : 'Home | Jnan Premium Coffee, Nuts & Dates'}
        </title>
        <meta
          name="description"
          content={
            isRtl
              ? 'متجر جنان يقدم تشكيلة فاخرة من القهوة السعودية والمختصة، المكسرات المحمصة، والتمور والشوكولاتة بأعلى معايير الجودة.'
              : 'Jnan Store offers a premium selection of Saudi coffee, specialty coffee, roasted nuts, dates, and sweets.'
          }
        />
        <meta
          property="og:title"
          content={isRtl ? 'متجر جنان للقهوة والمكسرات والتمور' : 'Jnan Premium Store'}
        />
        <meta
          property="og:description"
          content={
            isRtl
              ? 'متجر جنان يقدم تشكيلة فاخرة من القهوة السعودية والمختصة، المكسرات المحمصة، والتمور والشوكولاتة بأعلى معايير الجودة.'
              : 'Jnan Store offers a premium selection of Saudi coffee, specialty coffee, roasted nuts, dates, and sweets.'
          }
        />
      </Helmet>

      <Hero />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <CategoriesGrid />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <FeaturedProducts />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <FlashSale />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <BestSellers />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <WhyChooseUs />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <Testimonials />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <PartnerBrands />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <Newsletter />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealVariants}
      >
        <InstagramGallery />
      </motion.div>
    </div>
  );
};

export default Home;
