import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/language.store';
import { Globe } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();
  const [index, setIndex] = useState(0);

  const messages = [
    { ar: '🇸🇦 متجر سعودي أصيل وموثوق ١٠٠٪ في التمور والبهارات والقهوة', en: '🇸🇦 100% Trusted & Authentic Saudi Specialty Store' },
    { ar: '✨ شحن مجاني للطلبات فوق ٢٠٠ ر.س مباشرة لباب منزلك', en: '✨ Free shipping for orders above 200 SAR to your doorstep' },
    { ar: '⚡ عروض الموسم الحصرية! احصل على كود خصم إضافي: JNAN26', en: '⚡ Season Exclusives! Use extra promo code: JNAN26' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const isRtl = language === 'ar';

  return (
    <div className="w-full bg-primary text-primary-foreground h-9 px-4 flex items-center justify-between text-xs font-tajawal select-none border-b border-gold/10 relative z-50">
      {/* Balanced layout spacer for desktop */}
      <div className="hidden md:block w-24" />

      {/* Scrolling Text slider */}
      <div className="flex-grow flex justify-center overflow-hidden h-full relative items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: isRtl ? 12 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isRtl ? -12 : 12 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-[10px] md:text-xs font-medium tracking-wide text-center truncate px-2"
          >
            {isRtl ? messages[index].ar : messages[index].en}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Language Shortcut selector */}
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1 hover:text-gold transition-colors font-semibold text-[10px] md:text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold py-1 rounded"
        aria-label="تغيير اللغة"
      >
        <Globe className="h-3.5 w-3.5 opacity-80" />
        <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
      </button>
    </div>
  );
};

export default AnnouncementBar;
