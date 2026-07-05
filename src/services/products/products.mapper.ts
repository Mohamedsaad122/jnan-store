import { Product, ProductImage, ProductVariant, Review } from '@/types/domain';
import { RawProduct, MOCK_CATEGORIES, MOCK_BRANDS, MOCK_REVIEWS } from './products.mock';

export const productsMapper = {
  /**
   * Maps a string image URL array to ProductImage domain models
   */
  mapToProductImages(urls: string[], productName: string): ProductImage[] {
    return urls.map((url, idx) => ({
      id: `${productName.toLowerCase().replace(/\s+/g, '-')}-img-${idx}`,
      url,
      altAr: `صورة ${productName}`,
      altEn: `Image of ${productName}`,
      isPrimary: idx === 0,
    }));
  },

  /**
   * Maps raw variant objects to ProductVariant domain models,
   * falls back to creating a default single variant if none are specified
   */
  mapToProductVariants(
    productId: string,
    rawVariants?: RawProduct['variants'],
    baseProduct?: {
      price: number;
      salePrice?: number;
      stock: number;
      sku: string;
      weightQuantity?: string;
    }
  ): ProductVariant[] {
    if (rawVariants && rawVariants.length > 0) {
      return rawVariants.map((v) => ({
        id: v.id,
        productId,
        nameAr: v.nameAr,
        nameEn: v.nameEn,
        price: v.price,
        salePrice: v.salePrice,
        stock: v.stock,
        sku: v.sku,
        attributes: v.attributes,
      }));
    }

    // Default variant fallback
    return [
      {
        id: `${productId}-default-var`,
        productId,
        nameAr: baseProduct?.weightQuantity || 'افتراضي',
        nameEn: baseProduct?.weightQuantity || 'Default',
        price: baseProduct?.price || 0,
        salePrice: baseProduct?.salePrice,
        stock: baseProduct?.stock || 0,
        sku: baseProduct?.sku || `VAR-${productId}`,
        attributes: { weight: baseProduct?.weightQuantity || '1 Unit' },
      },
    ];
  },

  /**
   * Transforms raw product data into the Product domain model
   */
  mapToProduct(raw: RawProduct): Product {
    const category = MOCK_CATEGORIES.find((c) => c.id === raw.categoryId);
    const brand = MOCK_BRANDS.find((b) => b.id === raw.brandId);

    // Map reviews belonging to this product
    const productReviews: Review[] = MOCK_REVIEWS.filter(
      (r) => r.productId === raw.id && r.isApproved
    ).map((r) => ({
      id: r.id,
      productId: r.productId,
      userId: r.userId,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      isApproved: r.isApproved,
      createdAt: r.createdAt,
    }));

    return {
      id: raw.id,
      nameAr: raw.nameAr,
      nameEn: raw.nameEn,
      slug: raw.slug,
      descriptionAr: raw.descriptionAr,
      descriptionEn: raw.descriptionEn,
      price: raw.price,
      salePrice: raw.salePrice,
      images: this.mapToProductImages(raw.imageUrls, raw.nameEn),
      categoryId: raw.categoryId,
      category: category ? { ...category } : undefined,
      brandId: raw.brandId,
      brand: brand ? { ...brand } : undefined,
      sku: raw.sku,
      stock: raw.stock,
      weightQuantity: raw.weightQuantity,
      rating: raw.rating,
      reviewsCount: raw.reviewsCount,
      isActive: raw.isActive,
      isFeatured: raw.isFeatured,
      variants: this.mapToProductVariants(raw.id, raw.variants, raw),
      reviews: productReviews,
      specifications: raw.specifications || {},
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  /**
   * Transform a collection of raw products
   */
  mapToProductsList(rawList: RawProduct[]): Product[] {
    return rawList.map((raw) => this.mapToProduct(raw));
  },
};

export default productsMapper;
