import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProducts, useProductDetails } from './useProducts';
import useCountdown from './useCountdown';
import useCart from './useCart';
import useWishlist from './useWishlist';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });

describe('Custom Hooks', () => {
  describe('useCountdown Hook', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('calculates remaining duration correctly and ticks down', () => {
      const target = Date.now() + 5000;
      const { result } = renderHook(() => useCountdown(target));

      expect(result.current.isExpired).toBe(false);
      expect(result.current.seconds).toBe(5);

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current.seconds).toBe(3);

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(result.current.isExpired).toBe(true);
    });
  });

  describe('useCart Hook', () => {
    it('manages cart actions correctly', () => {
      const { result } = renderHook(() => useCart());

      // Pre-clear cart
      act(() => {
        result.current.clearCart();
      });
      expect(result.current.items).toHaveLength(0);

      // Add item
      act(() => {
        result.current.addItem({
          productId: 'item-1',
          name: 'كوب قهوة',
          price: 15,
          imageUrl: '',
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(1);
      expect(result.current.totalQuantity).toBe(1);

      // Update quantity
      act(() => {
        result.current.updateQuantity('item-1', 3);
      });
      expect(result.current.items[0].quantity).toBe(3);

      // Remove item
      act(() => {
        result.current.removeItem('item-1');
      });
      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('useWishlist Hook', () => {
    it('manages wishlist collection states', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.setItemIds([]);
      });
      expect(result.current.isInWishlist('prod-1')).toBe(false);

      // Toggle add
      act(() => {
        result.current.toggleWishlist('prod-1');
      });
      expect(result.current.isInWishlist('prod-1')).toBe(true);

      // Toggle remove
      act(() => {
        result.current.toggleWishlist('prod-1');
      });
      expect(result.current.isInWishlist('prod-1')).toBe(false);
    });
  });

  describe('useProducts Query Hooks (React Query)', () => {
    it('fetches products via useProducts query hook', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      // Search 'Saudi' to match 'Premium Saudi Coffee - Golden Blend' from products mock
      const { result } = renderHook(() => useProducts({ search: 'Saudi' }), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.success).toBe(true);
      expect(result.current.data?.data).toBeInstanceOf(Array);
      expect(result.current.data?.data.length).toBeGreaterThan(0);
    });

    it('fetches product details successfully', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      // 'premium-saudi-coffee-golden-blend' matches the slug in mock products
      const { result } = renderHook(() => useProductDetails('premium-saudi-coffee-golden-blend'), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.slug).toBe('premium-saudi-coffee-golden-blend');
    });
  });
});
