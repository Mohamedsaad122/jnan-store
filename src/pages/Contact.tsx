import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toast } from 'react-hot-toast';

// Dynamic localization validator schema generator
const getContactSchema = (isRtl: boolean) =>
  z.object({
    name: z.string().min(3, {
      message: isRtl ? 'الاسم يجب أن يكون ٣ أحرف على الأقل' : 'Name must be at least 3 characters',
    }),
    email: z.string().email({
      message: isRtl ? 'البريد الإلكتروني غير صالح' : 'Please enter a valid email address',
    }),
    subject: z.string().min(5, {
      message: isRtl
        ? 'الموضوع يجب أن يكون ٥ أحرف على الأقل'
        : 'Subject must be at least 5 characters',
    }),
    message: z.string().min(10, {
      message: isRtl
        ? 'الرسالة يجب أن تكون ١٠ أحرف على الأقل'
        : 'Message must be at least 10 characters',
    }),
  });

type ContactFormData = z.infer<ReturnType<typeof getContactSchema>>;

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactSchema = getContactSchema(isRtl);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log('Submitting contact data:', data);
    setIsSubmitting(true);
    setIsSubmitSuccess(false);
    setIsSubmitError(false);

    try {
      // Simulate form submission latency
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 95% success rate simulation
          if (Math.random() > 0.05) {
            resolve(true);
          } else {
            reject(new Error('Network error'));
          }
        }, 1500);
      });

      setIsSubmitSuccess(true);
      toast.success(
        isRtl
          ? 'تم إرسال رسالتك بنجاح! وسنتواصل معك قريباً.'
          : 'Your message has been sent successfully!'
      );
      reset();
    } catch {
      setIsSubmitError(true);
      toast.error(
        isRtl
          ? 'فشل إرسال الرسالة، يرجى إعادة المحاولة.'
          : 'Failed to send message, please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { label: t('nav.home', { defaultValue: 'الرئيسية' }), path: '/' },
    { label: t('nav.contact', { defaultValue: 'اتصل بنا' }) },
  ];

  return (
    <div
      className="min-h-screen bg-background pb-16 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>
          {isRtl ? 'اتصل بنا | متجر جنان للقهوة والمكسرات' : 'Contact Us | Jnan Premium Store'}
        </title>
        <meta
          name="description"
          content={
            isRtl
              ? 'تواصل معنا في متجر جنان. نحن هنا للإجابة على استفساراتك حول القهوة السعودية والمكسرات والتمور الفاخرة.'
              : 'Contact Jnan Store customer support. We are here to answer your questions about our premium Saudi coffee, nuts, and sweets.'
          }
        />
        <link rel="canonical" href="https://jnan-sa.com/contact" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content={
            isRtl
              ? 'اتصل بنا، تواصل معنا، خدمة العملاء، الرياض، متجر جنان'
              : 'contact us, customer service, support, riyadh, jnan store'
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jnan-sa.com/contact" />
        <meta
          property="og:title"
          content={isRtl ? 'اتصل بنا | متجر جنان' : 'Contact Us | Jnan Store'}
        />
        <meta
          property="og:description"
          content={
            isRtl ? 'تواصل مع فريق الدعم الفني لمتجر جنان' : 'Reach out to Jnan Store support team'
          }
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={isRtl ? 'اتصل بنا | متجر جنان' : 'Contact Us | Jnan Store'}
        />
      </Helmet>

      {/* Decorative Hero Breadcrumbs Header Banner */}
      <section className="relative overflow-hidden bg-cream/15 dark:bg-card/5 border-b border-border/30 py-8 select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-gold/5 dark:bg-gold/[0.02] rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative flex flex-col justify-center items-start text-right">
          <Breadcrumb items={breadcrumbItems} isRtl={isRtl} />
          <h1 className="text-3xl font-extrabold text-primary dark:text-gold tracking-tight mt-2 font-tajawal">
            {t('contact.title', { defaultValue: 'اتصل بنا' })}
          </h1>
          <div className="mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact details & cards column (5 cols on large screen) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-right">
              <h2 className="text-2xl font-extrabold text-primary dark:text-gold font-tajawal">
                {isRtl ? 'يسعدنا تواصلك معنا' : 'We are delighted to hear from you'}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-light font-tajawal">
                {isRtl
                  ? 'إذا كان لديك أي استفسار، اقتراح أو شكوى، يسعدنا تواصلك معنا عبر قنوات الاتصال المتاحة، وسيقوم فريقنا بالرد عليك بأسرع وقت.'
                  : 'If you have any questions, suggestions, or complaints, please feel free to reach out. Our team will respond as soon as possible.'}
              </p>
            </div>

            {/* Quick cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Card */}
              <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-xs hover:border-gold/30 transition-theme group flex flex-col items-start text-right">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform duration-300">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-primary dark:text-gold mt-4 font-tajawal">
                  {isRtl ? 'رقم الهاتف' : 'Phone'}
                </h3>
                <a
                  href="tel:+966500000000"
                  className="text-xs text-muted-foreground hover:text-gold transition-colors font-sans mt-2 cursor-pointer font-medium"
                >
                  +966 50 000 0000
                </a>
              </div>

              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-xs hover:border-gold/30 transition-theme group flex flex-col items-start text-right">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-primary dark:text-gold mt-4 font-tajawal">
                  {isRtl ? 'البريد الإلكتروني' : 'Email'}
                </h3>
                <a
                  href="mailto:support@jnan-sa.com"
                  className="text-xs text-muted-foreground hover:text-gold transition-colors font-sans mt-2 cursor-pointer font-medium"
                >
                  support@jnan-sa.com
                </a>
              </div>

              {/* Hours Card */}
              <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-xs hover:border-gold/30 transition-theme group flex flex-col items-start text-right sm:col-span-2">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform duration-300">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-primary dark:text-gold mt-4 font-tajawal">
                  {isRtl ? 'ساعات العمل' : 'Working Hours'}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 font-medium font-tajawal">
                  {isRtl
                    ? 'من السبت إلى الخميس: ٩:٠٠ ص - ١٠:٠٠ م | الجمعة: ٤:٠٠ م - ١٠:٠٠ م'
                    : 'Sat - Thu: 9:00 AM - 10:00 PM | Friday: 4:00 PM - 10:00 PM'}
                </p>
              </div>

              {/* Address Card */}
              <div className="p-5 rounded-2xl bg-card border border-border/40 shadow-xs hover:border-gold/30 transition-theme group flex flex-col items-start text-right sm:col-span-2">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform duration-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-primary dark:text-gold mt-4 font-tajawal">
                  {isRtl ? 'العنوان' : 'Store Location'}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 font-medium font-tajawal">
                  {isRtl
                    ? 'شارع التخصصي، حي المعذر، الرياض، المملكة العربية السعودية'
                    : 'Takhassusi St, Al Maather, Riyadh, Saudi Arabia'}
                </p>
              </div>
            </div>

            {/* Google Maps placeholder with glass styling */}
            <div className="relative h-48 rounded-2xl overflow-hidden border border-border/40 shadow-xs group">
              <div className="absolute inset-0 bg-cream/40 dark:bg-card/25 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center select-none">
                <MapPin className="h-8 w-8 text-gold animate-bounce mb-3" />
                <span className="text-xs font-bold text-primary dark:text-gold mb-1 font-tajawal">
                  {isRtl ? 'موقع معرضنا التفاعلي' : 'Our Showroom Interactive Map'}
                </span>
                <span className="text-[10px] text-muted-foreground mb-3 font-light font-tajawal">
                  {isRtl
                    ? 'اضغط لعرض الاتجاهات على خرائط Google'
                    : 'Click to view direction route on Google Maps'}
                </span>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-7.5 items-center justify-center px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-[10px] font-bold shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-gold font-tajawal"
                >
                  {isRtl ? 'فتح الخريطة' : 'Open Map'}
                </a>
              </div>
            </div>
          </div>

          {/* Contact form column (7 cols on large screen) */}
          <div className="lg:col-span-7 bg-card border border-border/40 shadow-xs rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-primary dark:text-gold mb-5 border-b pb-3 text-right font-tajawal">
              {isRtl ? 'أرسل لنا رسالة مباشرة' : 'Send a Message Directly'}
            </h3>

            {/* Status alerts */}
            {isSubmitSuccess && (
              <div className="mb-6 p-4 border border-green-500/20 bg-green-500/5 rounded-xl flex items-start gap-3 text-right">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 font-tajawal">
                    {isRtl ? 'تم الإرسال بنجاح!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 font-tajawal">
                    {isRtl
                      ? 'شكراً لك، رسالتك في أيدٍ أمينة وسنتواصل معك خلال ٢٤ ساعة عمل.'
                      : 'Thank you! Your query has been logged. We will contact you within 24 working hours.'}
                  </p>
                </div>
              </div>
            )}

            {isSubmitError && (
              <div className="mb-6 p-4 border border-destructive/20 bg-destructive/5 rounded-xl flex items-start gap-3 text-right">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-destructive font-tajawal">
                    {isRtl ? 'فشل إرسال الرسالة!' : 'Submission Failed!'}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 font-tajawal">
                    {isRtl
                      ? 'حدث خطأ في النظام أثناء محاولة معالجة رسالتك. يرجى مراجعة اتصال الشبكة والمحاولة مجدداً.'
                      : 'An error occurred during submission. Please verify your network and try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="name-input"
                  className="block text-xs font-bold text-muted-foreground mb-1.5 text-right font-tajawal"
                >
                  {isRtl ? 'الاسم الكامل' : 'Full Name'} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name-input"
                  type="text"
                  placeholder={isRtl ? 'مثال: محمد أحمد' : 'e.g. John Doe'}
                  className={`text-xs text-right h-10 rounded-xl ${errors.name ? 'border-destructive focus-visible:ring-destructive' : 'border-border/60'}`}
                  {...register('name')}
                />
                {errors.name && (
                  <span className="text-[10px] text-destructive mt-1 block font-medium">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="email-input"
                  className="block text-xs font-bold text-muted-foreground mb-1.5 text-right font-tajawal"
                >
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}{' '}
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder={isRtl ? 'مثال: email@domain.com' : 'e.g. email@domain.com'}
                  className={`text-xs text-right h-10 rounded-xl font-sans ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'border-border/60'}`}
                  {...register('email')}
                />
                {errors.email && (
                  <span className="text-[10px] text-destructive mt-1 block font-medium">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject-input"
                  className="block text-xs font-bold text-muted-foreground mb-1.5 text-right font-tajawal"
                >
                  {isRtl ? 'موضوع الرسالة' : 'Message Subject'}{' '}
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="subject-input"
                  type="text"
                  placeholder={isRtl ? 'مثال: استفسار عن الطلبات' : 'e.g. Inquiry about orders'}
                  className={`text-xs text-right h-10 rounded-xl ${errors.subject ? 'border-destructive focus-visible:ring-destructive' : 'border-border/60'}`}
                  {...register('subject')}
                />
                {errors.subject && (
                  <span className="text-[10px] text-destructive mt-1 block font-medium">
                    {errors.subject.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="message-input"
                  className="block text-xs font-bold text-muted-foreground mb-1.5 text-right font-tajawal"
                >
                  {isRtl ? 'نص الرسالة' : 'Message Content'}{' '}
                  <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message-input"
                  rows={5}
                  placeholder={
                    isRtl ? 'اكتب رسالتك بالتفصيل هنا...' : 'Type details of your message here...'
                  }
                  className={`w-full p-3 text-xs bg-muted/10 border text-right font-tajawal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl ${errors.message ? 'border-destructive focus-visible:ring-destructive' : 'border-border/60'}`}
                  {...register('message')}
                />
                {errors.message && (
                  <span className="text-[10px] text-destructive mt-1 block font-medium">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  isLoading={isSubmitting}
                  className="w-full text-xs font-bold h-10 rounded-xl flex items-center justify-center gap-2 font-tajawal"
                >
                  <Send className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  <span>{isRtl ? 'إرسال الرسالة' : 'Send Message'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
