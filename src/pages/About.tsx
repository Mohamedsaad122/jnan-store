import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const About: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const breadcrumbItems = [
    { label: t('nav.home', { defaultValue: 'الرئيسية' }), path: '/' },
    { label: t('nav.about', { defaultValue: 'من نحن' }) },
  ];

  return (
    <div
      className="min-h-screen bg-background pb-16 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>
          {isRtl ? 'من نحن | متجر جنان للضيافة السعودية' : 'About Us | Jnan Premium Hospitality'}
        </title>
        <meta
          name="description"
          content={
            isRtl
              ? 'تعرف على قصة متجر جنان ورسالتنا في تقديم أجود أنواع القهوة السعودية والتمور والمكسرات التي تعكس كرم الضيافة السعودية الأصيلة.'
              : 'Learn about Jnan Store story and our mission to provide the finest Saudi specialty coffee, dates, and nuts.'
          }
        />
        <link rel="canonical" href="https://jnan-sa.com/about" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content={
            isRtl
              ? 'من نحن، قصة جنان، القهوة السعودية، الضيافة العربية'
              : 'about us, our story, saudi hospitality, premium dates'
          }
        />
      </Helmet>

      {/* Hero Breadcrumbs Banner */}
      <section className="relative overflow-hidden bg-cream/15 dark:bg-card/5 border-b border-border/30 py-8 select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-gold/5 dark:bg-gold/[0.02] rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative flex flex-col justify-center items-start text-right">
          <Breadcrumb items={breadcrumbItems} isRtl={isRtl} />
          <h1 className="text-3xl font-extrabold text-primary dark:text-gold tracking-tight mt-2 font-tajawal">
            {t('nav.about', { defaultValue: 'من نحن' })}
          </h1>
          <div className="mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-6 py-12 space-y-16">
        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1 text-gold text-xs font-bold font-tajawal uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isRtl ? 'أصالة الضيافة السعودية' : 'Authentic Saudi Hospitality'}</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-gold font-tajawal">
              {isRtl ? 'قصة متجر جنان وعراقة الماضي' : 'Jnan Store Story & Heritage'}
            </h2>
            <div className="h-0.5 w-16 bg-gold/30 rounded-full" />
            <p className="text-sm text-muted-foreground leading-relaxed font-light font-tajawal">
              {isRtl
                ? 'تأسس متجر جنان بشغف كبير للحفاظ على إرث الضيافة السعودية الأصيلة ونقلها لكل بيت. نحن نؤمن بأن فنجان القهوة السعودية ليس مجرد مشروب، بل هو رمز للكرم والترحيب المتجذر في ثقافتنا التاريخية.'
                : 'Jnan Store was founded with a deep passion for preserving and promoting traditional Saudi hospitality. We believe that a cup of Saudi coffee is not just a hot drink, but an enduring symbol of generosity and welcome rooted in our rich history.'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-light font-tajawal">
              {isRtl
                ? 'لذلك، نقوم في جنان باختيار حبوب البن بعناية فائقة من أفضل مزارع البن الخولاني بجنوب المملكة والبن المختص العالمي، ونحمصها محلياً بأعلى المعايير، لنقدمها لك جنباً إلى جنب مع أفخر أنواع التمور المحشوة والمكسرات الطازجة.'
                : 'For this reason, we carefully source our coffee beans from the finest farms in the southern region of the Kingdom and roast them locally with premium parameters. We deliver them to your doorstep alongside premium stuffed dates and freshly roasted nuts.'}
            </p>
          </div>

          {/* Visual card placeholder */}
          <div className="lg:col-span-5 relative h-72 rounded-3xl overflow-hidden border border-border/40 shadow-md bg-gradient-to-tr from-primary/10 via-gold/5 to-cardamom/5 flex flex-col items-center justify-center text-center p-8 select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,89,0.1),transparent_70%)]" />
            <Award className="h-16 w-16 text-gold mb-4" />
            <h3 className="text-lg font-bold text-primary dark:text-gold font-tajawal mb-2">
              {isRtl ? 'جودة نفخر بها' : 'Quality We Pride Ourselves On'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed font-tajawal">
              {isRtl
                ? 'جميع منتجاتنا معبأة ومجهزة وفق أعلى معايير سلامة الأغذية وبشكل يعكس الهوية الثقافية للمملكة.'
                : 'All our products are packaged and prepared in accordance with the highest food safety standards representing the Saudi identity.'}
            </p>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-primary dark:text-gold font-tajawal">
              {isRtl ? 'القيم التي نرتكز عليها' : 'Our Core Values'}
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto font-tajawal">
              {isRtl
                ? 'نعمل في متجر جنان وفق مبادئ ثابتة تضمن تقديم تجربة استثنائية لجميع عملائنا.'
                : 'We operate in Jnan Store under unwavering principles ensuring an exceptional journey.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Value 1: Quality */}
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-xs hover:border-gold/30 transition-theme text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-primary dark:text-gold font-tajawal mb-2">
                {isRtl ? 'الجودة المطلقة' : 'Absolute Quality'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light font-tajawal">
                {isRtl
                  ? 'لا نساوم أبداً على الجودة. نختار المواد الخام بعناية فائقة ونحرص على نضارة كل منتج يصل إليك.'
                  : 'We never compromise on quality. We carefully inspect raw materials and maintain the fresh aroma of every item.'}
              </p>
            </div>

            {/* Value 2: Heritage */}
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-xs hover:border-gold/30 transition-theme text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-primary dark:text-gold font-tajawal mb-2">
                {isRtl ? 'الأصالة والعراقة' : 'Authenticity & Heritage'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light font-tajawal">
                {isRtl
                  ? 'نهتم بإبراز النكهات التقليدية والهوية السعودية الأصيلة في تفاصيل منتجاتنا وتغليفنا.'
                  : 'We strive to highlight traditional flavors and genuine Saudi identity in product details and packaging.'}
              </p>
            </div>

            {/* Value 3: Customer Love */}
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-xs hover:border-gold/30 transition-theme text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-primary dark:text-gold font-tajawal mb-2">
                {isRtl ? 'حب وعناية بالعميل' : 'Customer Care'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light font-tajawal">
                {isRtl
                  ? 'عملاؤنا هم عائلتنا. نسعى لتقديم خدمة عملاء ودية وسريعة تفوق التوقعات دائماً.'
                  : 'Our customers are our family. We strive to provide fast, helpful, and friendly support exceeding expectations.'}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
