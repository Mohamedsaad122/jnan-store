import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';
import MobileNavigation from '@/components/global/MobileNavigation';
import Sheet from '@/components/ui/Sheet';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart.store';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const DefaultLayout: React.FC = () => {
  const { isOpen: isCartOpen, setOpen: setCartOpen, items, totalAmount } = useCartStore();

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

      {/* Cart Slider Drawer */}
      <Sheet
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        side="left" // Cart slides from left in RTL
        title="سلة التسوق"
      >
        <div className="flex flex-col h-full justify-between font-tajawal text-right py-2">
          {items.length === 0 ? (
            /* Empty Cart View */
            <div className="flex flex-col items-center justify-center flex-1 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-muted-foreground mb-4">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-primary mb-1">سلتك فارغة حالياً</p>
              <p className="text-xs text-muted-foreground mb-6">
                تصفح أقسام المتجر وأضف منتجاتك المفضلة
              </p>
              <Button onClick={() => setCartOpen(false)} variant="gold" size="sm">
                تصفح المنتجات
              </Button>
            </div>
          ) : (
            /* Populated Cart View (logic mockup placeholder) */
            <div className="flex flex-col h-full justify-between">
              <div className="flex-grow overflow-y-auto space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card/50"
                  >
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{item.name}</p>
                      <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gold">
                      {item.price * item.quantity} ر.س
                    </span>
                  </div>
                ))}
              </div>

              {/* Checkout details summary block */}
              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex items-center justify-between font-bold text-base text-primary">
                  <span>المجموع الإجمالي:</span>
                  <span className="text-gold">{totalAmount} ر.س</span>
                </div>
                <Link to={ROUTES.CHECKOUT} onClick={() => setCartOpen(false)}>
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <span>إتمام الطلب</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Sheet>
    </div>
  );
};

export default DefaultLayout;
