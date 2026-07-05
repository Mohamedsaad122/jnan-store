import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useLanguageStore } from '@/store/language.store';
import { productsService } from '@/services/products/products.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SectionTitle from '../components/SectionTitle';
import EmptyDashboardState from '../components/EmptyDashboardState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types/domain';
import { toast } from 'react-hot-toast';

export const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // Destructure values from hooks manually to avoid rules of hooks issues
  const wishlist = useWishlist();
  const cart = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productsService
      .getProducts()
      .then((res) => {
        // Filter products that exist in the wishlist
        const filtered = res.data.filter((item: Product) => wishlist.itemIds.includes(item.id));
        setProducts(filtered);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [wishlist.itemIds]);

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      productId: product.id,
      name: isRtl ? product.nameAr : product.nameEn,
      price: product.price,
      quantity: 1,
      imageUrl: product.images?.[0]?.url || '',
    });
    cart.setOpen(true);
    toast.success(isRtl ? 'تمت إضافة المنتج للسلة' : 'Added to shopping cart');
  };

  const handleRemove = (id: string) => {
    wishlist.toggleWishlist(id);
    toast.success(isRtl ? 'تمت إزالة المنتج من المفضلة' : 'Removed from wishlist');
  };

  const formatPrice = (num: number) => {
    return isRtl ? `${new Intl.NumberFormat('ar-SA').format(num)} ر.س` : `${num.toFixed(2)} SAR`;
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <SectionTitle
        title={t('dashboard.nav.wishlist')}
        subtitle={
          isRtl
            ? 'تصفح قائمة منتجاتك المفضلة التي قمت بحفظها.'
            : 'Browse the list of items you saved for later.'
        }
      />

      {isLoading ? (
        <div className="py-12 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : products.length === 0 ? (
        <EmptyDashboardState
          title={isRtl ? 'قائمة المفضلة فارغة حالياً.' : 'Your wishlist is empty.'}
          description={
            isRtl
              ? 'لم تقم بحفظ أي منتجات في المفضلة بعد. تصفح المنتجات وأضف ما يعجبك!'
              : 'No items saved to your wishlist yet. Browse products and add your favorites!'
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="border-border/40 overflow-hidden flex flex-col justify-between text-right shadow-xs hover:border-gold/30 transition-all group"
            >
              {/* Product Thumbnail */}
              <div className="h-44 bg-muted/40 relative overflow-hidden select-none">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={isRtl ? product.nameAr : product.nameEn}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <Heart className="h-10 w-10 stroke-1" />
                  </div>
                )}
                {/* Remove button overlay */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-destructive hover:scale-105 shadow-sm transition-all focus:outline-none"
                  aria-label={isRtl ? 'إزالة من المفضلة' : 'Remove from wishlist'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div className="space-y-1.5 mb-4">
                  <h4 className="font-bold text-sm text-primary line-clamp-1">
                    {isRtl ? product.nameAr : product.nameEn}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {isRtl ? product.descriptionAr : product.descriptionEn}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/10 pt-3 mt-auto">
                  <span className="font-black text-sm text-primary">
                    {formatPrice(product.price)}
                  </span>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    size="sm"
                    className="text-[10px] font-bold gap-1 bg-primary text-primary-foreground select-none"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'أضف للسلة' : 'Add'}</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
