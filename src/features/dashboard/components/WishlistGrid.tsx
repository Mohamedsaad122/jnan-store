import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ProductCard } from '@/features/home/components/product-card/ProductCard';
import { Product } from '@/types/domain';
import ROUTES from '@/constants/routes';

interface WishlistGridProps {
  products: Product[];
  isRtl: boolean;
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({ products, isRtl }) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl bg-card/10 font-tajawal select-none">
        <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4 border border-gold/15">
          <Heart className="h-6 w-6" />
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
            className="text-xs font-bold gap-1 bg-primary text-primary-foreground focus-visible:ring-gold"
          >
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('wishlist.empty.action', 'استكشف المنتجات')}</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-right">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default WishlistGrid;
