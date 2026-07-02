import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { ChevronDown, Sparkles, Flame, Coffee, Candy, Package } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navLinks = [
    { label: 'الرئيسية', path: ROUTES.HOME },
    { label: 'المتجر', path: ROUTES.SHOP, hasMenu: true, menuType: 'shop' },
    { label: 'الأقسام', path: ROUTES.CATEGORIES, hasMenu: true, menuType: 'categories' },
    { label: 'الأكثر مبيعاً', path: '/best-sellers', icon: <Flame className="h-3.5 w-3.5 text-gold" /> },
    { label: 'العروض', path: '/offers', icon: <Sparkles className="h-3.5 w-3.5 text-gold" /> },
    { label: 'اتصل بنا', path: ROUTES.CONTACT },
  ];

  const categoriesMegaMenu = [
    {
      title: 'القهوة السعودية الفاخرة',
      icon: <Coffee className="h-4 w-4 text-gold" />,
      items: ['قهوة هرري ممتازة', 'قهوة خولاني درجة أولى', 'قهوة برية فاخرة', 'خلطات جنان الخاصة'],
    },
    {
      title: 'المكسرات الطازجة',
      icon: <Flame className="h-4 w-4 text-gold" />,
      items: ['فستق حلبي محمص', 'كاجو بالليمون والملح', 'لوز أمريكي نيء', 'مشكل مكسرات جنان فاخر'],
    },
    {
      title: 'الحلويات والشوكولاتة',
      icon: <Candy className="h-4 w-4 text-gold" />,
      items: ['تمور محشية باللوز', 'شوكولاتة بلجيكية فاخرة', 'معمول بالتمر والهيل', 'بسبوسة بالزعفران'],
    },
    {
      title: 'الهدايا والتغليف',
      icon: <Package className="h-4 w-4 text-gold" />,
      items: ['صناديق هدايا فاخرة', 'سلال العيد والمناسبات', 'تغليف الهيل والزعفران المخصص', 'بطاقات إهداء فاخرة'],
    },
  ];

  return (
    <nav
      className="hidden md:flex items-center space-x-6 space-x-reverse font-tajawal text-sm font-medium h-full"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;
        const hasActiveDropdown = activeMenu === link.menuType;

        return (
          <div
            key={link.path}
            className="relative py-5 cursor-pointer"
            onMouseEnter={() => link.hasMenu && link.menuType ? setActiveMenu(link.menuType) : setActiveMenu(null)}
          >
            <Link
              to={link.path}
              className={clsx(
                'flex items-center gap-1.5 transition-colors hover:text-gold focus-visible:outline-none focus-visible:text-gold py-1',
                isActive ? 'text-primary dark:text-gold font-bold' : 'text-muted-foreground'
              )}
            >
              {link.icon && link.icon}
              <span>{link.label}</span>
              {link.hasMenu && (
                <ChevronDown
                  className={clsx('h-3.5 w-3.5 transition-transform duration-200', hasActiveDropdown && 'rotate-180')}
                />
              )}
            </Link>

            {/* Mega Menu Infrastructure */}
            {link.hasMenu && link.menuType === 'categories' && (
              <AnimatePresence>
                {activeMenu === 'categories' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-1/2 translate-x-1/2 top-full mt-1 w-[600px] rounded-xl border bg-card p-6 shadow-xl text-card-foreground grid grid-cols-4 gap-6 z-50 text-right font-tajawal border-border/80"
                  >
                    {categoriesMegaMenu.map((sec, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-1.5 justify-end border-b pb-2 font-bold text-xs text-primary">
                          <span>{sec.title}</span>
                          {sec.icon}
                        </div>
                        <ul className="space-y-1.5 text-xs text-muted-foreground font-medium">
                          {sec.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <span className="hover:text-gold transition-colors block py-0.5 cursor-pointer">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Shop dropdown placeholder menu */}
            {link.hasMenu && link.menuType === 'shop' && (
              <AnimatePresence>
                {activeMenu === 'shop' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-1 w-48 rounded-lg border bg-card p-2 shadow-lg text-card-foreground z-50 text-right text-xs space-y-1"
                  >
                    <div className="hover:bg-accent hover:text-gold rounded p-2 transition-colors cursor-pointer">المتجر الرئيسي</div>
                    <div className="hover:bg-accent hover:text-gold rounded p-2 transition-colors cursor-pointer">وصلنا حديثاً</div>
                    <div className="hover:bg-accent hover:text-gold rounded p-2 transition-colors cursor-pointer">عروض ترويجية</div>
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
