import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion';
import SectionTitle from '../components/SectionTitle';
import { toast } from 'react-hot-toast';

export const SupportPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error(
        isRtl ? 'يرجى إدخال الموضوع ونص الرسالة' : 'Subject and message body are required'
      );
      return;
    }

    setIsSubmitting(true);
    // Simulate support ticket creation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject('');
      setMessage('');
      toast.success(
        isRtl
          ? 'تم إرسال طلب الدعم بنجاح. سنرد عليك خلال ٢٤ ساعة'
          : 'Support ticket submitted. We will reply within 24 hours'
      );
    }, 500);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <SectionTitle
        title={t('dashboard.nav.support')}
        subtitle={
          isRtl
            ? 'تواصل مع فريق الدعم الفني لمتجر جنان أو تصفح الأسئلة الشائعة.'
            : 'Contact Jnan customer support or review answers to common questions.'
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info and form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick contact channels cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 flex items-center gap-3 text-right border-border/40 select-none">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-primary block">
                  {isRtl ? 'الاتصال المباشر' : 'Direct Phone Support'}
                </span>
                <span className="text-[11px] text-muted-foreground font-sans">+966 920000000</span>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3 text-right border-border/40 select-none">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-primary block">
                  {isRtl ? 'البريد الإلكتروني' : 'Email Support'}
                </span>
                <span className="text-[11px] text-muted-foreground font-sans">
                  support@jnan-store.com
                </span>
              </div>
            </Card>
          </div>

          {/* Message ticket form */}
          <Card className="p-5 border-border/40 shadow-sm">
            <h3 className="font-bold text-sm text-primary mb-4 border-b border-border/10 pb-2 select-none text-right">
              {isRtl ? 'إرسال طلب دعم فني' : 'Submit Support Ticket'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 text-right">
                <label
                  htmlFor="subject"
                  className="text-xs font-bold text-muted-foreground select-none"
                >
                  {isRtl ? 'الموضوع' : 'Subject'}
                </label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={isRtl ? 'موضوع التذكرة' : 'Ticket subject'}
                  className="text-right"
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label
                  htmlFor="message"
                  className="text-xs font-bold text-muted-foreground select-none"
                >
                  {isRtl ? 'نص الرسالة / المشكلة' : 'Message Details'}
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isRtl ? 'اشرح المشكلة بالتفصيل...' : 'Describe your issue in detail...'
                  }
                  rows={4}
                  className="text-right resize-none"
                />
              </div>

              <div className="flex justify-end select-none">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs font-bold px-6 bg-primary hover:bg-primary/95 text-primary-foreground transition-all gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>
                    {isSubmitting
                      ? isRtl
                        ? 'جاري الإرسال...'
                        : 'Sending...'
                      : isRtl
                        ? 'إرسال الطلب'
                        : 'Submit'}
                  </span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* FAQs */}
        <Card className="p-5 border-border/40 shadow-sm flex flex-col h-fit">
          <h3 className="font-bold text-sm text-primary mb-4 border-b border-border/10 pb-2 select-none text-right">
            {isRtl ? 'الأسئلة الشائعة' : 'FAQs'}
          </h3>

          <Accordion className="w-full text-right">
            <AccordionItem value="faq-1">
              <AccordionTrigger>
                {isRtl ? 'كيف أقوم بتتبع شحنتي؟' : 'How do I track my order?'}
              </AccordionTrigger>
              <AccordionContent>
                {isRtl
                  ? 'يمكنك تتبع حالة الشحنة مباشرة من قسم "طلباتي" في لوحة التحكم، حيث ستجد رقم التتبع الخاص بالشركة الشاحنة فور تسليمها.'
                  : 'You can monitor shipment tracking numbers directly under the "Orders" panel once the package is handed to the shipping courier.'}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger>
                {isRtl ? 'ما هي خيارات الدفع المتاحة؟' : 'What payment options exist?'}
              </AccordionTrigger>
              <AccordionContent>
                {isRtl
                  ? 'ندعم حالياً الدفع عن طريق بطاقات مدى البنكية، البطاقات الائتمانية (فيزا/ماستركارد)، Apple Pay، بالإضافة إلى خيار الدفع عند الاستلام.'
                  : 'We accept Mada debit cards, standard Credit Cards (Visa/Mastercard), Apple Pay, and Cash on Delivery (COD).'}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger>
                {isRtl ? 'هل يمكنني إلغاء الطلب؟' : 'Can I cancel my order?'}
              </AccordionTrigger>
              <AccordionContent>
                {isRtl
                  ? 'نعم، يمكنك إلغاء طلبك طالما كانت حالته "معلق" أو "قيد التجهيز" ولم يتم تسليمه لشركة الشحن بعد. يرجى الاتصال بنا فوراً للإلغاء.'
                  : 'Yes, orders can be cancelled as long as their status is "Pending" or "Processing" and have not been handed to the carrier. Contact support immediately.'}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
