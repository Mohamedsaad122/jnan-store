import React from 'react';
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
  return (
    <div className="flex flex-col">
      <Hero />
      <CategoriesGrid />
      <FeaturedProducts />
      <FlashSale />
      <BestSellers />
      <WhyChooseUs />
      <Testimonials />
      <PartnerBrands />
      <Newsletter />
      <InstagramGallery />
    </div>
  );
};

export default Home;
