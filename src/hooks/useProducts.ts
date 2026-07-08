import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productsService, GetProductsParams } from '@/services/products/products.service';
import { Category, Product, Brand } from '@/types/domain';
import { queryKeys } from '@/lib/react-query/queryKeys';

/**
 * Custom TanStack Query Hook to fetch products based on filter parameters
 */
export const useProducts = (params: GetProductsParams) => {
  return useQuery({
    queryKey: queryKeys.products(params as Record<string, unknown>),
    queryFn: () => productsService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes caching
    placeholderData: keepPreviousData,
  });
};

/**
 * Custom TanStack Query Hook to fetch categories for filtering
 */
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: queryKeys.categories,
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes caching
  });
};

/**
 * Custom TanStack Query Hook to fetch featured products
 */
export const useFeaturedProducts = () => {
  return useQuery<Product[]>({
    queryKey: queryKeys.featuredProducts,
    queryFn: () => productsService.getFeaturedProducts(),
    staleTime: 1000 * 60 * 10, // 10 minutes caching
  });
};

/**
 * Custom TanStack Query Hook to fetch best seller products
 */
export const useBestSellers = () => {
  return useQuery<Product[]>({
    queryKey: queryKeys.bestSellers,
    queryFn: () => productsService.getBestSellerProducts(),
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Custom TanStack Query Hook to fetch flash sale products
 */
export const useFlashSales = () => {
  return useQuery<Product[]>({
    queryKey: queryKeys.flashSales,
    queryFn: () => productsService.getFlashSaleProducts(),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Custom TanStack Query Hook to fetch product details (by ID or Slug)
 */
export const useProductDetails = (idOrSlug: string) => {
  return useQuery<Product | undefined>({
    queryKey: queryKeys.product(idOrSlug),
    queryFn: async () => {
      // Try ID first, then fallback to Slug
      const product = await productsService.getProductById(idOrSlug);
      if (product) return product;
      return productsService.getProductBySlug(idOrSlug);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes caching
    enabled: !!idOrSlug,
  });
};

/**
 * Custom TanStack Query Hook to fetch related products
 */
export const useRelatedProducts = (productId: string) => {
  return useQuery<Product[]>({
    queryKey: queryKeys.relatedProducts(productId),
    queryFn: () => productsService.getRelatedProducts(productId),
    staleTime: 1000 * 60 * 5,
    enabled: !!productId,
  });
};

/**
 * Custom TanStack Query Hook to fetch multiple products by their IDs
 */
export const useProductsByIds = (ids: string[]) => {
  return useQuery<Product[]>({
    queryKey: queryKeys.productsByIds(ids),
    queryFn: () => productsService.getProductsByIds(ids),
    staleTime: 1000 * 60 * 5,
    enabled: ids.length > 0,
  });
};

/**
 * Custom TanStack Query Hook to fetch brands for filtering
 */
export const useBrands = () => {
  return useQuery<Brand[]>({
    queryKey: queryKeys.brands,
    queryFn: () => productsService.getBrands(),
    staleTime: 1000 * 60 * 30, // 30 minutes caching
  });
};
