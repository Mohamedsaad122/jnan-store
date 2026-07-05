import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/domain';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/utils/currency';
import { useLanguageStore } from '@/store/language.store';
import { twMerge } from 'tailwind-merge';

export interface ProductCardProps {
  product: Product;
  categoryName?: string;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName,
  layout = 'grid',
}) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const name = isRtl ? product.nameAr : product.nameEn;
  const description = isRtl ? product.descriptionAr : product.descriptionEn;
  const isWishlisted = isInWishlist(product.id);

  // Price Calculations
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice! : product.price;
  const originalPrice = product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Stock status
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= 8;

  // Handle Add to Cart action
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      name,
      price: currentPrice,
      imageUrl: product.images[0]?.url,
    });

    toast.success(t('cart.added_success', { defaultValue: 'تم إضافة المنتج إلى سلتك بنجاح' }));
  };

  // Handle Wishlist toggle action
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);

    if (isWishlisted) {
      toast.success(t('wishlist.removed', { defaultValue: 'تمت الإزالة من المفضلة' }));
    } else {
      toast.success(t('wishlist.added', { defaultValue: 'تمت الإضافة للمفضلة' }));
    }
  };

  const formatNumber = (num: number) => {
    return isRtl
      ? new Intl.NumberFormat('ar-SA').format(num)
      : new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={twMerge(
        'group relative flex rounded-2xl border border-border/50 bg-card p-3 transition-theme shadow-sm hover:shadow-xl hover:border-gold/30',
        layout === 'list'
          ? 'flex-col sm:flex-row gap-4 md:gap-6 w-full'
          : 'flex-col justify-between'
      )}
    >
      {/* Product Image Panel */}
      <div
        className={twMerge(
          'relative overflow-hidden rounded-xl bg-muted/30 select-none shrink-0',
          layout === 'list' ? 'aspect-square w-full sm:w-44 md:w-48' : 'aspect-square w-full'
        )}
      >
        <img
          src={product.images[0]?.url}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out scale-100 group-hover:scale-105"
        />

        {/* Decorative Inner Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Floating Badges (Discount & Stock) */}
        <div className="absolute top-2.5 start-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-destructive text-destructive-foreground">
              {isRtl ? `-${formatNumber(discountPercent)}٪` : `-${discountPercent}%`}
            </span>
          )}
          {isOutOfStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted-foreground text-background">
              {t('product.out_of_stock', { defaultValue: 'نفذت الكمية' })}
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gold-light text-gold-foreground border border-gold/20">
              {t('product.low_stock', { defaultValue: 'كمية محدودة' })}
            </span>
          ) : null}
        </div>

        {/* Floating Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 end-2.5 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-background/80 hover:bg-background border border-border/40 shadow-sm transition-theme focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 z-10"
          aria-label={
            isWishlisted
              ? t('wishlist.remove_label', { defaultValue: 'إزالة من المفضلة' })
              : t('wishlist.add_label', { defaultValue: 'إضافة للمفضلة' })
          }
        >
          <Heart
            className={`h-4.5 w-4.5 transition-transform duration-300 ${
              isWishlisted
                ? 'fill-destructive text-destructive scale-110'
                : 'text-muted-foreground hover:scale-105'
            }`}
          />
        </button>

        {/* Floating Quick Action Overlay (Tablet/Desktop Viewport) - Only for Grid layout */}
        {layout === 'grid' && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 px-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-muted-foreground/30 disabled:text-muted-foreground/60 transition-theme shadow-md border border-gold/10 font-tajawal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{t('product.add_to_cart', { defaultValue: 'أضف للسلة' })}</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div
        className={twMerge(
          'flex flex-col flex-grow text-right select-text',
          layout === 'list' ? 'mt-0 justify-between py-1' : 'mt-4'
        )}
      >
        <div>
          {/* Category Label */}
          {categoryName && (
            <span className="text-[10px] font-semibold text-gold font-tajawal uppercase tracking-wider">
              {categoryName}
            </span>
          )}

          {/* Product Title */}
          <h4
            className={twMerge(
              'text-sm font-bold text-primary dark:text-foreground line-clamp-1 group-hover:text-gold transition-colors font-tajawal',
              layout === 'list' ? 'mt-0.5 text-base md:text-lg' : 'mt-1'
            )}
          >
            {name}
          </h4>

          {/* Product Rating & Reviews */}
          <div className="mt-1.5 flex items-center justify-start gap-1 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-0.5 text-gold">
              <Star className="h-3 w-3 fill-gold" />
              <span className="font-semibold text-primary dark:text-gold">
                {formatNumber(product.rating)}
              </span>
            </div>
            <span className="font-normal">
              (
              {t('product.reviews_count', {
                count: product.reviewsCount,
                defaultValue: `${formatNumber(product.reviewsCount)} تقييم`,
              })}
              )
            </span>
            {product.weightQuantity && (
              <span className="before:content-['•'] before:mx-1 before:text-border">
                {product.weightQuantity}
              </span>
            )}
          </div>

          {/* Product Description - List layout specific */}
          {layout === 'list' && (
            <p className="mt-2 text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed font-tajawal font-light">
              {description}
            </p>
          )}
        </div>

        {/* Pricing details and Add button */}
        <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex flex-col gap-0.5 text-right font-sans">
            {hasDiscount && (
              <span className="text-[10px] text-muted-foreground line-through decoration-destructive/60">
                {formatCurrency(originalPrice, language)}
              </span>
            )}
            <span className="text-sm md:text-base font-bold text-primary dark:text-gold">
              {formatCurrency(currentPrice, language)}
            </span>
          </div>

          {layout === 'list' ? (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-muted-foreground/30 disabled:text-muted-foreground/60 transition-theme shadow-md border border-gold/10 font-tajawal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{t('product.add_to_cart', { defaultValue: 'أضف للسلة' })}</span>
            </button>
          ) : (
            /* Icon-Only Add button visible specifically on mobile for grid layout */
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex h-9 w-9 md:hidden items-center justify-center rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary transition-theme border border-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t('product.add_to_cart', { defaultValue: 'أضف للسلة' })}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
