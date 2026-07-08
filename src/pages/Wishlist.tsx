import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useProductsByIds } from '@/hooks/useProducts';
import ProductCard from '@/features/home/components/product-card/ProductCard';
import ProductCardSkeleton from '@/features/home/components/product-card/ProductCardSkeleton';
import { useLanguageStore } from '@/store/language.store';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import ROUTES from '@/constants/routes';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/domain';
import { Helmet } from 'react-helmet-async';
import EmptyState from '@/components/ui/EmptyState';

export const Wishlist: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { itemIds, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  // 1. Fetch wishlisted items via modular hook
  const { data: products, isLoading } = useProductsByIds(itemIds);

  const handleMoveToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add default variant to cart
    const activePrice = product.salePrice ?? product.price;
    addToCart({
      productId: product.id,
      name: isRtl ? product.nameAr : product.nameEn,
      price: activePrice,
      imageUrl: product.images[0]?.url,
      quantity: 1,
    });

    toast.success(t('cart.added_success', { defaultValue: 'تم إضافة المنتج إلى سلتك بنجاح' }));
  };

  // 2. Empty Wishlist state Layout
  if (itemIds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Helmet>
          <title>{isRtl ? 'المفضلة | متجر جنان' : 'Wishlist | Jnan Store'}</title>
          <meta
            name="description"
            content={
              isRtl
                ? 'قائمة المنتجات المفضلة لديك في متجر جنان'
                : 'Your saved items list in Jnan Store'
            }
          />
        </Helmet>
        <EmptyState
          icon={<Heart className="h-8 w-8 text-gold" />}
          title={t('wishlist.empty_title', { defaultValue: 'قائمة المفضلة فارغة حالياً' })}
          description={t('wishlist.empty_desc', {
            defaultValue:
              'لم تقم بإضافة أي منتجات للمفضلة بعد. احفظ منتجاتك المفضلة للعودة إليها لاحقاً.',
          })}
          primaryAction={{
            label: t('cart.continue_shopping', { defaultValue: 'الذهاب للمتجر وتصفح المنتجات' }),
            to: ROUTES.SHOP,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 md:px-6 py-8 font-tajawal text-right"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>{isRtl ? 'المفضلة | متجر جنان' : 'Wishlist | Jnan Store'}</title>
        <meta
          name="description"
          content={
            isRtl
              ? 'قائمة المنتجات المفضلة لديك في متجر جنان'
              : 'Your saved items list in Jnan Store'
          }
        />
      </Helmet>

      {/* Header and actions */}
      <div className="flex items-center justify-between border-b border-border/20 pb-4 mb-8 select-none">
        <h1 className="text-2xl font-black text-primary leading-tight">
          {t('wishlist.title', { defaultValue: 'قائمة المفضلة' })}
        </h1>

        <Button
          onClick={clearWishlist}
          variant="outline"
          className="text-xs font-bold text-muted-foreground hover:text-destructive border-border/60 hover:bg-destructive/5 flex items-center gap-1.5 h-10 px-3 rounded-lg"
        >
          <Trash2 className="h-4 w-4" />
          <span>{t('wishlist.clear_wishlist', { defaultValue: 'مسح الكل' })}</span>
        </Button>
      </div>

      {/* Grid displays */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 select-none">
          {Array.from({ length: Math.max(4, itemIds.length) }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col justify-between">
              {/* Reuse standard product card */}
              <ProductCard product={product} />

              {/* Move to Cart overlay shortcut */}
              <div className="mt-2.5 select-none">
                <Button
                  onClick={(e) => handleMoveToCart(product, e)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-1.5 h-9 border-primary text-primary hover:bg-primary/5 text-xs font-bold rounded-lg transition-all"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>{t('wishlist.move_to_cart', { defaultValue: 'أضف للسلة' })}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Wishlist;
