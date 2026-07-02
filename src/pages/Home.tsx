import React from 'react';
import Hero from '@/components/global/Hero';
import CategoriesGrid from '@/features/home/components/categories/CategoriesGrid';
import FeaturedProducts from '@/features/home/components/featured-products/FeaturedProducts';
import FlashSale from '@/features/home/components/flash-sale/FlashSale';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategoriesGrid />
      <FeaturedProducts />
      <FlashSale />
    </div>
  );
};

export default Home;
