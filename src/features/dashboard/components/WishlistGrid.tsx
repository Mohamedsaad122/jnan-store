import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, ShoppingBag, Eye, Share2, BarChart3, Star, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Product } from '@/types/domain';
import { useWishlist } from '@/hooks/useWishlist';
import useCartStore from '@/store/cart.store';
import useCompareStore from '@/store/compare.store';
import ROUTES from '@/constants/routes';

interface WishlistGridProps {
  products: Product[];
  isRtl: boolean;
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({ products, isRtl }) => {
  const { t } = useTranslation();
  const wishlist = useWishlist();
  const cartStore = useCartStore();
  const compareStore = useCompareStore();

  // State for Quick View dialog
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl bg-card/10 font-tajawal select-none">
        <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4 border border-gold/15">
          <Trash2 className="h-5 w-5 text-gold/60" />
        </div>
        <h3 className="text-sm font-bold text-primary mb-1">
          {t('wishlist.empty.title', 'قائمة المفضلة فارغة')}
        </h3>
        <p className="text-xs text-muted-foreground max-w-xs mb-5 leading-relaxed">
          {t(
            'wishlist.empty.description',
            'لم تقم بإضافة أي منتجات إلى مفضلتك بعد. تسوق الآن وأضف المنتجات المفضلة لديك.'
          )}
        </p>
        <Link to={ROUTES.SHOP}>
          <Button
            size="sm"
            className="text-xs font-bold gap-1 bg-primary text-primary-foreground focus-visible:ring-gold cursor-pointer"
          >
            {isRtl ? 'استكشف المتجر' : 'Browse Shop'}
          </Button>
        </Link>
      </div>
    );
  }

  const handleMoveToCart = (product: Product) => {
    cartStore.addItem({
      productId: product.id,
      name: isRtl ? product.nameAr : product.nameEn,
      price: product.salePrice || product.price,
      imageUrl: product.images[0]?.url,
      quantity: 1,
    });
    wishlist.toggleWishlist(product.id);
    toast.success(
      isRtl
        ? 'تم نقل المنتج بنجاح لسلتك وإزالته من المفضلة!'
        : 'Item successfully moved to cart and removed from wishlist!'
    );
  };

  const handleCompareToggle = (product: Product) => {
    const isCurrentlyIn = compareStore.isInCompare(product.id);
    if (isCurrentlyIn) {
      compareStore.removeFromCompare(product.id);
      toast.success(isRtl ? 'تمت إزالة المنتج من المقارنة' : 'Product removed from comparison');
    } else {
      const added = compareStore.addToCompare(product.id);
      if (added) {
        toast.success(isRtl ? 'تمت إضافة المنتج لقائمة المقارنة' : 'Product added to comparison');
      } else {
        toast.error(
          isRtl ? 'لا يمكن إضافة أكثر من 4 منتجات للمقارنة' : 'Maximum 4 items can be compared'
        );
      }
    }
  };

  const handleShare = (product: Product) => {
    const url = `${window.location.origin}/products/${product.slug}`;
    navigator.clipboard.writeText(url);
    toast.success(
      isRtl ? 'تم نسخ رابط مشاركة المنتج بنجاح!' : 'Product share link copied to clipboard!'
    );
  };

  const formatPrice = (num: number) => {
    return isRtl ? `${new Intl.NumberFormat('ar-SA').format(num)} ر.س` : `${num.toFixed(2)} SAR`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-right font-tajawal select-none">
      {products.map((product) => {
        const hasDiscount = !!product.salePrice && product.salePrice < product.price;
        const discountPercent = hasDiscount
          ? Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)
          : 0;
        const inStock = product.stock > 0;
        const compareActive = compareStore.isInCompare(product.id);

        return (
          <Card
            key={product.id}
            className="flex flex-col justify-between border border-border/40 overflow-hidden hover:border-gold/30 shadow-xs transition-all relative"
          >
            {/* Header image wrapper with badges */}
            <div className="relative group overflow-hidden bg-muted/20">
              <div className="absolute top-2.5 start-2.5 z-10 flex flex-col gap-1.5">
                {/* Discount badge */}
                {hasDiscount && (
                  <span className="bg-destructive text-destructive-foreground text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    {isRtl ? `خصم ${discountPercent}٪` : `${discountPercent}% OFF`}
                  </span>
                )}
                {/* Stock badge */}
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs ${
                    inStock
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15'
                  }`}
                >
                  {inStock
                    ? isRtl
                      ? 'متوفر'
                      : 'In Stock'
                    : isRtl
                      ? 'نفذت الكمية'
                      : 'Out of Stock'}
                </span>
              </div>

              {/* Product Thumbnail image */}
              {product.images?.[0]?.url ? (
                <OptimizedImage
                  src={product.images[0].url}
                  alt={isRtl ? product.nameAr : product.nameEn}
                  aspectRatioClassName="aspect-square w-full"
                  className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300"
                />
              ) : (
                <div className="aspect-square w-full bg-muted/40 flex items-center justify-center text-muted-foreground text-xs">
                  {isRtl ? 'لا توجد صورة' : 'No image'}
                </div>
              )}
            </div>

            {/* Body Info */}
            <div className="p-4 flex-1 flex flex-col justify-between select-text">
              <div>
                <span className="text-[10px] text-gold font-bold uppercase tracking-wider block mb-1">
                  {product.brand ? (isRtl ? product.brand.nameAr : product.brand.nameEn) : ''}
                </span>
                <Link
                  to={`/products/${product.slug}`}
                  className="font-bold text-sm text-primary hover:text-gold block leading-snug line-clamp-1 truncate"
                >
                  {isRtl ? product.nameAr : product.nameEn}
                </Link>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                  {isRtl ? product.descriptionAr : product.descriptionEn}
                </p>
              </div>

              {/* Price row */}
              <div className="flex items-center gap-2 mt-3 select-none">
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through font-sans">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="font-black text-sm text-primary font-sans">
                  {formatPrice(product.salePrice || product.price)}
                </span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="border-t border-border/10 p-3 bg-muted/5 flex items-center justify-between gap-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                {/* Remove button */}
                <Button
                  onClick={() => wishlist.toggleWishlist(product.id)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 cursor-pointer"
                  title={isRtl ? 'إزالة من المفضلة' : 'Remove item'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Quick view button */}
                <Button
                  onClick={() => setSelectedProduct(product)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/40 cursor-pointer"
                  title={isRtl ? 'عرض سريع' : 'Quick View'}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                {/* Compare button */}
                <Button
                  onClick={() => handleCompareToggle(product)}
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-lg cursor-pointer ${
                    compareActive
                      ? 'text-gold bg-gold/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted/40'
                  }`}
                  title={isRtl ? 'مقارنة المنتجات' : 'Compare'}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>

                {/* Share button */}
                <Button
                  onClick={() => handleShare(product)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/40 cursor-pointer"
                  title={isRtl ? 'مشاركة' : 'Share'}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Move to cart action */}
              <Button
                onClick={() => handleMoveToCart(product)}
                disabled={!inStock}
                variant="primary"
                size="sm"
                className="text-[10px] font-bold py-1.5 px-3 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="h-3 w-3 text-gold" />
                <span>{isRtl ? 'نقل للسلة' : 'Move to Cart'}</span>
              </Button>
            </div>
          </Card>
        );
      })}

      {/* Quick View Dialog Modal */}
      {selectedProduct && (
        <Dialog
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={isRtl ? selectedProduct.nameAr : selectedProduct.nameEn}
        >
          <div
            className="flex flex-col sm:flex-row gap-5 font-tajawal text-right pt-2"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Left/Right Product Image */}
            <div className="w-full sm:w-2/5 shrink-0 select-none">
              {selectedProduct.images?.[0]?.url ? (
                <OptimizedImage
                  src={selectedProduct.images[0].url}
                  alt={isRtl ? selectedProduct.nameAr : selectedProduct.nameEn}
                  aspectRatioClassName="aspect-square w-full"
                  className="object-cover w-full h-full rounded-xl border border-border/40 shadow-inner"
                />
              ) : (
                <div className="aspect-square bg-muted/40 rounded-xl flex items-center justify-center text-muted-foreground">
                  {isRtl ? 'لا توجد صورة' : 'No image'}
                </div>
              )}
            </div>

            {/* Details and Actions */}
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">
                  {selectedProduct.brand
                    ? isRtl
                      ? selectedProduct.brand.nameAr
                      : selectedProduct.brand.nameEn
                    : ''}
                </span>
                <h4 className="font-extrabold text-base text-primary leading-tight">
                  {isRtl ? selectedProduct.nameAr : selectedProduct.nameEn}
                </h4>

                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold select-none">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="text-primary mt-0.5">
                    {selectedProduct.rating} ({selectedProduct.reviewsCount}{' '}
                    {isRtl ? 'تقييم' : 'reviews'})
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mt-2 select-text">
                  {isRtl ? selectedProduct.descriptionAr : selectedProduct.descriptionEn}
                </p>

                {/* SKU */}
                <div className="text-[10px] text-muted-foreground/80 font-sans pt-1">
                  SKU: {selectedProduct.sku}
                </div>
              </div>

              {/* Footer and Price button */}
              <div className="border-t border-border/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
                <div className="flex items-baseline gap-2">
                  {selectedProduct.salePrice &&
                    selectedProduct.salePrice < selectedProduct.price && (
                      <span className="text-xs text-muted-foreground line-through font-sans">
                        {formatPrice(selectedProduct.price)}
                      </span>
                    )}
                  <span className="font-black text-lg text-primary font-sans">
                    {formatPrice(selectedProduct.salePrice || selectedProduct.price)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProduct(null)}
                    className="text-xs font-bold px-4 h-9 cursor-pointer"
                  >
                    {isRtl ? 'إغلاق' : 'Close'}
                  </Button>
                  <Button
                    onClick={() => {
                      handleMoveToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock <= 0}
                    variant="primary"
                    className="text-xs font-bold px-5 h-9 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 text-gold" />
                    <span>{isRtl ? 'أضف للسلة' : 'Add to Cart'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default WishlistGrid;
