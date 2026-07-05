import { Coupon } from '@/types/domain';

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'cp-jnan10',
    code: 'JNAN10',
    discountType: 'percentage',
    discountValue: 10, // 10% off
    minOrderValue: 50, // minimum 50 SAR
    maxDiscount: 100, // cap at 100 SAR
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days active
    isActive: true,
  },
  {
    id: 'cp-welcome50',
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50, // 50 SAR off
    minOrderValue: 150,
    maxDiscount: 50,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days active
    isActive: true,
  },
];

export default MOCK_COUPONS;
