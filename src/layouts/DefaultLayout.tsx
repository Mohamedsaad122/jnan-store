import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import MobileNavigation from '@/components/global/MobileNavigation';
import MiniCartDrawer from '@/features/cart/components/MiniCartDrawer';
import CompareBar from '@/components/global/CompareBar';

export const DefaultLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col transition-theme bg-background text-foreground">
      {/* Primary responsive Header */}
      <Header />

      {/* Main page content body */}
      <main className="flex-grow pb-16 md:pb-0 pt-[100px]">
        <Outlet />
      </main>

      {/* Primary responsive Footer */}
      <Footer />

      {/* Fixed Bottom Nav for Mobile viewports */}
      <MobileNavigation />

      {/* Sticky Product Comparison Tray */}
      <CompareBar />

      {/* Cart Slider Drawer */}
      <MiniCartDrawer />
    </div>
  );
};

export default DefaultLayout;
