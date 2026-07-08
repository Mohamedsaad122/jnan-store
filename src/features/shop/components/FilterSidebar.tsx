import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, RotateCcw, Check } from 'lucide-react';
import { Category, Brand } from '@/types/domain';
import { ExtendedProductFilters } from '@/hooks/useProductFilters';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface FilterSidebarProps {
  filters: ExtendedProductFilters;
  categories: Category[];
  brands: Brand[];
  onToggleCategory: (category: string) => void;
  onToggleBrand: (brand: string) => void;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
  onRatingChange: (rating: number | null) => void;
  onDiscountChange: (discount: number | null) => void;
  onInStockChange: (inStock: boolean) => void;
  onFeaturedChange: (featured: boolean) => void;
  onBestSellerChange: (bestSeller: boolean) => void;
  onNewArrivalChange: (newArrival: boolean) => void;
  onToggleColor: (color: string) => void;
  onToggleSize: (size: string) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  brands,
  onToggleCategory,
  onToggleBrand,
  onPriceRangeChange,
  onRatingChange,
  onDiscountChange,
  onInStockChange,
  onFeaturedChange,
  onBestSellerChange,
  onNewArrivalChange,
  onToggleColor,
  onToggleSize,
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

    if (min !== null && min < 0) return;
    if (max !== null && max < 0) return;
    if (min !== null && max !== null && min > max) return;

    onPriceRangeChange(min, max);
  };

  const ratings = [5, 4, 3, 2];
  const discountOptions = [10, 20, 30, 50];

  const colorSwatches = [
    { name: 'gold', nameAr: 'ذهبي', hex: '#D4A359' },
    { name: 'brown', nameAr: 'بني', hex: '#8B5A2B' },
    { name: 'amber', nameAr: 'كهرماني', hex: '#FFBF00' },
    { name: 'bronze', nameAr: 'برونزي', hex: '#CD7F32' },
  ];

  const sizeOptions = [
    { value: '250g', label: '250g' },
    { value: '500g', label: '500g' },
    { value: '1kg', label: '1kg' },
    { value: 'small', label: 'صغير' },
    { value: 'medium', label: 'وسط' },
    { value: 'large', label: 'كبير' },
  ];

  return (
    <div className="flex flex-col gap-6 text-right w-full font-tajawal select-none">
      {/* Reset Options Row */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h2 className="text-sm font-black text-primary">
          {t('shop.filters_title', { defaultValue: 'الفلاتر والتصفية' })}
        </h2>
        <button
          onClick={onReset}
          className="text-[10px] font-bold text-destructive hover:text-destructive/85 flex items-center gap-1.5 cursor-pointer border-0 bg-transparent"
        >
          <RotateCcw className="h-3 w-3" />
          <span>{t('shop.clear_all', { defaultValue: 'مسح التصفية' })}</span>
        </button>
      </div>

      {/* Multi-Category Filter */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-xs font-black text-primary mb-3">
          {t('shop.filter_category', { defaultValue: 'الأقسام الرئيسية' })}
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const isChecked =
              filters.categories.includes(cat.slug) || filters.categories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onToggleCategory(cat.slug)}
                className="flex items-center justify-between w-full text-xs font-semibold py-1 hover:text-primary transition-colors text-right cursor-pointer"
              >
                <span className={isChecked ? 'text-gold font-black' : 'text-muted-foreground'}>
                  {t(`category.${cat.slug.replace('-', '_')}`, { defaultValue: cat.nameAr })}
                </span>
                <div
                  className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                    isChecked ? 'border-gold bg-gold text-card' : 'border-border/60 bg-transparent'
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Brand Filter */}
      {brands.length > 0 && (
        <div className="border-b border-border/40 pb-5">
          <h3 className="text-xs font-black text-primary mb-3">
            {t('shop.filter_brand', { defaultValue: 'العلامة التجارية' })}
          </h3>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => {
              const isChecked =
                filters.brands.includes(brand.slug) || filters.brands.includes(brand.id);
              return (
                <button
                  key={brand.id}
                  onClick={() => onToggleBrand(brand.id)}
                  className="flex items-center justify-between w-full text-xs font-semibold py-1 hover:text-primary transition-colors text-right cursor-pointer"
                >
                  <span className={isChecked ? 'text-gold font-black' : 'text-muted-foreground'}>
                    {brand.nameAr}
                  </span>
                  <div
                    className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                      isChecked
                        ? 'border-gold bg-gold text-card'
                        : 'border-border/60 bg-transparent'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-xs font-black text-primary mb-3">
          {t('shop.filter_price', { defaultValue: 'نطاق السعر (ر.س)' })}
        </h3>
        <form onSubmit={handlePriceApply} className="flex items-center gap-2" dir="ltr">
          <Button
            type="submit"
            className="h-8 px-3 rounded-lg text-[10px] font-bold bg-primary text-primary-foreground border-0 hover:bg-primary/95 cursor-pointer shrink-0"
          >
            {t('shop.apply', { defaultValue: 'تطبيق' })}
          </Button>
          <Input
            type="number"
            placeholder={t('shop.price_max', { defaultValue: 'أعلى' })}
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="h-8 text-center text-xs border-border/60 px-2 rounded-lg animate-fade-in"
          />
          <span className="text-muted-foreground text-xs font-sans">-</span>
          <Input
            type="number"
            placeholder={t('shop.price_min', { defaultValue: 'أدنى' })}
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="h-8 text-center text-xs border-border/60 px-2 rounded-lg animate-fade-in"
          />
        </form>
      </div>

      {/* Ratings Filter */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-xs font-black text-primary mb-3">
          {t('shop.filter_rating', { defaultValue: 'تقييم المنتج' })}
        </h3>
        <div className="flex flex-col gap-2">
          {ratings.map((rate) => {
            const isSelected = filters.rating === rate;
            return (
              <button
                key={rate}
                onClick={() => onRatingChange(isSelected ? null : rate)}
                className={`flex items-center justify-between w-full text-xs py-1 transition-all text-right cursor-pointer ${
                  isSelected ? 'font-bold text-gold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{t('shop.rating_up', { rate, defaultValue: 'وأعلى' })}</span>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <div className="flex items-center gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < rate ? 'fill-gold text-gold' : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-gold bg-gold text-card'
                        : 'border-border/60 bg-transparent'
                    }`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-card" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Discount Filters */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-xs font-black text-primary mb-3">
          {t('shop.filter_discount', { defaultValue: 'نسبة الخصم' })}
        </h3>
        <div className="flex flex-col gap-2">
          {discountOptions.map((disc) => {
            const isSelected = filters.discount === disc;
            return (
              <button
                key={disc}
                onClick={() => onDiscountChange(isSelected ? null : disc)}
                className={`flex items-center justify-between w-full text-xs py-1 transition-all text-right cursor-pointer ${
                  isSelected ? 'font-bold text-gold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>
                  {disc}% {t('shop.discount_up', { defaultValue: 'فأكثر' })}
                </span>
                <div
                  className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? 'border-gold bg-gold text-card' : 'border-border/60 bg-transparent'
                  }`}
                >
                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-card" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges Filters (Featured, Best Sellers, New Arrivals) */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-xs font-black text-primary mb-3">
          {t('shop.filter_collections', { defaultValue: 'مجموعات مخصصة' })}
        </h3>
        <div className="flex flex-col gap-3">
          {/* Featured */}
          <button
            onClick={() => onFeaturedChange(!filters.featured)}
            className="flex items-center justify-between w-full text-xs font-semibold hover:text-primary transition-colors text-right cursor-pointer"
          >
            <span className={filters.featured ? 'text-gold font-bold' : 'text-muted-foreground'}>
              {t('shop.collection_featured', { defaultValue: 'المنتجات المميزة' })}
            </span>
            <div
              className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                filters.featured
                  ? 'border-gold bg-gold text-card'
                  : 'border-border/60 bg-transparent'
              }`}
            >
              {filters.featured && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
          </button>

          {/* Best Seller */}
          <button
            onClick={() => onBestSellerChange(!filters.bestSeller)}
            className="flex items-center justify-between w-full text-xs font-semibold hover:text-primary transition-colors text-right cursor-pointer"
          >
            <span className={filters.bestSeller ? 'text-gold font-bold' : 'text-muted-foreground'}>
              {t('shop.collection_best_sellers', { defaultValue: 'الأكثر مبيعاً' })}
            </span>
            <div
              className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                filters.bestSeller
                  ? 'border-gold bg-gold text-card'
                  : 'border-border/60 bg-transparent'
              }`}
            >
              {filters.bestSeller && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
          </button>

          {/* New Arrivals */}
          <button
            onClick={() => onNewArrivalChange(!filters.newArrival)}
            className="flex items-center justify-between w-full text-xs font-semibold hover:text-primary transition-colors text-right cursor-pointer"
          >
            <span className={filters.newArrival ? 'text-gold font-bold' : 'text-muted-foreground'}>
              {t('shop.collection_new_arrivals', { defaultValue: 'وصلنا حديثاً' })}
            </span>
            <div
              className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                filters.newArrival
                  ? 'border-gold bg-gold text-card'
                  : 'border-border/60 bg-transparent'
              }`}
            >
              {filters.newArrival && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
          </button>

          {/* In Stock */}
          <button
            onClick={() => onInStockChange(!filters.inStock)}
            className="flex items-center justify-between w-full text-xs font-semibold hover:text-primary transition-colors text-right cursor-pointer"
          >
            <span className={filters.inStock ? 'text-gold font-bold' : 'text-muted-foreground'}>
              {t('shop.filter_instock', { defaultValue: 'المنتجات المتوفرة فقط' })}
            </span>
            <div
              className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                filters.inStock
                  ? 'border-gold bg-gold text-card'
                  : 'border-border/60 bg-transparent'
              }`}
            >
              {filters.inStock && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
          </button>
        </div>
      </div>

      {/* Color Filter (Future-Ready) */}
      <div className="border-b border-border/40 pb-5">
        <h3 className="text-xs font-black text-primary mb-3">
          {t('shop.filter_colors', { defaultValue: 'اللون (تجريبي)' })}
        </h3>
        <div className="flex flex-wrap gap-2.5 justify-end">
          {colorSwatches.map((color) => {
            const isSelected = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => onToggleColor(color.name)}
                className={`h-7 px-2.5 rounded-full border text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'border-gold bg-gold/10 text-gold font-black scale-105'
                    : 'border-border/50 text-muted-foreground hover:border-gold/30'
                }`}
                title={color.nameAr}
              >
                <div
                  className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.nameAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter (Future-Ready) */}
      <div>
        <h3 className="text-xs font-black text-primary mb-3">
          {t('shop.filter_sizes', { defaultValue: 'الحجم والوزن (تجريبي)' })}
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {sizeOptions.map((opt) => {
            const isSelected = filters.sizes.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => onToggleSize(opt.value)}
                className={`h-8 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'border-gold bg-gold text-card font-black scale-105 shadow-xs'
                    : 'border-border/50 bg-background text-muted-foreground hover:bg-muted/40'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
