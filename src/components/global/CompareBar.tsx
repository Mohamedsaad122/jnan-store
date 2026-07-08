import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GitCompare, X, Trash2, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore } from '@/store/compare.store';
import { useProductsByIds } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/currency';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import { Product } from '@/types/domain';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { toast } from 'react-hot-toast';

export const CompareBar: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const { addToCart } = useCart();

  const { compareIds, removeFromCompare, clearCompare } = useCompareStore();
  const { data: products = [], isLoading } = useProductsByIds(compareIds);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // If no items selected, do not show bar
  if (compareIds.length === 0) return null;

  // Extract all specification keys dynamically across compared products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => (p.specifications ? Object.keys(p.specifications) : [])))
  );

  const handleAddToCart = (p: Product) => {
    const name = isRtl ? p.nameAr : p.nameEn;
    const hasDiscount = !!p.salePrice && p.salePrice < p.price;
    const currentPrice = hasDiscount ? p.salePrice! : p.price;

    addToCart({
      productId: p.id,
      name,
      price: currentPrice,
      imageUrl: p.images[0]?.url,
      quantity: 1,
    });
    toast.success(t('cart.added_success', { defaultValue: 'تم إضافة المنتج إلى سلتك بنجاح' }));
  };

  return (
    <>
      {/* Sticky Bottom Comparison Bar */}
      <div className="fixed bottom-[64px] md:bottom-0 left-0 right-0 z-40 bg-card border-t border-gold/15 shadow-xl select-none font-tajawal">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left / Info & Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={clearCompare}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer bg-transparent border-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isRtl ? 'مسح الكل' : 'Clear All'}</span>
            </button>

            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              className="h-9 px-5 rounded-xl text-xs font-bold bg-gold hover:bg-gold/90 text-[#121212] flex items-center gap-1.5 shadow-md border-0"
              disabled={products.length === 0}
            >
              <GitCompare className="h-4 w-4" />
              <span>
                {isRtl ? `قارن الآن (${products.length})` : `Compare Now (${products.length})`}
              </span>
            </Button>
          </div>

          {/* Right / Thumbnails Row */}
          <div
            className="flex items-center gap-3 overflow-x-auto w-full md:w-auto py-1 justify-end scrollbar-none"
            dir="rtl"
          >
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-muted-foreground ml-3 shrink-0">
              <GitCompare className="h-4 w-4 text-gold" />
              <span>{isRtl ? 'مقارنة المنتجات (حد أقصى ٤)' : 'Product Compare (Max 4)'}</span>
            </div>

            {compareIds.map((id) => {
              const product = products.find((p) => p.id === id);
              return (
                <div
                  key={id}
                  className="relative aspect-square w-12 rounded-lg border border-border bg-muted/20 shrink-0 group flex items-center justify-center"
                >
                  {isLoading || !product ? (
                    <div className="h-4 w-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <OptimizedImage
                        src={product.images[0]?.url}
                        alt={isRtl ? product.nameAr : product.nameEn}
                        aspectRatioClassName="w-full h-full"
                        className="h-full w-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFromCompare(id)}
                        className="absolute -top-1.5 -left-1.5 p-0.5 rounded-full bg-destructive text-white border border-card shadow-xs cursor-pointer opacity-100 hover:scale-105 transition-transform"
                        aria-label="إزالة المنتج"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}

            {/* Empty slots placeholders */}
            {Array.from({ length: Math.max(0, 4 - compareIds.length) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="aspect-square w-12 rounded-lg border border-dashed border-border/60 bg-muted/5 shrink-0 hidden sm:flex items-center justify-center text-muted-foreground/30 text-lg font-bold"
              >
                +
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Specifications Table Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-tajawal select-none">
            {/* Backdrop close */}
            <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-5xl bg-card border rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-right"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="p-5 border-b flex items-center justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-muted/40 hover:bg-muted/70 text-muted-foreground transition-colors cursor-pointer border-0"
                  aria-label="إغلاق المقارنة"
                >
                  <X className="h-4 w-4" />
                </button>
                <h3 className="text-base font-extrabold text-primary dark:text-gold flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-gold" />
                  <span>
                    {isRtl ? 'جدول مقارنة المنتجات التفصيلي' : 'Detailed Product Comparison Matrix'}
                  </span>
                </h3>
              </div>

              {/* Table scroll box */}
              <div className="flex-grow overflow-auto p-5 select-text">
                <table className="w-full text-xs text-right border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b">
                      {/* Features column header */}
                      <th className="px-4 py-3 font-bold text-muted-foreground w-1/5 select-none">
                        {isRtl ? 'المواصفات' : 'Specification'}
                      </th>
                      {/* Compared products header cells */}
                      {products.map((p) => (
                        <th
                          key={p.id}
                          className="px-4 py-3 align-top text-right border-r border-border/30"
                        >
                          <div className="flex flex-col gap-2 relative">
                            {/* Remove item button */}
                            <button
                              onClick={() => {
                                removeFromCompare(p.id);
                                if (compareIds.length <= 1) setIsModalOpen(false);
                              }}
                              className="absolute top-0 left-0 p-1 text-muted-foreground hover:text-destructive cursor-pointer bg-transparent border-0"
                            >
                              <X className="h-4 w-4" />
                            </button>

                            <OptimizedImage
                              src={p.images[0]?.url}
                              alt={isRtl ? p.nameAr : p.nameEn}
                              aspectRatioClassName="h-20 w-20 mx-auto"
                              className="h-full w-full object-cover rounded-xl border border-border/50 select-none"
                            />
                            <span className="font-bold text-sm text-primary dark:text-gold line-clamp-1 block text-center mt-1">
                              {isRtl ? p.nameAr : p.nameEn}
                            </span>
                            <span className="text-center font-bold text-muted-foreground font-sans mt-0.5 block">
                              {p.salePrice ? (
                                <span className="flex gap-1.5 justify-center items-center">
                                  <span className="line-through text-muted-foreground/50 text-[10px]">
                                    {formatCurrency(p.price)}
                                  </span>
                                  <span className="text-gold">{formatCurrency(p.salePrice)}</span>
                                </span>
                              ) : (
                                <span>{formatCurrency(p.price)}</span>
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Category row */}
                    <tr className="border-b hover:bg-muted/5">
                      <td className="px-4 py-3.5 font-extrabold text-muted-foreground select-none">
                        {isRtl ? 'القسم' : 'Category'}
                      </td>
                      {products.map((p) => (
                        <td
                          key={p.id}
                          className="px-4 py-3.5 border-r border-border/30 font-medium text-foreground text-right"
                        >
                          {p.category ? (isRtl ? p.category.nameAr : p.category.nameEn) : ''}
                        </td>
                      ))}
                    </tr>

                    {/* Stock Status row */}
                    <tr className="border-b hover:bg-muted/5">
                      <td className="px-4 py-3.5 font-extrabold text-muted-foreground select-none">
                        {isRtl ? 'التوفر' : 'Availability'}
                      </td>
                      {products.map((p) => {
                        const inStock = p.stock > 0;
                        return (
                          <td
                            key={p.id}
                            className="px-4 py-3.5 border-r border-border/30 font-medium"
                          >
                            <span
                              className={`inline-flex items-center gap-1 ${inStock ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}
                            >
                              {inStock ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>{isRtl ? 'متوفر في المخزون' : 'In Stock'}</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  <span>{isRtl ? 'نفذت الكمية' : 'Out of Stock'}</span>
                                </>
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Rating row */}
                    <tr className="border-b hover:bg-muted/5">
                      <td className="px-4 py-3.5 font-extrabold text-muted-foreground select-none">
                        {isRtl ? 'تقييم العملاء' : 'Rating'}
                      </td>
                      {products.map((p) => (
                        <td
                          key={p.id}
                          className="px-4 py-3.5 border-r border-border/30 font-medium text-foreground"
                        >
                          <div className="flex items-center gap-1 font-sans justify-start">
                            <span className="text-gold font-bold">
                              ★ {p.rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              ({p.reviews?.length || 0})
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Dynamic specs rows */}
                    {allSpecKeys.map((specKey) => (
                      <tr key={specKey} className="border-b hover:bg-muted/5">
                        <td className="px-4 py-3.5 font-extrabold text-muted-foreground select-none">
                          {specKey}
                        </td>
                        {products.map((p) => (
                          <td
                            key={p.id}
                            className="px-4 py-3.5 border-r border-border/30 font-light text-muted-foreground"
                          >
                            {p.specifications && p.specifications[specKey]
                              ? p.specifications[specKey]
                              : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Add to Cart Actions row */}
                    <tr className="select-none">
                      <td className="px-4 py-4"></td>
                      {products.map((p) => {
                        const inStock = p.stock > 0;
                        return (
                          <td
                            key={p.id}
                            className="px-4 py-4 border-r border-border/30 text-center"
                          >
                            <Button
                              onClick={() => handleAddToCart(p)}
                              variant="primary"
                              disabled={!inStock}
                              className="h-8 w-full rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold text-[10px] flex items-center justify-center gap-1 shadow-sm border-0"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>{isRtl ? 'أضف للسلة' : 'Add to Cart'}</span>
                            </Button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompareBar;
