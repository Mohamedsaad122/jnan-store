import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, RotateCcw, Check } from 'lucide-react';
import { Category } from '@/types/domain';
import { ExtendedProductFilters } from '@/hooks/useProductFilters';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface FilterSidebarProps {
  filters: ExtendedProductFilters;
  categories: Category[];
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
  onRatingChange: (rating: number | null) => void;
  onInStockChange: (inStock: boolean) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
  onInStockChange,
  onReset,
}) => {
  const { t } = useTranslation();

  // Local state for price inputs to prevent triggering network calls on every digit keystroke
  const [minPriceInput, setMinPriceInput] = useState<string>(
    filters.minPrice !== null ? String(filters.minPrice) : ''
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    filters.maxPrice !== null ? String(filters.maxPrice) : ''
  );

  // Keep input fields synchronized if external changes occur (like resetting filters)
  useEffect(() => {
    setMinPriceInput(filters.minPrice !== null ? String(filters.minPrice) : '');
    setMaxPriceInput(filters.maxPrice !== null ? String(filters.maxPrice) : '');
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minPriceInput.trim() !== '' ? Number(minPriceInput) : null;
    const max = maxPriceInput.trim() !== '' ? Number(maxPriceInput) : null;

    // Prevent negative pricing and invalid min/max ranges
    if (min !== null && min < 0) return;
    if (max !== null && max < 0) return;
    if (min !== null && max !== null && min > max) return;

    onPriceRangeChange(min, max);
  };

  const ratings = [5, 4, 3, 2];

  return (
    <div className="flex flex-col gap-6 text-right w-full font-tajawal">
      {/* Category Filter */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-sm font-bold text-primary mb-3">
          {t('shop.filter_category', { defaultValue: 'الأقسام' })}
        </h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onCategoryChange('all')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              filters.category === 'all'
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
            }`}
          >
            <span>{t('shop.all_categories', { defaultValue: 'كل الأقسام' })}</span>
          </button>

          {categories.map((cat) => {
            const isActive = filters.category === cat.id;
            // Translate categories based on local locale store
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                <span>
                  {t(`category.${cat.slug.replace('-', '_')}`, { defaultValue: cat.nameAr })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-sm font-bold text-primary mb-3">
          {t('shop.filter_price', { defaultValue: 'نطاق السعر' })}
        </h3>
        <form onSubmit={handlePriceApply} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1/2">
              <label htmlFor="min-price" className="sr-only">
                {t('shop.min_price', { defaultValue: 'الحد الأدنى' })}
              </label>
              <Input
                id="min-price"
                type="number"
                placeholder={t('shop.min_price', { defaultValue: 'الحد الأدنى' })}
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="h-9 text-xs px-2 text-right border-border/60 font-sans"
              />
            </div>
            <span className="text-muted-foreground text-xs font-light">-</span>
            <div className="w-1/2">
              <label htmlFor="max-price" className="sr-only">
                {t('shop.max_price', { defaultValue: 'الحد الأقصى' })}
              </label>
              <Input
                id="max-price"
                type="number"
                placeholder={t('shop.max_price', { defaultValue: 'الحد الأقصى' })}
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="h-9 text-xs px-2 text-right border-border/60 font-sans"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full text-xs h-8 border-gold/40 hover:border-gold/80 hover:bg-gold/5 text-gold font-bold transition-all duration-200"
          >
            {t('common.apply', { defaultValue: 'تطبيق' })}
          </Button>
        </form>
      </div>

      {/* Rating Filter */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-sm font-bold text-primary mb-3">
          {t('shop.filter_rating', { defaultValue: 'التقييم' })}
        </h3>
        <div className="flex flex-col gap-1">
          {ratings.map((rate) => {
            const isActive = filters.rating === rate;
            return (
              <button
                key={rate}
                onClick={() => onRatingChange(isActive ? null : rate)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 w-full text-right ${
                  isActive
                    ? 'bg-gold/10 text-gold font-bold'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rate ? 'fill-gold text-gold' : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span>
                  {t('shop.rating_stars', {
                    rating: rate,
                    defaultValue: `${rate} نجوم وأكثر`,
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Status Filter */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-sm font-bold text-primary mb-3">
          {t('shop.filter_stock', { defaultValue: 'حالة المخزون' })}
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative h-4.5 w-4.5 rounded border border-border/60 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors">
            <Check className="h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
          <span className="font-tajawal">
            {t('shop.filter_stock_in_only', { defaultValue: 'المتوفر في المخزن فقط' })}
          </span>
        </label>
      </div>

      {/* Clear Filters Button */}
      <Button
        onClick={onReset}
        variant="ghost"
        className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-bold transition-all duration-200 mt-2 h-9 border border-dashed border-border/60 rounded-xl"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>{t('shop.clear_filters', { defaultValue: 'إعادة تعيين الفلاتر' })}</span>
      </Button>
    </div>
  );
};

export default FilterSidebar;
