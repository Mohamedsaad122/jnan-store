import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import {
  ChevronDown,
  Sparkles,
  Flame,
  Coffee,
  Candy,
  Package,
  Star,
  Calendar,
  Percent,
} from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const navLinks = [
    { label: 'الرئيسية', path: ROUTES.HOME },
    { label: 'المتجر', path: ROUTES.SHOP, hasMenu: true, menuType: 'shop' },
    { label: 'الأقسام', path: ROUTES.CATEGORIES, hasMenu: true, menuType: 'categories' },
    {
      label: 'الأكثر مبيعاً',
      path: ROUTES.BEST_SELLERS,
      icon: <Flame className="h-3.5 w-3.5 text-gold" />,
    },
    { label: 'العروض', path: ROUTES.OFFERS, icon: <Sparkles className="h-3.5 w-3.5 text-gold" /> },
    { label: 'اتصل بنا', path: ROUTES.CONTACT },
  ];

  const categoriesMegaMenu = [
    {
      title: 'القهوة السعودية الفاخرة',
      slug: 'saudi-coffee',
      icon: <Coffee className="h-4 w-4 text-gold" />,
      items: ['قهوة هرري ممتازة', 'قهوة خولاني درجة أولى', 'قهوة برية فاخرة', 'خلطات جنان الخاصة'],
    },
    {
      title: 'المكسرات الطازجة',
      slug: 'nuts',
      icon: <Flame className="h-4 w-4 text-gold" />,
      items: ['فستق حلبي محمص', 'كاجو بالليمون والملح', 'لوز أمريكي نيء', 'مشكل مكسرات جنان فاخر'],
    },
    {
      title: 'الحلويات والشوكولاتة',
      slug: 'sweets',
      icon: <Candy className="h-4 w-4 text-gold" />,
      items: [
        'تمور محشية باللوز',
        'شوكولاتة بلجيكية فاخرة',
        'معمول بالتمر والهيل',
        'بسبوسة بالزعفران',
      ],
    },
    {
      title: 'الهدايا والتغليف',
      slug: 'accessories',
      icon: <Package className="h-4 w-4 text-gold" />,
      items: [
        'صناديق هدايا فاخرة',
        'سلال العيد والمناسبات',
        'تغليف الهيل والزعفران المخصص',
        'بطاقات إهداء فاخرة',
      ],
    },
  ];

  const shopMegaMenu = {
    collections: [
      {
        nameAr: 'القهوة السعودية',
        nameEn: 'Saudi Coffee',
        slug: 'saudi-coffee',
        icon: <Coffee className="h-3.5 w-3.5 text-gold" />,
      },
      {
        nameAr: 'القهوة المختصة',
        nameEn: 'Specialty Coffee',
        slug: 'specialty-coffee',
        icon: <Star className="h-3.5 w-3.5 text-gold" />,
      },
      {
        nameAr: 'التمور الفاخرة',
        nameEn: 'Premium Dates',
        slug: 'dates',
        icon: <Calendar className="h-3.5 w-3.5 text-gold" />,
      },
      {
        nameAr: 'المكسرات الطازجة',
        nameEn: 'Fresh Nuts',
        slug: 'nuts',
        icon: <Flame className="h-3.5 w-3.5 text-gold" />,
      },
      {
        nameAr: 'الحلويات والشوكولاتة',
        nameEn: 'Sweets',
        slug: 'sweets',
        icon: <Candy className="h-3.5 w-3.5 text-gold" />,
      },
    ],
    shortcuts: [
      {
        nameAr: 'وصلنا حديثاً',
        nameEn: 'New Arrivals',
        path: '/shop?sort=newest',
        icon: <Sparkles className="h-3.5 w-3.5 text-gold" />,
      },
      {
        nameAr: 'الأكثر تقييماً',
        nameEn: 'Top Rated',
        path: '/shop?sort=rating',
        icon: <Star className="h-3.5 w-3.5 text-gold" />,
      },
      {
        nameAr: 'العروض الحالية',
        nameEn: 'Active Offers',
        path: '/offers',
        icon: <Percent className="h-3.5 w-3.5 text-gold" />,
      },
    ],
  };

  return (
    <nav
      className="hidden md:flex items-center space-x-6 space-x-reverse font-tajawal text-sm font-medium h-full relative"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;
        const hasActiveDropdown = activeMenu === link.menuType;

        return (
          <div
            key={link.path}
            className="relative py-5 cursor-pointer"
            onMouseEnter={() =>
              link.hasMenu && link.menuType ? setActiveMenu(link.menuType) : setActiveMenu(null)
            }
          >
            <Link
              to={link.path}
              className={clsx(
                'flex items-center gap-1.5 transition-colors hover:text-gold focus-visible:outline-none focus-visible:text-gold py-1 relative z-10',
                isActive ? 'text-primary dark:text-gold font-bold' : 'text-muted-foreground'
              )}
            >
              {link.icon && link.icon}
              <span>{link.label}</span>
              {link.hasMenu && (
                <ChevronDown
                  className={clsx(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    hasActiveDropdown && 'rotate-180'
                  )}
                />
              )}
            </Link>

            {/* Sliding Underline Active Page Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeNavLine"
                className="absolute bottom-3 left-0 right-0 h-[2.5px] bg-gold rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {/* Categories Mega Menu */}
            {link.hasMenu && link.menuType === 'categories' && (
              <AnimatePresence>
                {activeMenu === 'categories' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-1/2 translate-x-1/2 top-full mt-1 w-[600px] rounded-2xl border bg-card p-6 shadow-2xl text-card-foreground grid grid-cols-4 gap-6 z-50 text-right font-tajawal border-border/80"
                  >
                    {categoriesMegaMenu.map((sec, idx) => (
                      <div key={idx} className="space-y-3">
                        <Link
                          to={`/shop?category=${sec.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center gap-1.5 justify-end border-b pb-2 font-bold text-xs text-primary dark:text-gold hover:text-gold transition-colors decoration-none"
                        >
                          <span>{sec.title}</span>
                          {sec.icon}
                        </Link>
                        <ul className="space-y-1.5 text-xs text-muted-foreground font-medium p-0 m-0 list-none">
                          {sec.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link
                                to={`/shop?category=${sec.slug}&search=${encodeURIComponent(item)}`}
                                onClick={() => setActiveMenu(null)}
                                className="hover:text-gold transition-colors block py-0.5 cursor-pointer decoration-none text-muted-foreground"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Shop Mega Menu Dropdown */}
            {link.hasMenu && link.menuType === 'shop' && (
              <AnimatePresence>
                {activeMenu === 'shop' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-1 w-[380px] rounded-2xl border bg-card p-5 shadow-2xl text-card-foreground z-50 text-right grid grid-cols-2 gap-4 border-border/85"
                  >
                    {/* Collections Column */}
                    <div className="space-y-2.5">
                      <div className="text-[10px] font-bold text-gold uppercase tracking-wider border-b pb-1 mb-2">
                        {isRtl ? 'أقسام المتجر' : 'Collections'}
                      </div>
                      {shopMegaMenu.collections.map((coll, idx) => (
                        <Link
                          key={idx}
                          to={`/shop?category=${coll.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center justify-end gap-2 p-1.5 rounded-lg hover:bg-muted/40 hover:text-gold transition-colors text-xs font-bold text-primary dark:text-foreground decoration-none"
                        >
                          <span>{isRtl ? coll.nameAr : coll.nameEn}</span>
                          {coll.icon}
                        </Link>
                      ))}
                    </div>

                    {/* Shortcuts Column */}
                    <div className="space-y-2.5 border-r border-border/10 pr-4">
                      <div className="text-[10px] font-bold text-gold uppercase tracking-wider border-b pb-1 mb-2">
                        {isRtl ? 'روابط سريعة' : 'Quick Actions'}
                      </div>
                      {shopMegaMenu.shortcuts.map((shortcut, idx) => (
                        <Link
                          key={idx}
                          to={shortcut.path}
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center justify-end gap-2 p-1.5 rounded-lg hover:bg-muted/40 hover:text-gold transition-colors text-xs font-bold text-primary dark:text-foreground decoration-none"
                        >
                          <span>{isRtl ? shortcut.nameAr : shortcut.nameEn}</span>
                          {shortcut.icon}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Navbar;
