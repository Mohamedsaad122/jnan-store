import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Container } from '@/components/global/Container';

// Strict schema validation using Zod
type NewsletterFormData = {
  email: string;
};

export const Newsletter: React.FC = () => {
  const { t } = useTranslation();

  const newsletterSchema = React.useMemo(
    () =>
      z.object({
        email: z.string().email({
          message: t('newsletter.error.invalid', 'يرجى إدخال بريد إلكتروني صحيح / Please enter a valid email'),
        }),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      // Simulate newsletter api subscription call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Subscribed email:', data.email);

      toast.success(t('newsletter.success', 'تم الاشتراك في النشرة البريدية بنجاح!'));
      reset();
    } catch {
      toast.error(t('newsletter.error.generic', 'حدث خطأ ما، يرجى المحاولة لاحقاً.'));
    }
  };

  return (
    <section className="relative overflow-hidden w-full bg-primary py-12 md:py-16 text-primary-foreground select-none">
      {/* Decorative luxury organic background shapes */}
      <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cardamom/10 blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          {/* Section Icon Shield */}
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/20 shadow-inner mb-2">
            <Mail className="h-5.5 w-5.5" />
          </div>

          {/* Heading Title */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-tajawal text-gold">
            {t('newsletter.title', 'انضم لنشرتنا البريدية')}
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-primary-foreground/80 max-w-xl mx-auto leading-relaxed font-tajawal">
            {t(
              'newsletter.subtitle',
              'اشترك معنا لتصلك عروضنا الحصرية، وصفات القهوة الخاصة، وأحدث منتجاتنا قبل الجميع'
            )}
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-stretch sm:items-start pt-2"
            noValidate
          >
            <div className="flex-grow text-right">
              <Input
                type="email"
                placeholder={t('newsletter.placeholder', 'أدخل بريدك الإلكتروني...')}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                className="bg-primary-foreground text-primary placeholder:text-muted-foreground/75 font-tajawal focus-visible:ring-gold"
                {...register('email')}
                aria-label={t('newsletter.aria_input', 'البريد الإلكتروني للاشتراك')}
              />
            </div>
            <Button
              type="submit"
              variant="gold"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="font-bold shrink-0 font-tajawal text-sm h-10 px-6 shadow-md"
            >
              {t('newsletter.button', 'اشترك الآن')}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
