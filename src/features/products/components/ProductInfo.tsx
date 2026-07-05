import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product, ProductVariant } from '@/types/domain';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/utils/currency';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import ROUTES from '@/constants/routes';
import { twMerge } from 'tailwind-merge';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // 1. Variant Management
  const hasVariants = product.variants && product.variants.length > 0;

  // Extract all attribute keys (e.g. 'weight', 'grind')
  const attributeKeys = React.useMemo(() => {
    if (!hasVariants) return [];
    const keys = new Set<string>();
    product.variants.forEach((v) => {
      Object.keys(v.attributes).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [product.variants, hasVariants]);

  // Set initial selected options mapping to the first variant
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (hasVariants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedOptions(defaultVariant.attributes);
      setActiveVariant(defaultVariant);
    } else {
      setActiveVariant(null);
    }
  }, [product, hasVariants]);

  // Handle changing an option (e.g. picking a different weight)
  const handleOptionSelect = (key: string, value: string) => {
    const nextOptions = { ...selectedOptions, [key]: value };
    setSelectedOptions(nextOptions);

    // Find the variant that matches all selected options
    const matched = product.variants.find((v) =>
      Object.entries(nextOptions).every(([optKey, optVal]) => v.attributes[optKey] === optVal)
    );

    if (matched) {
      setActiveVariant(matched);
    }
  };

  // Derive active properties based on active variant or fallback to base product
  const price = activeVariant ? activeVariant.price : product.price;
  const salePrice = activeVariant ? activeVariant.salePrice : product.salePrice;
  const stock = activeVariant ? activeVariant.stock : product.stock;
  const sku = activeVariant ? activeVariant.sku : product.sku;

  const hasDiscount = !!salePrice && salePrice < price;
  const currentPrice = hasDiscount ? salePrice! : price;
  const originalPrice = price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= 8;

  // 2. Quantity Management
  const [quantity, setQuantity] = useState(1);

  // Reset quantity to 1 when active variant shifts
  useEffect(() => {
    setQuantity(1);
  }, [activeVariant]);

  // 3. Action Handlers
  const name = isRtl ? product.nameAr : product.nameEn;
  const isWishlisted = isInWishlist(product.id);

  const getVariantLabel = () => {
    if (!activeVariant) return '';
    return isRtl ? ` - ${activeVariant.nameAr}` : ` - ${activeVariant.nameEn}`;
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      name: `${name}${getVariantLabel()}`,
      price: currentPrice,
      imageUrl: product.images[0]?.url,
      quantity,
    });

    toast.success(t('cart.added_success', { defaultValue: 'تم إضافة المنتج إلى سلتك بنجاح' }));
  };

  const handleBuyNowClick = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      name: `${name}${getVariantLabel()}`,
      price: currentPrice,
      imageUrl: product.images[0]?.url,
      quantity,
    });

    navigate(ROUTES.CHECKOUT);
  };

  const handleWishlistToggleClick = () => {
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
    <div className="flex flex-col text-right font-tajawal w-full">
      {/* Brand & Category row */}
      <div className="flex items-center justify-between text-xs font-semibold select-none mb-1">
        {product.brand && (
          <span className="text-gold font-tajawal uppercase tracking-wider">
            {isRtl ? product.brand.nameAr : product.brand.nameEn}
          </span>
        )}
        <span className="text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
          {product.category ? (isRtl ? product.category.nameAr : product.category.nameEn) : ''}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-xl md:text-2xl font-black text-primary leading-tight font-tajawal mb-2.5">
        {name}
      </h1>

      {/* Ratings & reviews sum */}
      <div className="flex items-center justify-start gap-1 text-xs text-muted-foreground select-none mb-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-0.5 text-gold">
          <span className="font-bold text-primary dark:text-gold text-sm">
            {formatNumber(product.rating)}
          </span>
          <span className="text-gold">★</span>
        </div>
        <span>
          (
          {t('product.reviews_count', {
            count: product.reviewsCount,
            defaultValue: `${formatNumber(product.reviewsCount)} تقييم`,
          })}
          )
        </span>
        <span className="text-border mx-1.5">•</span>
        <span className="font-sans text-xs">SKU: {sku}</span>
      </div>

      {/* Price Block */}
      <div className="flex flex-col gap-1 mb-5 select-text">
        {hasDiscount && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground line-through decoration-destructive/80 font-sans">
              {formatCurrency(originalPrice, language)}
            </span>
            <span className="inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-destructive/10 text-destructive select-none">
              {isRtl ? `خصم ${formatNumber(discountPercent)}٪` : `${discountPercent}% OFF`}
            </span>
          </div>
        )}
        <span className="text-2xl font-black text-primary dark:text-gold font-sans">
          {formatCurrency(currentPrice, language)}
        </span>
      </div>

      {/* Description Snippet */}
      <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed font-light mb-6 select-text">
        {isRtl ? product.descriptionAr : product.descriptionEn}
      </p>

      {/* Variants Options Selectors */}
      {hasVariants &&
        attributeKeys.map((key) => {
          // Collect all unique option values for this attribute key
          const uniqueValues = Array.from(
            new Set(product.variants.map((v) => v.attributes[key]).filter(Boolean))
          );

          return (
            <div key={key} className="mb-5 select-none border-t border-border/20 pt-4">
              <h4 className="text-xs font-bold text-primary mb-2.5">
                {key === 'weight'
                  ? t('product.option_weight', { defaultValue: 'الوزن / الحجم' })
                  : key === 'grind'
                    ? t('product.option_grind', { defaultValue: 'نوع الطحن' })
                    : key}
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {uniqueValues.map((val) => {
                  const isSelected = selectedOptions[key] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleOptionSelect(key, val)}
                      className={twMerge(
                        'px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-background border-border/60 hover:border-gold/40 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Stock Alerts & Status */}
      <div className="mb-6 select-none border-t border-border/20 pt-4">
        {isOutOfStock ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive text-xs font-bold">
            <AlertTriangle className="h-4 w-4" />
            <span>{t('product.out_of_stock', { defaultValue: 'نفذت الكمية من المخزن' })}</span>
          </div>
        ) : isLowStock ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 text-gold-foreground border border-gold/10 text-xs font-bold">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {t('product.low_stock_count', {
                count: stock,
                defaultValue: `كمية محدودة جداً! متبقي ${formatNumber(stock)} قطع فقط`,
              })}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-xs font-bold">
            <CheckCircle className="h-4 w-4" />
            <span>{t('product.in_stock', { defaultValue: 'متوفر في المخزن وجاهز للشحن' })}</span>
          </div>
        )}
      </div>

      {/* Quantity and Actions row */}
      {!isOutOfStock && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 select-none mb-6">
          {/* Quantity selector */}
          <QuantitySelector
            quantity={quantity}
            stock={stock}
            onChange={setQuantity}
            className="h-12 w-full sm:w-32 bg-muted/20 border-border/60"
          />

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full">
            <Button
              onClick={handleAddToCartClick}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 h-12 border-primary text-primary hover:bg-primary/5 font-bold rounded-xl text-xs sm:text-sm transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{t('product.add_to_cart', { defaultValue: 'أضف للسلة' })}</span>
            </Button>
            <Button
              onClick={handleBuyNowClick}
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all border border-gold/10"
            >
              <CreditCard className="h-4 w-4" />
              <span>{t('product.buy_now', { defaultValue: 'شراء الآن' })}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Wishlist and Share */}
      <div className="border-t border-border/30 pt-4 flex items-center justify-start gap-4 select-none">
        <button
          onClick={handleWishlistToggleClick}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors py-1.5 px-3 rounded-lg border ${
            isWishlisted
              ? 'text-destructive border-destructive/20 bg-destructive/5'
              : 'text-muted-foreground border-border/40 hover:border-gold/30 hover:text-gold hover:bg-gold/5'
          }`}
          aria-label={isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-destructive' : ''}`} />
          <span>
            {isWishlisted
              ? t('wishlist.remove_label', { defaultValue: 'في المفضلة' })
              : t('wishlist.add_label', { defaultValue: 'إضافة للمفضلة' })}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
