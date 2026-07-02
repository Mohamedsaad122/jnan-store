import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/global/Logo';
import { ROUTES } from '@/constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-card text-card-foreground transition-theme pb-20 md:pb-8 pt-12 md:pt-16 font-tajawal text-right">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 border-b border-border/60 pb-12">
          {/* Column 1: Brand description */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              متجر جنان يقدم تشكيلة فاخرة من القهوة السعودية والمختصة، المكسرات المحمصة، والشوكولاتة
              والحلا بأعلى معايير الجودة والأصالة.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary dark:text-gold uppercase tracking-wider">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={ROUTES.SHOP}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  المتجر
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CATEGORIES}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  الأقسام
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ABOUT}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CONTACT}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Custom policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary dark:text-gold uppercase tracking-wider">
              السياسات والخصوصية
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground cursor-pointer hover:text-gold transition-colors">
                  سياسة الاسترجاع
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-pointer hover:text-gold transition-colors">
                  شروط الاستخدام
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-pointer hover:text-gold transition-colors">
                  سياسة الشحن والتوصيل
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary dark:text-gold uppercase tracking-wider">
              تواصل معنا
            </h4>
            <p className="text-sm text-muted-foreground">الرياض، المملكة العربية السعودية</p>
            <p className="text-sm text-muted-foreground">البريد: support@jnan-sa.com</p>
            <p className="text-sm text-muted-foreground">الهاتف: +966 50 000 0000</p>
          </div>
        </div>

        {/* Footer Bottom Block */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} متجر جنان (Jnan Store). جميع الحقوق محفوظة.
          </p>

          {/* Payment Methods placeholder */}
          <div className="flex items-center space-x-2 space-x-reverse select-none">
            <span className="text-[10px] text-muted-foreground font-semibold px-2 border rounded">
              مدى
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold px-2 border rounded">
              Apple Pay
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold px-2 border rounded">
              فيزا
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold px-2 border rounded">
              ماستركارد
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
