import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, Twitter, MessageCircle, ShieldCheck } from 'lucide-react';
import Logo from '@/components/global/Logo';
import { ROUTES } from '@/constants/routes';
import { useLanguageStore } from '@/store/language.store';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  return (
    <footer className="w-full border-t border-border/40 bg-card text-card-foreground transition-theme pb-20 md:pb-8 pt-12 md:pt-16 font-tajawal text-start">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 border-b border-border/30 pb-12">
          {/* Column 1: Brand description & Socials */}
          <div className="space-y-4">
            <Logo />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed select-text">
              {t(
                'footer.desc',
                'متجر جنان يقدم تشكيلة فاخرة من القهوة السعودية والمختصة، المكسرات المحمصة، والشوكولاتة والحلا بأعلى معايير الجودة والأصالة.'
              )}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-muted-foreground hover:bg-primary hover:text-gold transition-theme shadow-sm border border-border/20"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-muted-foreground hover:bg-primary hover:text-gold transition-theme shadow-sm border border-border/20"
                aria-label="Twitter X"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-muted-foreground hover:bg-primary hover:text-gold transition-theme shadow-sm border border-border/20"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary dark:text-gold uppercase tracking-wider">
              {t('footer.quick_links', 'روابط سريعة')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  to={ROUTES.HOME}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('nav.home', 'الرئيسية')}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.SHOP}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('nav.shop', 'المتجر')}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.BEST_SELLERS}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('nav.best_sellers', 'الأكثر مبيعاً')}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.OFFERS}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('nav.offers', 'العروض')}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CATEGORIES}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('nav.categories', 'الأقسام')}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ABOUT}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('nav.about', 'من نحن')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Custom policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary dark:text-gold uppercase tracking-wider">
              {t('footer.policies', 'السياسات والخصوصية')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  to="/policies/refund"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('footer.policy.refund', 'سياسة الاسترجاع')}
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/terms"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('footer.policy.terms', 'شروط الاستخدام')}
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/shipping"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {t('footer.policy.shipping', 'سياسة الشحن والتوصيل')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary dark:text-gold uppercase tracking-wider">
              {t('footer.contact_us', 'تواصل معنا')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="select-text">
                {t('footer.info.address', 'الرياض، المملكة العربية السعودية')}
              </li>
              <li className="select-text">
                {t('footer.info.email', 'البريد: support@jnan-sa.com')}
              </li>
              <li className="select-text" dir="ltr">
                {isRtl ? 'الهاتف: +٩٦٦ ٥٠ ٠٠٠ ٠٠٠٠' : 'Phone: +966 50 000 0000'}
              </li>
              <li className="flex items-center gap-1 text-[10px] text-gold font-semibold pt-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{t('footer.info.tax', 'متجر موثق برقم ضريبي')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Block */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-start select-text">
            © {new Date().getFullYear()}{' '}
            {t('footer.copyright', 'متجر جنان (Jnan Store). جميع الحقوق محفوظة.')}
          </p>

          {/* Payment Methods */}
          <div className="flex items-center space-x-2 space-x-reverse select-none">
            <span className="text-[10px] text-muted-foreground/80 font-semibold px-2 py-0.5 border border-border/40 rounded bg-muted/20">
              {t('footer.pay.mada', 'مدى')}
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-semibold px-2 py-0.5 border border-border/40 rounded bg-muted/20">
              Apple Pay
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-semibold px-2 py-0.5 border border-border/40 rounded bg-muted/20">
              {t('footer.pay.visa', 'فيزا')}
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-semibold px-2 py-0.5 border border-border/40 rounded bg-muted/20">
              {t('footer.pay.master', 'ماستركارد')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
