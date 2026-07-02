import React, { useState } from 'react';
import { ShoppingBag, Heart, Bell, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/global/Logo';
import Navbar from '@/components/global/Navbar';
import SearchBar from '@/components/global/SearchBar';
import LanguageSwitcher from '@/components/global/LanguageSwitcher';
import ThemeSwitcher from '@/components/global/ThemeSwitcher';
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { Avatar } from '@/components/ui/Avatar';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useAuth } from '@/hooks/useAuth';
import { useLanguageStore } from '@/store/language.store';
import { ROUTES } from '@/constants/routes';
import { MobileDrawer } from '@/components/global/MobileDrawer';

export const Header: React.FC = () => {
  const { totalQuantity, setOpen: setCartOpen } = useCartStore();
  const { itemIds: wishlistIds } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useLanguageStore();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const isRtl = language === 'ar';

  return (
    <>
      <header className="w-full border-b bg-background/85 backdrop-blur-md sticky top-0 z-40 transition-theme">
        {/* Top announcement bar */}
        <div className="w-full bg-primary text-primary-foreground py-2 text-center text-[10px] md:text-xs font-tajawal tracking-wide select-none border-b border-gold/10">
          {isRtl
            ? '✨ شحن مجاني للطلبات بقيمة ٢٠٠ ر.س أو أكثر! كود: JNAN26'
            : '✨ Free shipping for orders above 200 SAR! Code: JNAN26'}
        </div>

        {/* Main Navbar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Left Section: Mobile Menu Trigger & Logo */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(true)}
                className="md:hidden"
                aria-label="افتح القائمة"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link to={ROUTES.HOME} aria-label="الرئيسية">
                <Logo />
              </Link>
            </div>

            {/* Middle Section: Desktop Nav */}
            <div className="hidden md:flex items-center flex-1 justify-center max-w-md">
              <Navbar />
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center space-x-1.5 md:space-x-3 space-x-reverse">
              {/* Desktop Search */}
              <div className="hidden sm:block">
                <SearchBar />
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:inline-flex"
                aria-label="التنبيهات"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-gold" />
              </Button>

              {/* Wishlist */}
              <Link to={ROUTES.WISHLIST}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="المفضلة"
                >
                  <Heart className="h-4.5 w-4.5" />
                  {wishlistIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-gold-foreground select-none">
                      {wishlistIds.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative"
                aria-label="سلة المشتريات"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border border-gold/10 select-none">
                    {totalQuantity}
                  </span>
                )}
              </Button>

              {/* Profile Dropdown */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="flex items-center focus:outline-none" aria-label="حسابي">
                      <Avatar src={user.avatarUrl} fallbackText={user.name} className="h-8 w-8 cursor-pointer hover:border-gold/50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <div className="px-3 py-2 border-b text-right">
                      <p className="text-xs text-muted-foreground">مرحباً بك</p>
                      <p className="text-sm font-semibold truncate text-primary">{user.name}</p>
                    </div>
                    <DropdownMenuItem>
                      <Link to={ROUTES.PROFILE} className="w-full text-right block font-tajawal">الملف الشخصي</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={ROUTES.ORDERS} className="w-full text-right block font-tajawal">طلباتي</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={ROUTES.SETTINGS} className="w-full text-right block font-tajawal font-medium">الإعدادات</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-destructive font-tajawal font-medium">
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to={ROUTES.AUTH.LOGIN}>
                  <Button variant="ghost" size="icon" aria-label="تسجيل الدخول">
                    <User className="h-4.5 w-4.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer overlay */}
      <MobileDrawer isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
