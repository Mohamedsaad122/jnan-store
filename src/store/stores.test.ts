import { describe, it, expect, beforeEach } from 'vitest';
import useCartStore from './cart.store';
import useAuthStore from './auth.store';
import useWishlistStore from './wishlist.store';
import useAddressStore from './address.store';
import { mockUser, mockCoupons } from '@/test/fixtures';

describe('Zustand Stores', () => {
  // Reset all stores before each test to maintain isolation
  beforeEach(() => {
    useCartStore.getState().reset();
    useAuthStore.getState().reset();
    useWishlistStore.getState().reset();
    useAddressStore.getState().reset();
  });

  describe('useCartStore', () => {
    it('initializes with empty items', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.totalQuantity).toBe(0);
      expect(state.totalAmount).toBe(0);
    });

    it('adds an item and updates totals correctly', () => {
      useCartStore.getState().addItem({
        productId: 'prod-1',
        name: 'بن خولاني',
        price: 150,
        imageUrl: '',
      });

      let state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe('prod-1');
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalQuantity).toBe(1);
      expect(state.totalAmount).toBe(187.5); // 150 + 15 shipping + 22.5 VAT

      // Add same item again to increment quantity
      useCartStore.getState().addItem({
        productId: 'prod-1',
        name: 'بن خولاني',
        price: 150,
        imageUrl: '',
      });

      state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalQuantity).toBe(2);
      expect(state.totalAmount).toBe(345); // 300 + 0 shipping (free >= 200) + 45 VAT
    });

    it('updates quantity of items directly', () => {
      useCartStore.getState().addItem({
        productId: 'prod-1',
        name: 'بن خولاني',
        price: 150,
      });

      useCartStore.getState().updateQuantity('prod-1', 5);
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
      expect(state.totalQuantity).toBe(5);
      expect(state.totalAmount).toBe(862.5); // 750 + 0 shipping (free > 500) + 112.5 VAT
    });

    it('removes items and recalculates totals', () => {
      useCartStore.getState().addItem({
        productId: 'prod-1',
        name: 'بن خولاني',
        price: 150,
      });
      useCartStore.getState().addItem({
        productId: 'prod-2',
        name: 'أداة تقطير',
        price: 90,
      });

      useCartStore.getState().removeItem('prod-1');
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe('prod-2');
      expect(state.totalAmount).toBe(118.5); // 90 + 15 shipping + 13.5 VAT
    });

    it('applies and removes valid coupons correctly', () => {
      useCartStore.getState().addItem({
        productId: 'prod-1',
        name: 'بن خولاني',
        price: 150,
      });

      // Apply JNAN10 (10% percentage discount, min value 100)
      useCartStore.getState().applyCoupon(mockCoupons[0]);
      let state = useCartStore.getState();
      expect(state.appliedCoupon).toEqual(mockCoupons[0]);
      expect(state.getDiscountAmount()).toBe(15);
      expect(state.getTotal()).toBe(150 - 15 + 15 + 20.25); // subtotal - discount + shipping + tax

      // Remove coupon
      useCartStore.getState().removeCoupon();
      state = useCartStore.getState();
      expect(state.appliedCoupon).toBeNull();
      expect(state.getDiscountAmount()).toBe(0);
    });
  });

  describe('useAuthStore', () => {
    it('logs in a user session and updates auth variables', () => {
      const tokens = {
        accessToken: 'access-111',
        refreshToken: 'refresh-222',
      };

      useAuthStore.getState().login(mockUser, tokens);
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('access-111');
      expect(state.role).toBe('user');
    });

    it('clears state on logout', () => {
      const tokens = {
        accessToken: 'access-111',
        refreshToken: 'refresh-222',
      };
      useAuthStore.getState().login(mockUser, tokens);
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
    });
  });

  describe('useAddressStore', () => {
    it('starts with initial seeded addresses', () => {
      const state = useAddressStore.getState();
      expect(state.addresses.length).toBeGreaterThan(0);
    });

    it('adds a new address and shifts default state if specified', () => {
      const newAddress = {
        title: 'العمل الثاني',
        addressLine1: 'شارع التخصصي',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
        isDefault: true,
      };

      useAddressStore.getState().addAddress(newAddress);
      const state = useAddressStore.getState();
      const added = state.addresses.find((a) => a.title === 'العمل الثاني');
      expect(added).toBeDefined();
      expect(added?.isDefault).toBe(true);

      // Verification that previous default got demoted
      const oldDefault = state.addresses.find((a) => a.id === 'addr-riyadh-home');
      expect(oldDefault?.isDefault).toBe(false);
    });

    it('deletes an address and promotes first remaining to default if default deleted', () => {
      const defaultId = 'addr-riyadh-home';
      useAddressStore.getState().deleteAddress(defaultId);
      const state = useAddressStore.getState();

      expect(state.addresses.find((a) => a.id === defaultId)).toBeUndefined();
      // Jeddah work (id: addr-jeddah-work) should now be promoted to default
      const jeddah = state.addresses.find((a) => a.id === 'addr-jeddah-work');
      expect(jeddah?.isDefault).toBe(true);
    });
  });
});
