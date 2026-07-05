import { describe, it, expect } from 'vitest';
import couponService from './coupon.service';

describe('Coupon Service', () => {
  it('validates correct coupon code within limit successfully', async () => {
    // JNAN10 requires minimum 50
    const coupon = await couponService.validateCoupon('JNAN10', 120);
    expect(coupon.code).toBe('JNAN10');
    expect(coupon.discountValue).toBe(10);
    expect(coupon.discountType).toBe('percentage');
  });

  it('throws error when coupon code is invalid or missing', async () => {
    await expect(couponService.validateCoupon('INVALIDCODE', 120)).rejects.toThrow(
      'رمز الكوبون غير صحيح أو انتهت صلاحيته'
    );
  });

  it('throws error when order subtotal is below minimum order value requirements', async () => {
    // JNAN10 requires minimum 50. subtotal 40 should fail
    await expect(couponService.validateCoupon('JNAN10', 40)).rejects.toThrow(
      'الكوبون يتطلب حد أدنى للطلب بقيمة 50 ر.س'
    );
  });
});
