import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, List, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ExtendedProductFilters } from '@/hooks/useProductFilters';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropdownMenu';
import Input from '@/components/ui/Input';

interface ShopToolbarProps {
  filters: ExtendedProductFilters;
  totalItems: number;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  onMobileFilterOpen: () => void;
}

export const ShopToolbar: React.FC<ShopToolbarProps> = ({
  filters,
  totalItems,
  onSearchChange,
  onSortChange,
  onViewChange,
  onMobileFilterOpen,
}) => {
  const { t } = useTranslation();

  // Local state to keep typing smooth and responsive
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Trigger search update when debounce resolves
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  // Synchronize local input state with external filters changes (e.g. filter resets)
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Map sort keys to localized strings
  const getSortLabel = (sortKey: string) => {
    switch (sortKey) {
      case 'price_asc':
        return t('shop.sort_price_asc', { defaultValue: 'السعر: من الأقل إلى الأعلى' });
      case 'price_desc':
        return t('shop.sort_price_desc', { defaultValue: 'السعر: من الأعلى إلى الأقل' });
      case 'rating_desc':
        return t('shop.sort_rating_desc', { defaultValue: 'الأعلى تقييماً' });
      case 'newest':
        return t('shop.sort_newest', { defaultValue: 'الأحدث' });
      case 'featured':
      default:
        return t('shop.sort_featured', { defaultValue: 'المنتجات المميزة' });
    }
  };

  const sortOptions = ['featured', 'price_asc', 'price_desc', 'rating_desc', 'newest'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card border border-border/40 p-4 rounded-2xl shadow-xs font-tajawal select-none w-full">
      {/* Search Input Box */}
      <div className="relative w-full sm:max-w-xs md:max-w-sm">
        <label htmlFor="search-input" className="sr-only">
          {t('common.search', { defaultValue: 'بحث...' })}
        </label>
        <Input
          id="search-input"
          type="text"
          placeholder={t('common.search', { defaultValue: 'بحث...' })}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pe-10 text-xs text-right border-border/50 rounded-xl bg-muted/20"
        />
        <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        {/* Mobile Filter Button */}
        <button
          onClick={onMobileFilterOpen}
          className="flex lg:hidden h-10 px-4 items-center gap-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all duration-200"
          aria-label={t('shop.filter_title', { defaultValue: 'تصفية المنتجات' })}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>{t('shop.filter_title', { defaultValue: 'تصفية' })}</span>
        </button>

        {/* Total Count Status */}
        <div className="hidden md:flex text-xs font-medium text-muted-foreground mr-2 font-tajawal">
          {t('shop.items_found', {
            count: totalItems,
            defaultValue: `تم العثور على ${totalItems} منتج`,
          })}
        </div>

        {/* View Grid vs List switch */}
        <div className="flex items-center gap-1.5 border border-border/50 bg-muted/40 p-1 rounded-xl">
          <button
            onClick={() => onViewChange('grid')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              filters.view === 'grid'
                ? 'bg-background text-primary shadow-xs border border-border/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label={t('shop.view_grid', { defaultValue: 'عرض شبكي' })}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              filters.view === 'list'
                ? 'bg-background text-primary shadow-xs border border-border/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label={t('shop.view_list', { defaultValue: 'عرض قائمة' })}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Sorting Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              className="inline-flex h-10 items-center justify-between gap-2.5 rounded-xl border bg-background px-4 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-w-[160px]"
              aria-label={t('shop.sort_title', { defaultValue: 'ترتيب حسب' })}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
              <span className="truncate">{getSortLabel(filters.sort)}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px] rounded-xl border-border/40 p-1 bg-card shadow-lg select-none text-right">
            {sortOptions.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => onSortChange(opt)}
                className={`text-right text-xs px-3 py-2 rounded-lg font-tajawal font-medium transition-colors ${
                  filters.sort === opt
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {getSortLabel(opt)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ShopToolbar;
