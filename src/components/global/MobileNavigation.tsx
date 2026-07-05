import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes';
import { Command } from '@/components/ui/Command';

export const MobileNavigation: React.FC = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 border-t bg-background/95 backdrop-blur-md transition-theme py-2 px-4 shadow-lg flex items-center justify-around text-muted-foreground select-none pb-safe">
        {/* Home */}
        <NavLink
          to={ROUTES.HOME}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full font-tajawal text-[10px] gap-0.5 transition-colors ${
              isActive ? 'text-primary dark:text-gold font-bold' : 'hover:text-gold'
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span>الرئيسية</span>
        </NavLink>

        {/* Categories */}
        <NavLink
          to={ROUTES.CATEGORIES}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full font-tajawal text-[10px] gap-0.5 transition-colors ${
              isActive ? 'text-primary dark:text-gold font-bold' : 'hover:text-gold'
            }`
          }
        >
          <Grid className="h-5 w-5" />
          <span>الأقسام</span>
        </NavLink>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full font-tajawal text-[10px] gap-0.5 hover:text-gold focus:outline-none"
          aria-label="البحث"
        >
          <Search className="h-5 w-5" />
          <span>البحث</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full font-tajawal text-[10px] gap-0.5 relative hover:text-gold focus:outline-none"
          aria-label="السلة"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>السلة</span>
          {totalQuantity > 0 && (
            <span className="absolute top-0 right-1/2 translate-x-3 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border border-gold/10">
              {totalQuantity}
            </span>
          )}
        </button>

        {/* Account / Login */}
        <NavLink
          to={isAuthenticated ? ROUTES.PROFILE : ROUTES.AUTH.LOGIN}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full font-tajawal text-[10px] gap-0.5 transition-colors ${
              isActive ? 'text-primary dark:text-gold font-bold' : 'hover:text-gold'
            }`
          }
        >
          <User className="h-5 w-5" />
          <span>حسابي</span>
        </NavLink>
      </div>

      {/* Global Search command trigger on Mobile */}
      <Command isOpen={isSearchOpen} onClose={() => setSearchOpen(false)}>
        <div className="py-8 text-center text-sm text-muted-foreground font-tajawal">
          ابحث عن أي قهوة سعودية، مكسرات، بهارات أو شوكولاتة...
        </div>
      </Command>
    </>
  );
};

export default MobileNavigation;
