import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { History, Sparkles, X, CornerDownLeft, AlertCircle, ShoppingBag } from 'lucide-react';
import { Command } from '@/components/ui/Command';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { Product } from '@/types/domain';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useLanguageStore } from '@/store/language.store';
import ROUTES from '@/constants/routes';
import { fuzzySort } from '@/utils/search';
import { searchAnalytics } from '@/utils/analytics';
import { toast } from 'react-hot-toast';

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'jnan_search_history';
const MAX_HISTORY = 6;
const POPULAR_SEARCHES = [
  'قهوة سعودية',
  'تمر خلاص',
  'هيل وزعفران',
  'مكسرات مشكلة',
  'شوكولاتة فاخرة',
];
const EMPTY_PRODUCTS: Product[] = [];

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isListening, setIsListening] = useState(false);

  // 1. Fetch products & categories
  const { data: allCategories = [] } = useCategories();
  const { data: productsResult, isLoading } = useProducts({ search: query });
  const productsList = productsResult?.data || EMPTY_PRODUCTS;

  // Load history and recently viewed products from local storage on mount
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(-1);
      try {
        const storedHistory = localStorage.getItem(STORAGE_KEY);
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);

        const storedViewed = localStorage.getItem('jnan_recently_viewed_products');
        setRecentlyViewed(storedViewed ? JSON.parse(storedViewed).slice(0, 3) : []);
      } catch (e) {
        console.error('Failed to load local storage values', e);
      }
    }
  }, [isOpen]);

  // Voice Search Recognition logic
  const startVoiceSearch = () => {
    searchAnalytics.trackVoiceSearchActivated();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = isRtl ? 'ar-SA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setQuery(resultText);
        setIsListening(false);
        toast.success(isRtl ? `البحث عن: "${resultText}"` : `Searching for: "${resultText}"`);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
        toast.error(
          isRtl
            ? 'عذراً، تعذر التعرف على الصوت. يرجى تجربة الكتابة.'
            : 'Sorry, voice capture failed. Please type.'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setIsListening(true);
      toast(
        isRtl
          ? 'جاري الاستماع... (المتصفح لا يدعم التسجيل الفعلي)'
          : 'Listening... (Microphone simulated)'
      );
      setTimeout(() => {
        setIsListening(false);
        setQuery(isRtl ? 'قهوة هرري' : 'Harari Coffee');
      }, 2000);
    }
  };

  // Filter categories matching query using fuzzySort
  const matchedCategories = React.useMemo(() => {
    if (!query.trim()) return [];
    return fuzzySort(allCategories, query, [
      (cat) => cat.nameAr,
      (cat) => cat.nameEn,
      (cat) => cat.slug,
    ]);
  }, [allCategories, query]);

  // Filter products matching query using fuzzySort
  const fuzzyMatchedProducts = React.useMemo(() => {
    if (!query.trim()) return [];
    return fuzzySort(productsList, query, [
      (p) => p.nameAr,
      (p) => p.nameEn,
      (p) => p.descriptionAr || '',
      (p) => p.descriptionEn || '',
      (p) => p.sku || '',
    ]);
  }, [productsList, query]);

  // Combine items for keyboard navigation index
  const navigationItems = React.useMemo(() => {
    const items: Array<{
      type: 'product' | 'category' | 'history' | 'popular';
      label: string;
      slug: string;
      id: string;
    }> = [];

    if (query.trim()) {
      matchedCategories.forEach((cat) => {
        items.push({
          type: 'category',
          label: isRtl ? cat.nameAr : cat.nameEn,
          slug: cat.slug,
          id: cat.id,
        });
      });
      fuzzyMatchedProducts.slice(0, 5).forEach((p: Product) => {
        items.push({
          type: 'product',
          label: isRtl ? p.nameAr : p.nameEn,
          slug: p.slug || p.id,
          id: p.id,
        });
      });
    } else {
      history.forEach((h, idx) => {
        items.push({
          type: 'history',
          label: h,
          slug: h,
          id: `hist-${idx}`,
        });
      });
      POPULAR_SEARCHES.forEach((p, idx) => {
        items.push({
          type: 'popular',
          label: p,
          slug: p,
          id: `pop-${idx}`,
        });
      });
    }
    return items;
  }, [query, matchedCategories, fuzzyMatchedProducts, history, isRtl]);

  // 2. Action Handlers
  const addQueryToHistory = (searchVal: string) => {
    if (!searchVal.trim()) return;
    const cleanVal = searchVal.trim();
    const updated = [cleanVal, ...history.filter((h) => h !== cleanVal)].slice(0, MAX_HISTORY);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = history.filter((h) => h !== item);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleItemSelect = (item: (typeof navigationItems)[0]) => {
    searchAnalytics.trackSearchResultClick(query, item.id, item.type);
    onClose();
    if (item.type === 'product') {
      navigate(`/shop/${item.slug}`);
    } else if (item.type === 'category') {
      navigate(`/shop?category=${item.slug}`);
    } else {
      // For history or popular keyword, run full search
      addQueryToHistory(item.label);
      navigate(`/shop?search=${encodeURIComponent(item.label)}`);
    }
  };

  const handleSearchSubmit = () => {
    if (!query.trim()) return;
    addQueryToHistory(query);
    searchAnalytics.trackSearchQuery(query, matchedCategories.length + fuzzyMatchedProducts.length);
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  // 3. Keyboard Event Handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < navigationItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : navigationItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < navigationItems.length) {
        handleItemSelect(navigationItems[activeIndex]);
      } else {
        handleSearchSubmit();
      }
    }
  };

  // Highlight helper
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-gold/20 text-gold font-bold rounded-xs px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <Command
      isOpen={isOpen}
      onClose={onClose}
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setActiveIndex(-1);
      }}
      onKeyDown={handleKeyDown}
      placeholder={t('search.placeholder', {
        defaultValue: 'البحث عن المنتجات، القهوة، المكسرات...',
      })}
      onVoiceClick={startVoiceSearch}
      isListening={isListening}
    >
      <div className="font-tajawal text-right py-1.5" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Suggestion / History Listings */}
        {query.trim() === '' ? (
          <div className="space-y-4">
            {/* Search History */}
            {history.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2 text-xs font-bold text-muted-foreground select-none">
                  <span>{isRtl ? 'عمليات البحث الأخيرة' : 'Recent Searches'}</span>
                  <button
                    onClick={clearAllHistory}
                    className="hover:text-destructive transition-colors text-[10px] cursor-pointer"
                  >
                    {isRtl ? 'مسح الكل' : 'Clear All'}
                  </button>
                </div>
                <div className="flex flex-col">
                  {history.map((h, idx) => {
                    const isFocused = idx === activeIndex;
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          handleItemSelect({ type: 'history', label: h, slug: h, id: `h-${idx}` })
                        }
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                          isFocused ? 'bg-gold/10 text-gold' : 'hover:bg-muted/30 text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <History className="h-3.5 w-3.5 opacity-60 text-muted-foreground" />
                          <span>{h}</span>
                        </span>
                        <button
                          onClick={(e) => removeHistoryItem(e, h)}
                          className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label="حذف من السجل"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="space-y-2 select-none">
              <div className="px-2 text-xs font-bold text-muted-foreground">
                {isRtl ? 'البحث الشائع' : 'Popular Searches'}
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {POPULAR_SEARCHES.map((pop, idx) => {
                  const relativeIdx = history.length + idx;
                  const isFocused = relativeIdx === activeIndex;
                  return (
                    <button
                      key={pop}
                      onClick={() =>
                        handleItemSelect({ type: 'popular', label: pop, slug: pop, id: `p-${idx}` })
                      }
                      onMouseEnter={() => setActiveIndex(relativeIdx)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
                        isFocused
                          ? 'border-gold bg-gold/10 text-gold scale-105 shadow-xs'
                          : 'border-border/60 text-muted-foreground hover:border-gold/30 hover:text-gold'
                      }`}
                    >
                      <Sparkles className="h-3 w-3 text-gold" />
                      <span>{pop}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recently Viewed Products Grid */}
            {recentlyViewed.length > 0 && (
              <div className="space-y-2 mt-4 select-none">
                <div className="px-2 text-xs font-bold text-muted-foreground">
                  {isRtl ? 'منتجات تصفحتها مؤخراً' : 'Recently Viewed'}
                </div>
                <div className="grid grid-cols-3 gap-2 px-2">
                  {recentlyViewed.map((p) => (
                    <div
                      key={p.id}
                      onClick={() =>
                        handleItemSelect({
                          type: 'product',
                          label: isRtl ? p.nameAr : p.nameEn,
                          slug: p.slug || p.id,
                          id: p.id,
                        })
                      }
                      className="group border border-border/40 hover:border-gold/30 rounded-xl p-1.5 bg-card hover:bg-gold/5 flex flex-col items-center text-center cursor-pointer transition-all"
                    >
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted/20 relative">
                        <OptimizedImage
                          src={p.images[0]?.url}
                          alt={isRtl ? p.nameAr : p.nameEn}
                          aspectRatioClassName="w-full h-full"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-primary dark:text-foreground line-clamp-1 mt-1 font-tajawal">
                        {isRtl ? p.nameAr : p.nameEn}
                      </span>
                      <span className="text-[9px] text-gold font-sans font-bold">
                        {p.salePrice || p.price} ر.س
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="p-4 space-y-2 select-none">
                <div className="h-4 w-2/3 bg-muted/30 rounded-sm animate-pulse" />
                <div className="h-4 w-1/2 bg-muted/30 rounded-sm animate-pulse" />
                <div className="h-4 w-3/4 bg-muted/30 rounded-sm animate-pulse" />
              </div>
            ) : matchedCategories.length === 0 && fuzzyMatchedProducts.length === 0 ? (
              /* Smart Empty Search States */
              <div className="p-8 text-center flex flex-col items-center justify-center select-none animate-fade-in">
                <AlertCircle className="h-8 w-8 text-gold mb-3 opacity-80" />
                <span className="text-sm font-bold text-primary dark:text-gold mb-1">
                  {isRtl ? 'عذراً، لم نجد أي نتائج!' : 'No results found!'}
                </span>
                <span className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-6">
                  {isRtl
                    ? 'جرب البحث بكلمات أخرى أو اختر أحد تصنيفاتنا المميزة لبدء التسوق.'
                    : 'Try checking your spelling, or navigate to our store collections.'}
                </span>

                {/* Suggestions triggers */}
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setQuery('');
                      setActiveIndex(-1);
                    }}
                    className="w-full h-9 rounded-xl border border-border/60 hover:border-gold/40 text-xs font-bold text-muted-foreground hover:text-gold flex items-center justify-center gap-1.5 cursor-pointer bg-card transition-all"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'العودة للاقتراحات' : 'Back to suggestions'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate(ROUTES.SHOP);
                    }}
                    className="w-full h-9 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'زيارة المتجر كاملاً' : 'Visit Full Shop'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Category Results */}
                {matchedCategories.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 text-[10px] font-bold text-gold uppercase tracking-wider select-none">
                      {isRtl ? 'الأقسام المطابقة' : 'Matching Categories'}
                    </div>
                    {matchedCategories.map((cat, idx) => {
                      const isFocused = idx === activeIndex;
                      return (
                        <div
                          key={cat.id}
                          onClick={() =>
                            handleItemSelect({
                              type: 'category',
                              label: isRtl ? cat.nameAr : cat.nameEn,
                              slug: cat.slug,
                              id: cat.id,
                            })
                          }
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            isFocused ? 'bg-gold/10 text-gold' : 'hover:bg-muted/30 text-foreground'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 opacity-60 text-gold" />
                            <span>{highlightText(isRtl ? cat.nameAr : cat.nameEn, query)}</span>
                          </span>
                          {isFocused && (
                            <CornerDownLeft className="h-3 w-3 text-gold/70 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Product Results */}
                {fuzzyMatchedProducts.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 text-[10px] font-bold text-gold uppercase tracking-wider select-none">
                      {isRtl ? 'المنتجات المطابقة' : 'Matching Products'}
                    </div>
                    {fuzzyMatchedProducts.slice(0, 5).map((p: Product, idx: number) => {
                      const relativeIdx = matchedCategories.length + idx;
                      const isFocused = relativeIdx === activeIndex;
                      return (
                        <div
                          key={p.id}
                          onClick={() =>
                            handleItemSelect({
                              type: 'product',
                              label: isRtl ? p.nameAr : p.nameEn,
                              slug: p.slug || p.id,
                              id: p.id,
                            })
                          }
                          onMouseEnter={() => setActiveIndex(relativeIdx)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            isFocused ? 'bg-gold/10 text-gold' : 'hover:bg-muted/30 text-foreground'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <OptimizedImage
                              src={p.images[0]?.url}
                              alt={isRtl ? p.nameAr : p.nameEn}
                              aspectRatioClassName="h-8 w-8"
                              className="h-full w-full object-cover rounded-md border border-border/40"
                            />
                            <div className="flex flex-col text-right">
                              <span className="font-bold">
                                {highlightText(isRtl ? p.nameAr : p.nameEn, query)}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-sans">
                                {p.salePrice ? (
                                  <span className="flex gap-1 items-center">
                                    <span className="line-through text-muted-foreground/60">
                                      {p.price} ر.س
                                    </span>
                                    <span className="text-gold font-bold">{p.salePrice} ر.س</span>
                                  </span>
                                ) : (
                                  <span>{p.price} ر.س</span>
                                )}
                              </span>
                            </div>
                          </span>
                          {isFocused && (
                            <CornerDownLeft className="h-3 w-3 text-gold/70 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Command>
  );
};

export default AdvancedSearch;
