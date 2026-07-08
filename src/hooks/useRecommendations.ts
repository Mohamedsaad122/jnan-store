import { useMemo } from 'react';
import { useProducts } from './useProducts';
import { useCart } from './useCart';
import { useWishlist } from './useWishlist';
import { Product } from '@/types/domain';

export type RecommendationType =
  'recommended' | 'also-bought' | 'similar' | 'trending' | 'continue' | 'frequently-together';

interface UseRecommendationsParams {
  type: RecommendationType;
  productId?: string;
  categoryId?: string;
  limit?: number;
}

const COMPLEMENTARY_CATEGORIES: Record<string, string> = {
  dates: 'coffee',
  coffee: 'dates',
  spices: 'coffee',
  sweets: 'coffee',
  brassware: 'coffee',
};

const EMPTY_PRODUCTS: Product[] = [];

export const useRecommendations = ({
  type,
  productId,
  categoryId,
  limit = 4,
}: UseRecommendationsParams) => {
  // Query all active products with a generic query cache target (empty search/filter gets first 30 products)
  const { data: productsResult, isLoading } = useProducts({ limit: 40 });
  const products = productsResult?.data || EMPTY_PRODUCTS;

  const { items: cartItems } = useCart();
  const { itemIds: wishlistIds = [] } = useWishlist();

  const recommendedProducts = useMemo(() => {
    if (products.length === 0) return [];

    let list: Product[] = [];

    switch (type) {
      case 'similar':
        if (categoryId) {
          list = products.filter((p) => p.categoryId === categoryId && p.id !== productId);
        } else if (productId) {
          const activeProduct = products.find((p) => p.id === productId);
          if (activeProduct) {
            list = products.filter(
              (p) => p.categoryId === activeProduct.categoryId && p.id !== productId
            );
          }
        }
        break;

      case 'also-bought':
        // Same category, high ratings
        if (categoryId) {
          list = products
            .filter((p) => p.categoryId === categoryId && p.id !== productId)
            .sort((a, b) => b.rating - a.rating);
        } else {
          list = products.filter((p) => p.id !== productId).sort((a, b) => b.rating - a.rating);
        }
        break;

      case 'trending':
        // Featured products or rating >= 4.7
        list = products.filter((p) => p.isFeatured || p.rating >= 4.7);
        break;

      case 'recommended':
        // Based on categories present in user's cart or wishlist
        {
          const cartProductIds = cartItems.map((c) => c.productId);
          const interestProductIds = Array.from(new Set([...cartProductIds, ...wishlistIds]));
          const interestProducts = products.filter((p) => interestProductIds.includes(p.id));
          const interestCategoryIds = Array.from(
            new Set(interestProducts.map((p) => p.categoryId))
          );

          if (interestCategoryIds.length > 0) {
            list = products.filter(
              (p) => interestCategoryIds.includes(p.categoryId) && !cartProductIds.includes(p.id)
            );
          } else {
            // Fallback to highly rated items
            list = [...products].sort((a, b) => b.rating - a.rating);
          }
        }
        break;

      case 'continue':
        // Suggest products in category user is browsing, not yet added to cart
        {
          const cartProductIds = cartItems.map((c) => c.productId);
          if (categoryId) {
            list = products.filter(
              (p) => p.categoryId === categoryId && !cartProductIds.includes(p.id)
            );
          } else {
            list = products.filter((p) => !cartProductIds.includes(p.id));
          }
        }
        break;

      case 'frequently-together':
        // Complementary category mapping
        if (categoryId) {
          const complementSlug = COMPLEMENTARY_CATEGORIES[categoryId] || 'coffee';
          list = products.filter(
            (p) => p.category?.slug === complementSlug || p.categoryId === complementSlug
          );
        } else if (productId) {
          const activeProduct = products.find((p) => p.id === productId);
          if (activeProduct) {
            const activeCatId = activeProduct.categoryId;
            const complementId = COMPLEMENTARY_CATEGORIES[activeCatId] || 'coffee';
            list = products.filter((p) => p.categoryId === complementId);
          }
        }
        break;

      default:
        list = products;
    }

    // Ensure we filter out active product if specified
    if (productId) {
      list = list.filter((p) => p.id !== productId);
    }

    // De-duplicate items just in case
    const uniqueMap = new Map<string, Product>();
    list.forEach((p) => uniqueMap.set(p.id, p));

    return Array.from(uniqueMap.values()).slice(0, limit);
  }, [products, type, productId, categoryId, cartItems, wishlistIds, limit]);

  return {
    data: recommendedProducts,
    isLoading,
  };
};

export default useRecommendations;
