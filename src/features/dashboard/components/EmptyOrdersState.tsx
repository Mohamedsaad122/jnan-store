import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import ROUTES from '@/constants/routes';

interface EmptyOrdersStateProps {
  isRtl: boolean;
}

export const EmptyOrdersState: React.FC<EmptyOrdersStateProps> = ({ isRtl }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl bg-card/10 font-tajawal select-none">
      <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4 border border-gold/15 animate-bounce">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-primary mb-1">
        {t('orders.empty.title', 'لم تقم بتقديم أي طلبات بعد')}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-5 leading-relaxed">
        {t(
          'orders.empty.description',
          'سجل طلباتك فارغ حالياً. تفضل بزيارة المتجر واستكشف تشكيلاتنا الفاخرة من التمور والقهوة.'
        )}
      </p>
      <Link to={ROUTES.SHOP}>
        <Button
          size="sm"
          className="text-xs font-bold gap-1 bg-primary text-primary-foreground focus-visible:ring-gold"
        >
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{t('orders.empty.action', 'تصفح المتجر الآن')}</span>
        </Button>
      </Link>
    </div>
  );
};

export default EmptyOrdersState;
