import { Product, Category, ApiPaginatedResponse } from '@/types/domain';
import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';
import { MOCK_PRODUCTS, RawProduct } from './products.mock';
import { productsMapper } from './products.mapper';
import { categoriesService } from '@/services/categories/categories.service';

export interface GetProductsParams {
  search?: string;
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  rating?: number | null;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Service to manage product searches, category lists, details retrieval,
 * and associated mapping adaptations. Supports switching between Mock and Real APIs.
 */
export const productsService = {
  /**
   * Get filtered, sorted and paginated products
   */
  async getProducts(params: GetProductsParams = {}): Promise<ApiPaginatedResponse<Product>> {
    if (!featureFlags.enableMockApi) {
      const response = await request.get<ApiPaginatedResponse<RawProduct>>('/products', {
        params,
      });
      return {
        ...response,
        data: productsMapper.mapToProductsList(response.data),
      };
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const {
      search = '',
      category = '',
      minPrice = null,
      maxPrice = null,
      rating = null,
      inStock = false,
      sort = 'featured',
      page = 1,
      limit = 12,
    } = params;

    let filtered = [...MOCK_PRODUCTS];

    // 1. Text Search Filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.descriptionAr.toLowerCase().includes(q) ||
          p.descriptionEn.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === category);
    }

    // 3. Price Filters
    if (minPrice !== null) {
      filtered = filtered.filter((p) => {
        const activePrice = p.salePrice ?? p.price;
        return activePrice >= minPrice;
      });
    }
    if (maxPrice !== null) {
      filtered = filtered.filter((p) => {
        const activePrice = p.salePrice ?? p.price;
        return activePrice <= maxPrice;
      });
    }

    // 4. Rating Filter
    if (rating !== null) {
      filtered = filtered.filter((p) => p.rating >= rating);
    }

    // 5. Stock Filter
    if (inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // 6. Sorting
    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        // Featured products first, then standard index sorting
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
        break;
    }

    // 7. Pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const activePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (activePage - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    // Map raw products list to strongly typed domain model list
    const mappedItems = productsMapper.mapToProductsList(paginatedItems);

    return {
      success: true,
      data: mappedItems,
      pagination: {
        page: activePage,
        limit,
        totalItems,
        totalPages,
        hasNextPage: activePage < totalPages,
        hasPrevPage: activePage > 1,
      },
    };
  },

  /**
   * Fetch a single product by its unique ID
   */
  async getProductById(id: string): Promise<Product | undefined> {
    if (!featureFlags.enableMockApi) {
      const raw = await request.get<RawProduct>(`/products/${id}`);
      return productsMapper.mapToProduct(raw);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const raw = MOCK_PRODUCTS.find((p) => p.id === id && p.isActive);
    if (!raw) return undefined;
    return productsMapper.mapToProduct(raw);
  },

  /**
   * Fetch a single product by its unique Slug
   */
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    if (!featureFlags.enableMockApi) {
      const raw = await request.get<RawProduct>(`/products/slug/${slug}`);
      return productsMapper.mapToProduct(raw);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const raw = MOCK_PRODUCTS.find((p) => p.slug === slug && p.isActive);
    if (!raw) return undefined;
    return productsMapper.mapToProduct(raw);
  },

  /**
   * Expose Featured products (used on Homepage)
   */
  async getFeaturedProducts(): Promise<Product[]> {
    if (!featureFlags.enableMockApi) {
      const raw = await request.get<RawProduct[]>('/products/featured');
      return productsMapper.mapToProductsList(raw);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    const raw = MOCK_PRODUCTS.filter((p) => p.isFeatured && p.isActive);
    return productsMapper.mapToProductsList(raw);
  },

  /**
   * Expose Best Seller products (used on Homepage)
   */
  async getBestSellerProducts(): Promise<Product[]> {
    if (!featureFlags.enableMockApi) {
      const raw = await request.get<RawProduct[]>('/products/best-sellers');
      return productsMapper.mapToProductsList(raw);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    const raw = MOCK_PRODUCTS.filter((p) => p.isActive)
      .sort((a, b) => b.reviewsCount - a.reviewsCount)
      .slice(0, 4);
    return productsMapper.mapToProductsList(raw);
  },

  /**
   * Expose Flash Sale products (discounted products)
   */
  async getFlashSaleProducts(): Promise<Product[]> {
    if (!featureFlags.enableMockApi) {
      const raw = await request.get<RawProduct[]>('/products/flash-sales');
      return productsMapper.mapToProductsList(raw);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    const raw = MOCK_PRODUCTS.filter((p) => p.salePrice && p.salePrice < p.price && p.isActive);
    return productsMapper.mapToProductsList(raw);
  },

  /**
   * Expose related products within same category
   */
  async getRelatedProducts(productId: string): Promise<Product[]> {
    if (!featureFlags.enableMockApi) {
      const raw = await request.get<RawProduct[]>(`/products/${productId}/related`);
      return productsMapper.mapToProductsList(raw);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    const target = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!target) return [];
    const raw = MOCK_PRODUCTS.filter(
      (p) => p.categoryId === target.categoryId && p.id !== productId && p.isActive
    ).slice(0, 4);
    return productsMapper.mapToProductsList(raw);
  },

  /**
   * Fetch products matching a list of IDs
   */
  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (!ids || ids.length === 0) return [];
    if (!featureFlags.enableMockApi) {
      const raw = await request.post<RawProduct[]>('/products/batch', { ids });
      return productsMapper.mapToProductsList(raw);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const raw = MOCK_PRODUCTS.filter((p) => ids.includes(p.id) && p.isActive);
    return productsMapper.mapToProductsList(raw);
  },

  /**
   * Fetch active categories list
   */
  async getCategories(): Promise<Category[]> {
    return categoriesService.getCategories();
  },
};

export default productsService;
