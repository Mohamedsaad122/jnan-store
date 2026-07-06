import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '@/hooks/useWishlist';
import { useLanguageStore } from '@/store/language.store';
import { productsService } from '@/services/products/products.service';
import SectionHeader from '../components/SectionHeader';
import WishlistGrid from '../components/WishlistGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types/domain';

export const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const wishlist = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productsService
      .getProducts()
      .then((res) => {
        // Filter products that exist in the user's wishlist store
        const filtered = res.data.filter((item: Product) => wishlist.itemIds.includes(item.id));
        setProducts(filtered);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [wishlist.itemIds]);

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Contextual Header */}
      <SectionHeader
        title={t('dashboard.nav.wishlist', 'المفضلة')}
        subtitle={
          isRtl
            ? 'تصفح وإدارة جميع المنتجات الفاخرة التي قمت بحفظها للتسوق لاحقاً.'
            : 'Browse and manage all the premium items you saved to purchase later.'
        }
      />

      {isLoading ? (
        <div className="py-12 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <WishlistGrid products={products} isRtl={isRtl} />
      )}
    </div>
  );
};

export default WishlistPage;
