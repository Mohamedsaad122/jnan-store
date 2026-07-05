import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Bell, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/global/Logo';
import Navbar from '@/components/global/Navbar';
import SearchBar from '@/components/global/SearchBar';
import LanguageSwitcher from '@/components/global/LanguageSwitcher';
import ThemeSwitcher from '@/components/global/ThemeSwitcher';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropdownMenu';
import { Avatar } from '@/components/ui/Avatar';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { MobileDrawer } from '@/components/global/MobileDrawer';
import { AnnouncementBar } from '@/components/global/AnnouncementBar';

export const Header: React.FC = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const wishlistIds = useWishlistStore((state) => state.itemIds);
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Scroll visibility management
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrollY > 50
            ? 'shadow-md shadow-gold/5 border-b bg-background/90 backdrop-blur-md'
            : 'bg-background'
        }`}
      >
        {/* Scrolling Announcement Bar */}
        <AnnouncementBar />

        {/* Header content menu */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left elements: mobile menu trigger & logo */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(true)}
                className="md:hidden h-9 w-9"
                aria-label="افتح القائمة"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link to={ROUTES.HOME} aria-label="الرئيسية">
                <Logo />
              </Link>
            </div>

            {/* Desktop link navigation */}
            <div className="hidden md:flex items-center flex-1 justify-center max-w-lg">
              <Navbar />
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-1.5 md:space-x-2.5 space-x-reverse">
              {/* Desktop search triggers */}
              <div className="hidden sm:block">
                <SearchBar />
              </div>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Theme Selector */}
              <ThemeSwitcher />

              {/* Notification icon panel */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:inline-flex h-9 w-9"
                aria-label="التنبيهات"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-gold" />
              </Button>

              {/* Wishlist triggers */}
              <Link to={ROUTES.WISHLIST}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                  aria-label="المفضلة"
                >
                  <Heart className="h-4.5 w-4.5" />
                  {wishlistIds.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-gold-foreground select-none">
                      {wishlistIds.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart sliders */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative h-9 w-9"
                aria-label="سلة المشتريات"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border border-gold/10 select-none">
                    {totalQuantity}
                  </span>
                )}
              </Button>

              {/* Profile Avatar control menu */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="flex items-center focus:outline-none" aria-label="حسابي">
                      <Avatar
                        src={user.avatarUrl}
                        fallbackText={
                          user.firstName || ('name' in user ? String(user['name']) : '')
                        }
                        className="h-8 w-8 cursor-pointer hover:border-gold/50"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <div className="px-3 py-2 border-b text-right">
                      <p className="text-xs text-muted-foreground font-tajawal">مرحباً بك</p>
                      <p className="text-sm font-semibold truncate text-primary font-tajawal">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName}`
                          : 'name' in user
                            ? String(user['name'])
                            : ''}
                      </p>
                    </div>
                    <DropdownMenuItem>
                      <Link to={ROUTES.PROFILE} className="w-full text-right block font-tajawal">
                        الملف الشخصي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={ROUTES.ORDERS} className="w-full text-right block font-tajawal">
                        طلباتي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={ROUTES.SETTINGS} className="w-full text-right block font-tajawal">
                        الإعدادات
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to={ROUTES.AUTH.LOGIN}>
                  <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="تسجيل الدخول">
                    <User className="h-4.5 w-4.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive mobile menu drawer */}
      <MobileDrawer isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
