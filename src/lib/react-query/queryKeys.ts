export const queryKeys = {
  products: (filters: Record<string, unknown>) => ['products', filters] as const,
  product: (idOrSlug: string) => ['product', idOrSlug] as const,
  categories: ['categories'] as const,
  brands: ['brands'] as const,
  featuredProducts: ['featured-products'] as const,
  bestSellers: ['best-sellers'] as const,
  flashSales: ['flash-sales'] as const,
  productsByIds: (ids: string[]) => ['products-by-ids', ids] as const,
  relatedProducts: (id: string) => ['related-products', id] as const,
};

export default queryKeys;
