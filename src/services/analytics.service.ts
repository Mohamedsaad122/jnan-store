import { Product, Category } from '@/types/domain';

export const analyticsService = {
  trackProductView: (product: Product) => {
    console.log('[Analytics] Product Viewed:', {
      id: product.id,
      name: product.nameEn,
      price: product.price,
      category: product.category?.nameEn || product.categoryId,
    });
  },

  trackCategoryView: (category: Category) => {
    console.log('[Analytics] Category Viewed:', {
      id: category.id,
      name: category.nameEn,
      slug: category.slug,
    });
  },

  trackSearch: (query: string, resultsCount: number) => {
    console.log('[Analytics] Search Executed:', {
      query,
      resultsCount,
    });
  },

  trackAddToCart: (item: { productId: string; name: string; price: number; quantity: number }) => {
    console.log('[Analytics] Add To Cart:', item);
  },

  trackRemoveFromCart: (item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }) => {
    console.log('[Analytics] Remove From Cart:', item);
  },

  trackWishlist: (productId: string, action: 'add' | 'remove') => {
    console.log('[Analytics] Wishlist Action:', {
      productId,
      action,
    });
  },

  trackCompare: (productId: string, action: 'add' | 'remove') => {
    console.log('[Analytics] Comparison Action:', {
      productId,
      action,
    });
  },

  trackCheckout: (step: number, stepName: string) => {
    console.log('[Analytics] Checkout Progress:', {
      step,
      stepName,
    });
  },

  trackPurchaseIntent: (orderData: {
    subtotal: number;
    totalAmount: number;
    couponCode?: string;
  }) => {
    console.log('[Analytics] Purchase Intent Initiated:', orderData);
  },

  trackShare: (productId: string, platform: string) => {
    console.log('[Analytics] Product Shared:', {
      productId,
      platform,
    });
  },

  trackBannerClick: (bannerId: string, bannerName: string) => {
    console.log('[Analytics] Banner Clicked:', {
      bannerId,
      bannerName,
    });
  },

  trackPromotionClick: (promoId: string, promoName: string) => {
    console.log('[Analytics] Promotion Clicked:', {
      promoId,
      promoName,
    });
  },
};

export default analyticsService;
