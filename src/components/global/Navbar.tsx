import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { ROUTES } from '@/constants/routes';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { label: 'الرئيسية', path: ROUTES.HOME },
    { label: 'المتجر', path: ROUTES.SHOP },
    { label: 'الأقسام', path: ROUTES.CATEGORIES },
    { label: 'من نحن', path: ROUTES.ABOUT },
    { label: 'اتصل بنا', path: ROUTES.CONTACT },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-6 space-x-reverse font-tajawal text-sm font-medium">
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;

        return (
          <Link
            key={link.path}
            to={link.path}
            className={clsx(
              'relative py-2 transition-colors hover:text-gold focus-visible:outline-none focus-visible:text-gold',
              isActive
                ? 'text-primary dark:text-gold font-bold'
                : 'text-muted-foreground'
            )}
          >
            {link.label}
            {isActive && (
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-gold rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
