import { describe, it, expect } from 'vitest';
import productsService from './products.service';

describe('Products Service', () => {
  it('fetches products list with default parameters', async () => {
    const response = await productsService.getProducts();
    expect(response.success).toBe(true);
    expect(response.data).toBeInstanceOf(Array);
    expect(response.pagination.page).toBe(1);
  });

  it('filters products by text search', async () => {
    // Yemen is a search term matching Yemen coffee
    const response = await productsService.getProducts({ search: 'Yemen' });
    expect(response.success).toBe(true);
    const matches = response.data.every(
      (p) =>
        p.nameEn.toLowerCase().includes('yemen') ||
        p.nameAr.includes('اليمن') ||
        p.descriptionEn.toLowerCase().includes('yemen') ||
        p.sku.toLowerCase().includes('yemen')
    );
    expect(matches).toBe(true);
  });

  it('filters products by price range', async () => {
    const minPrice = 80;
    const maxPrice = 110;
    const response = await productsService.getProducts({ minPrice, maxPrice });
    expect(response.success).toBe(true);
    response.data.forEach((p) => {
      const activePrice = p.salePrice ?? p.price;
      expect(activePrice).toBeGreaterThanOrEqual(minPrice);
      expect(activePrice).toBeLessThanOrEqual(maxPrice);
    });
  });

  it('sorts products by price ascending', async () => {
    const response = await productsService.getProducts({ sort: 'price_asc' });
    expect(response.success).toBe(true);
    const prices = response.data.map((p) => p.salePrice ?? p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  it('fetches product by ID', async () => {
    const response = await productsService.getProducts();
    const firstProduct = response.data[0];
    const fetched = await productsService.getProductById(firstProduct.id);
    expect(fetched).toBeDefined();
    expect(fetched?.id).toBe(firstProduct.id);
  });
});
