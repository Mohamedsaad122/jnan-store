import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cart.store';
import { useAuthStore } from './auth.store';
import { useAddressStore } from './address.store';
import { User, AuthTokens } from '@/features/auth/types';

describe('Zustand Stores', () => {
  describe('useCartStore', () => {
    beforeEach(() => {
      useCartStore.getState().reset();
    });

    it('initializes with empty items', () => {
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalQuantity).toBe(0);
      expect(state.totalAmount).toBe(0);
    });

    it('adds an item and updates totals correctly', () => {
      useCartStore.getState().addItem({
        productId: 'prod-honey-1',
        name: 'Premium Honey',
        price: 120,
        imageUrl: '',
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalQuantity).toBe(1);
      // Subtotal (120) + Tax (15% of 120 = 18) + Shipping (15 because subtotal < 200) = 153
      expect(state.totalAmount).toBe(153);
    });

    it('updates quantity of items directly', () => {
      useCartStore.getState().addItem({
        productId: 'prod-honey-1',
        name: 'Premium Honey',
        price: 120,
      });

      useCartStore.getState().updateQuantity('prod-honey-1', 3);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(3);
      expect(state.totalQuantity).toBe(3);
    });

    it('removes items and recalculates totals', () => {
      useCartStore.getState().addItem({
        productId: 'prod-honey-1',
        name: 'Premium Honey',
        price: 120,
      });

      useCartStore.getState().removeItem('prod-honey-1');

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalQuantity).toBe(0);
      expect(state.totalAmount).toBe(0);
    });

    it('applies and removes valid coupons correctly', () => {
      useCartStore.getState().addItem({
        productId: 'prod-honey-1',
        name: 'Premium Honey',
        price: 100,
      });

      useCartStore.getState().applyCoupon({
        id: 'c-1',
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        isActive: true,
        startDate: '',
        endDate: '',
      });

      let state = useCartStore.getState();
      expect(state.appliedCoupon).not.toBeNull();
      expect(state.appliedCoupon?.code).toBe('SAVE10');

      useCartStore.getState().removeCoupon();
      state = useCartStore.getState();
      expect(state.appliedCoupon).toBeNull();
    });

    it('correctly applies max discount limits for coupons', () => {
      useCartStore.getState().addItem({
        productId: 'prod-honey-expensive',
        name: 'Premium Expensive Honey',
        price: 1000,
      });

      useCartStore.getState().applyCoupon({
        id: 'c-max-discount',
        code: 'SAVE50',
        discountType: 'percentage',
        discountValue: 50,
        maxDiscount: 100,
        isActive: true,
        startDate: '',
        endDate: '',
      });

      const state = useCartStore.getState();
      expect(state.getDiscountAmount()).toBe(100);
    });

    it('removes item if updated quantity is set below zero', () => {
      useCartStore.getState().addItem({
        productId: 'prod-honey-1',
        name: 'Premium Honey',
        price: 120,
      });

      useCartStore.getState().updateQuantity('prod-honey-1', -5);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('useAuthStore', () => {
    beforeEach(() => {
      useAuthStore.getState().reset();
    });

    it('logs in a user session and updates auth variables', () => {
      const mockUser: User = {
        id: 'usr-444',
        firstName: 'سارة',
        lastName: 'أحمد',
        email: 'sara@example.com',
        role: 'user',
        permissions: ['read:products'],
        createdAt: '',
      };

      const mockTokens: AuthTokens = {
        accessToken: 'at-token-444',
        refreshToken: 'rt-token-444',
      };

      useAuthStore.getState().login(mockUser, mockTokens);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe('sara@example.com');
      expect(state.accessToken).toBe('at-token-444');
    });

    it('correctly updates user profile, roles and permissions via setUser', () => {
      const mockUser: User = {
        id: 'usr-444',
        firstName: 'أحمد',
        lastName: 'خالد',
        email: 'ahmad@example.com',
        role: 'user',
        permissions: ['read:products'],
        createdAt: '',
      };
      useAuthStore.getState().setUser(mockUser);
      const state = useAuthStore.getState();
      expect(state.user?.firstName).toBe('أحمد');
      expect(state.role).toBe('user');
      expect(state.permissions).toContain('read:products');
    });
  });

  describe('useAddressStore (UI states)', () => {
    beforeEach(() => {
      useAddressStore.getState().closeModal();
    });

    it('starts with modal closed and no edit targets', () => {
      const state = useAddressStore.getState();
      expect(state.isModalOpen).toBe(false);
      expect(state.editingAddress).toBeNull();
    });

    it('opens add modal with clean details', () => {
      useAddressStore.getState().openAddModal();

      const state = useAddressStore.getState();
      expect(state.isModalOpen).toBe(true);
      expect(state.editingAddress).toBeNull();
    });

    it('opens edit modal with targeted address data', () => {
      const targetAddress = {
        id: 'addr-riyadh',
        userId: 'usr-123',
        title: 'منزل الرياض',
        addressLine1: 'شارع التخصصي',
        city: 'الرياض',
        state: 'الرياض',
        country: 'السعودية',
        postalCode: '11223',
        isDefault: true,
      };

      useAddressStore.getState().openEditModal(targetAddress);

      const state = useAddressStore.getState();
      expect(state.isModalOpen).toBe(true);
      expect(state.editingAddress).toBe(targetAddress);
    });

    it('resets modal status on close', () => {
      useAddressStore.getState().openAddModal();
      useAddressStore.getState().closeModal();

      const state = useAddressStore.getState();
      expect(state.isModalOpen).toBe(false);
      expect(state.editingAddress).toBeNull();
    });
  });
});
