import { Coupon } from '@/types/domain';
import { MOCK_COUPONS } from './coupon.mock';

/**
 * Service to manage validation checks for shopping coupons and discount calculations.
 */
export const couponService = {
  /**
   * Validates a coupon code against a subtotal (simulating API fetch)
   */
  async validateCoupon(code: string, subtotal: number): Promise<Coupon> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const normalizedCode = code.toUpperCase().trim();
    const matched = MOCK_COUPONS.find((c) => c.code === normalizedCode);

    if (!matched) {
      throw new Error('رمز الكوبون غير صحيح أو انتهت صلاحيته');
    }

    if (matched.minOrderValue !== undefined && subtotal < matched.minOrderValue) {
      throw new Error(`الكوبون يتطلب حد أدنى للطلب بقيمة ${matched.minOrderValue} ر.س`);
    }

    return { ...matched };
  },
};

export default couponService;
