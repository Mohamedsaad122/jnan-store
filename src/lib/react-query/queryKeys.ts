export const queryKeys = {
  // Authentication & Session queries
  auth: {
    session: ['auth', 'session'] as const,
    profile: ['auth', 'profile'] as const,
  },

  // Product queries
  products: (filters: Record<string, unknown>) => ['products', filters] as const,
  product: (idOrSlug: string) => ['product', idOrSlug] as const,
  categories: ['categories'] as const,
  brands: ['brands'] as const,
  featuredProducts: ['featured-products'] as const,
  bestSellers: ['best-sellers'] as const,
  flashSales: ['flash-sales'] as const,
  productsByIds: (ids: string[]) => ['products-by-ids', ids] as const,
  relatedProducts: (id: string) => ['related-products', id] as const,

  // Orders queries
  orders: {
    list: (userId: string) => ['orders', 'list', userId] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },

  // Customer dashboard resource queries
  notifications: ['notifications'] as const,
  wishlist: ['wishlist'] as const,
  addresses: ['addresses'] as const,
};

export default queryKeys;
