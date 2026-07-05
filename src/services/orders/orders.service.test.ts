import { describe, it, expect } from 'vitest';
import ordersService from './orders.service';
import { mockShippingAddress } from '@/test/fixtures';

describe('Orders Service', () => {
  it('calculates totals with 15% Saudi VAT correctly', () => {
    // subtotal 100, discount 10, shipping 15
    // net = 90. VAT = 90 * 0.15 = 13.5. Total = 90 + 15 + 13.5 = 118.5
    const totals = ordersService.calculateTotals(100, 10, 15);
    expect(totals.taxAmount).toBe(13.5);
    expect(totals.totalAmount).toBe(118.5);
  });

  it('validates checkout parameters correctly', () => {
    const validResult = ordersService.validateCheckout({
      shippingAddress: mockShippingAddress,
      shippingMethod: {
        id: '1',
        nameAr: 'شحن سريع',
        nameEn: 'Express',
        cost: 15,
        descriptionAr: '',
        descriptionEn: '',
        estimatedDeliveryAr: '',
        estimatedDeliveryEn: '',
      },
      paymentMethod: 'card',
      itemsCount: 2,
    });
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toHaveLength(0);

    const invalidResult = ordersService.validateCheckout({
      itemsCount: 0,
    });
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContain('السلة فارغة. يرجى إضافة منتجات لإتمام الطلب.');
  });

  it('creates order details with mock latency', async () => {
    const params = {
      items: [
        {
          id: '1',
          productId: 'prod-yemen-123',
          productNameAr: 'بن اليمن',
          productNameEn: 'Yemen Coffee',
          quantity: 1,
          price: 120,
        },
      ],
      shippingAddress: mockShippingAddress,
      shippingMethod: {
        id: '1',
        nameAr: 'شحن سريع',
        nameEn: 'Express',
        cost: 15,
        descriptionAr: '',
        descriptionEn: '',
        estimatedDeliveryAr: '',
        estimatedDeliveryEn: '',
      },
      paymentMethod: 'card' as const,
      subtotal: 120,
      discountAmount: 0,
      shippingFee: 15,
      taxAmount: 18,
      totalAmount: 153,
    };

    const order = await ordersService.createOrder(params);
    expect(order.id).toBeDefined();
    expect(order.orderNumber).toMatch(/^JN-\d+$/);
    expect(order.status).toBe('pending');
  });
});
