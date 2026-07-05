import React from 'react';
import { useTranslation } from 'react-i18next';
import { PackageSearch, X, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  hasSearch: boolean;
  hasFilters: boolean;
  onClearSearch: () => void;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearch,
  hasFilters,
  onClearSearch,
  onResetFilters,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 border border-dashed border-border/50 rounded-2xl bg-card/40 backdrop-blur-xs w-full select-none font-tajawal">
      {/* Search Icon Container with glow effect */}
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-5 shadow-xs border border-gold/15 animate-bounce-slow">
        <PackageSearch className="h-8 w-8" />
        <div className="absolute inset-0 rounded-full bg-gold/5 blur-xs animate-ping opacity-60" />
      </div>

      {/* Heading & Subtitle */}
      <h3 className="text-lg font-bold text-primary mb-2">
        {t('shop.empty_state_title', { defaultValue: 'لم يتم العثور على منتجات' })}
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {t('shop.empty_state_desc', {
          defaultValue: 'جرّب تعديل خيارات التصفية أو البحث للعثور على ما تبحث عنه.',
        })}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-xs">
        {hasSearch && (
          <Button
            onClick={onClearSearch}
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-1.5 h-9 text-xs border-border/60 hover:bg-muted font-bold transition-all"
          >
            <X className="h-3.5 w-3.5" />
            <span>{t('shop.clear_search', { defaultValue: 'مسح البحث' })}</span>
          </Button>
        )}

        {hasFilters && (
          <Button
            onClick={onResetFilters}
            variant="gold"
            size="sm"
            className="w-full flex items-center justify-center gap-1.5 h-9 text-xs font-bold shadow-xs hover:opacity-95 transition-opacity"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t('shop.clear_filters', { defaultValue: 'إعادة تعيين الفلاتر' })}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
