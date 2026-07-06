import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EmptyAddressStateProps {
  onAddAddress: () => void;
}

export const EmptyAddressState: React.FC<EmptyAddressStateProps> = ({ onAddAddress }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl bg-card/10 font-tajawal select-none">
      <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4 border border-gold/15 animate-pulse">
        <MapPin className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-primary mb-1">
        {t('addresses.empty.title', 'لا يوجد عناوين مسجلة')}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-5 leading-relaxed">
        {t(
          'addresses.empty.description',
          'لم تقم بإضافة أي عناوين شحن حتى الآن. يرجى إضافة عنوان لتسريع عملية الشراء والتوصيل.'
        )}
      </p>
      <Button
        onClick={onAddAddress}
        size="sm"
        className="text-xs font-bold gap-1 bg-primary text-primary-foreground"
      >
        <Plus className="h-4 w-4" />
        <span>{t('addresses.add_first', 'إضافة عنوانك الأول')}</span>
      </Button>
    </div>
  );
};

export default EmptyAddressState;
