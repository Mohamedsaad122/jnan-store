import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MousePointerClick, Star, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Button from '@/components/ui/Button';
import { useLanguageStore } from '@/store/language.store';

export const Hero: React.FC = () => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const slowFloatVariants = {
    animate: {
      y: [0, -6, 0],
      x: [0, 4, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative overflow-hidden w-full bg-radial from-background via-background to-gold-light/10 dark:to-primary/5 py-12 md:py-20 lg:py-24 select-none">
      {/* Visual Organic Glow Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
        >
          {/* Right Text Column (RTL) / Left (LTR) */}
          <div className="col-span-1 md:col-span-7 space-y-6 text-right md:pr-4 flex flex-col items-end order-2 md:order-1">
            {/* Elegant Saudi Brand Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 bg-gold-light/20 text-gold-foreground font-semibold text-[10px] md:text-xs tracking-wider"
            >
              <Star className="h-3 w-3 fill-gold" />
              <span>الأصالة تلتقي بالفخامة السعودية</span>
            </motion.div>

            {/* Huge Headline Title */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary dark:text-gold leading-[1.25] font-tajawal select-text"
            >
              مذاقٌ يأسر الحواس، <br />
              <span className="bg-gradient-to-l from-gold to-primary dark:from-gold-light dark:to-gold bg-clip-text text-transparent">
                ونقاءٌ يرتقي لمناسباتكم
              </span>
            </motion.h1>

            {/* Subtitle description */}
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed select-text"
            >
              اخترنا لكم بعناية فائقة أجود أنواع القهوة السعودية الفاخرة، المكسرات المحمصة الطازجة، والحلويات والهدايا المصممة خصيصاً لتليق بضيافتكم الراقية.
            </motion.p>

            {/* Calls To Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link to={ROUTES.SHOP}>
                <Button
                  variant="gold"
                  size="lg"
                  className="flex items-center gap-2 shadow-lg shadow-gold/20 font-bold"
                >
                  <span>تسوق المجموعة الكاملة</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </Link>
              <Link to={ROUTES.ABOUT}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gold/30 hover:border-gold/60 text-primary dark:text-gold font-bold"
                >
                  قصتنا وأصالتنا
                </Button>
              </Link>
            </motion.div>

            {/* Mini Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 pt-6 border-t w-full max-w-md border-border/40"
            >
              <div className="flex items-center gap-2 justify-end text-xs text-muted-foreground font-medium">
                <span>توصيل سريع لكافة المناطق</span>
                <ShieldCheck className="h-4 w-4 text-gold" />
              </div>
              <div className="flex items-center gap-2 justify-end text-xs text-muted-foreground font-medium">
                <span>جودة فاخرة مضمونة ١٠٠٪</span>
                <Heart className="h-4 w-4 text-gold fill-gold/10" />
              </div>
            </motion.div>
          </div>

          {/* Left Decorative Image Showcase Column (RTL) / Right (LTR) */}
          <div className="col-span-1 md:col-span-5 relative flex items-center justify-center order-1 md:order-2">
            {/* Background geometric gold frames */}
            <div className="absolute inset-0 border border-gold/10 rounded-3xl rotate-6 scale-95 pointer-events-none" />
            <div className="absolute inset-0 border border-gold/5 rounded-3xl -rotate-3 scale-100 pointer-events-none" />

            {/* Main Showcase Panel Card */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-2xl border bg-card/65 backdrop-blur-md shadow-2xl p-8 max-w-[320px] md:max-w-xs aspect-square flex flex-col justify-between items-center z-10 border-gold/20 overflow-hidden"
            >
              {/* Decorative radial overlay inside showcase */}
              <div className="absolute inset-0 bg-radial from-gold/10 to-transparent pointer-events-none" />

              <div className="text-center space-y-2 relative z-10">
                <span className="text-[10px] text-gold font-bold uppercase tracking-wider">الإصدار المحدود</span>
                <h3 className="font-bold text-lg text-primary font-tajawal">القهوة الهررية الفاخرة</h3>
              </div>

              {/* Showcase Coffee Dallah graphic */}
              <motion.div
                variants={floatVariants}
                animate="animate"
                className="w-32 h-32 my-4 bg-gradient-to-br from-gold/30 to-gold-light/10 rounded-full border border-gold/40 flex items-center justify-center relative shadow-lg"
              >
                <div className="absolute inset-2 border border-dashed border-gold/30 rounded-full" />
                <span className="text-3xl font-bold text-gold">🇸🇦</span>
              </motion.div>

              <div className="w-full text-center relative z-10">
                <p className="text-[10px] text-muted-foreground">خلطة الهيل والزعفران الطبيعي</p>
                <p className="font-bold text-sm text-gold mt-1">المنتج الأكثر طلباً</p>
              </div>
            </motion.div>

            {/* Floating Card Element 1: Cardamom Spec */}
            <motion.div
              variants={slowFloatVariants}
              animate="animate"
              className="absolute top-2 -right-6 z-20 rounded-lg border border-gold/20 bg-card p-3 shadow-md backdrop-blur-md flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <div className="h-2 w-2 rounded-full bg-cardamom animate-ping" />
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground leading-none">مكونات أصيلة</p>
                <p className="text-[10px] font-bold text-primary font-tajawal mt-1">هيل هندي نخب أول</p>
              </div>
            </motion.div>

            {/* Floating Card Element 2: Roast Spec */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="absolute bottom-6 -left-6 z-20 rounded-lg border border-gold/20 bg-card p-3 shadow-md backdrop-blur-md flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground leading-none">تعبئة فاخرة</p>
                <p className="text-[10px] font-bold text-primary font-tajawal mt-1">حبوب محمصة حديثاً</p>
              </div>
              <div className="h-6 w-6 rounded bg-gold-light/20 flex items-center justify-center text-gold">
                🔥
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full flex justify-center pt-16 md:pt-20 select-none pointer-events-none"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-tajawal text-muted-foreground font-semibold">اسحب للأسفل لاستكشاف المزيد</span>
            <MousePointerClick className="h-4 w-4 text-gold rotate-90" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
