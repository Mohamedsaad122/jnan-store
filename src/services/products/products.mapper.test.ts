import { describe, it, expect } from 'vitest';
import productsMapper from './products.mapper';
import { RawProduct } from './products.mock';

describe('Products Mapper', () => {
  const dummyRawProduct: RawProduct = {
    id: 'prod-dummy',
    nameAr: 'منتج تجريبي',
    nameEn: 'Dummy Product',
    slug: 'dummy-product',
    descriptionAr: 'الوصف التجريبي للمنتج',
    descriptionEn: 'The dummy description',
    price: 150.0,
    salePrice: 130.0,
    imageUrls: ['/images/dummy.jpg'],
    categoryId: 'cat-coffee',
    brandId: 'brand-1',
    sku: 'DUM-001',
    stock: 20,
    weightQuantity: '500g',
    rating: 4.5,
    reviewsCount: 1,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-06-01T12:00:00.000Z',
    updatedAt: '2026-06-01T12:00:00.000Z',
  };

  it('maps raw product values to Product domain model correctly', () => {
    const product = productsMapper.mapToProduct(dummyRawProduct);

    expect(product.id).toBe('prod-dummy');
    expect(product.nameAr).toBe('منتج تجريبي');
    expect(product.nameEn).toBe('Dummy Product');
    expect(product.images).toHaveLength(1);
    expect(product.images[0].url).toBe('/images/dummy.jpg');
    expect(product.images[0].isPrimary).toBe(true);
    expect(product.variants).toHaveLength(1);
    expect(product.variants[0].price).toBe(150.0);
    expect(product.variants[0].salePrice).toBe(130.0);
  });

  it('builds primary image alt texts correctly based on language templates', () => {
    const imageList = productsMapper.mapToProductImages(['/img.jpg'], 'Espresso Maker');
    expect(imageList).toHaveLength(1);
    expect(imageList[0].altAr).toBe('صورة Espresso Maker');
    expect(imageList[0].altEn).toBe('Image of Espresso Maker');
  });

  it('generates fallback default variants when none are specified in raw variants', () => {
    const variants = productsMapper.mapToProductVariants('prod-id', undefined, {
      price: 100,
      stock: 5,
      sku: 'SKU-001',
      weightQuantity: '250g',
    });

    expect(variants).toHaveLength(1);
    expect(variants[0].id).toBe('prod-id-default-var');
    expect(variants[0].attributes.weight).toBe('250g');
    expect(variants[0].price).toBe(100);
    expect(variants[0].stock).toBe(5);
  });
});
