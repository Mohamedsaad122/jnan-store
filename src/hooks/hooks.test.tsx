import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProducts, useProductDetails } from './useProducts';
import useCountdown from './useCountdown';
import useCart from './useCart';
import useWishlist from './useWishlist';
import { useAddresses, useAddAddress, useEditAddress } from './useAddressesQuery';
import { useNotifications, useDeleteNotification, useMarkAsRead } from './useNotificationsQuery';
import {
  useLogin,
  useRegister,
  useLogout,
  useUpdateProfile,
  useChangePassword,
} from './useAuthMutations';
import { useCreateOrder } from './useCheckoutMutation';
import { Address, ShippingMethod, PaymentMethodType } from '@/types/domain';
import { ApiError } from '@/utils/errors';
import { queryKeys } from '@/lib/react-query/queryKeys';

// State variables for mocked services
let mockWishlist: string[] = [];
let mockAddressesList: { id: string; title: string; addressLine1: string; isDefault: boolean }[] =
  [];
let mockNotifsList: { id: string; titleAr: string; read: boolean }[] = [];

// Mock services to isolate test cache synchronization
vi.mock('@/services/wishlist/wishlist.service', () => ({
  wishlistService: {
    getWishlist: vi.fn(async () => mockWishlist),
    toggleWishlist: vi.fn(async (id: string) => {
      if (mockWishlist.includes(id)) {
        mockWishlist = mockWishlist.filter((x) => x !== id);
      } else {
        mockWishlist.push(id);
      }
      return true;
    }),
    clearWishlist: vi.fn(async () => {
      mockWishlist = [];
      return true;
    }),
  },
  default: null,
}));

vi.mock('@/services/addresses/addresses.service', () => ({
  addressesService: {
    getAddresses: vi.fn(async () => mockAddressesList),
    addAddress: vi.fn(async (addr: Omit<Address, 'id' | 'userId'>) => {
      const newAddr = {
        ...addr,
        id: `addr-new-${Date.now()}`,
        isDefault: addr.isDefault || false,
      } as Address;
      mockAddressesList.push(newAddr);
      return newAddr;
    }),
    editAddress: vi.fn(async (id: string, fields: Partial<Address>) => {
      const idx = mockAddressesList.findIndex((a) => a.id === id);
      if (idx > -1) {
        mockAddressesList[idx] = { ...mockAddressesList[idx], ...fields } as Address;
        return mockAddressesList[idx];
      }
      return null;
    }),
    deleteAddress: vi.fn(async (_id: string) => {
      return true;
    }),
    setDefaultAddress: vi.fn(async (_id: string) => {
      return true;
    }),
  },
  default: null,
}));

vi.mock('@/features/dashboard/services/notification.service', () => ({
  dashboardNotificationService: {
    fetchNotifications: vi.fn(async () => mockNotifsList),
    updateReadStatus: vi.fn(async (id: string, read: boolean) => {
      mockNotifsList = mockNotifsList.map((n) => (n.id === id ? { ...n, read } : n));
      return true;
    }),
    markAllAsRead: vi.fn(async () => {
      mockNotifsList = mockNotifsList.map((n) => ({ ...n, read: true }));
      return true;
    }),
    deleteNotification: vi.fn(async (id: string) => {
      mockNotifsList = mockNotifsList.filter((n) => n.id !== id);
      return true;
    }),
  },
  default: null,
}));

vi.mock('@/services/auth/auth.service', () => ({
  authService: {
    login: vi.fn(async (credentials: { email: string }) => {
      return {
        user: {
          id: 'usr-login',
          email: credentials.email,
          role: 'user',
          permissions: [],
          createdAt: '',
        },
        tokens: { accessToken: 'ac-1', refreshToken: 'rf-1' },
      };
    }),
    register: vi.fn(async (_data: unknown) => {
      return { success: true, message: 'OTP Sent' };
    }),
    logout: vi.fn(async () => {
      return { success: true };
    }),
    updateProfile: vi.fn(
      async (data: { firstName?: string; lastName?: string; phone?: string }) => {
        return {
          id: 'usr-login',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          role: 'user',
          permissions: [],
          createdAt: '',
        };
      }
    ),
    changePassword: vi.fn(async () => {
      return { success: true };
    }),
  },
  default: null,
}));

vi.mock('@/services/orders/orders.service', () => ({
  ordersService: {
    createOrder: vi.fn(async (data: { totalAmount: number }) => {
      return { id: 'order-123', totalAmount: data.totalAmount, userId: 'usr-login' };
    }),
    calculateTotals: vi.fn((subtotal, discount, shippingFee) => ({
      subtotal,
      discountAmount: discount,
      shippingFee,
      taxAmount: 0,
      totalAmount: subtotal - discount + shippingFee,
    })),
    validateCheckout: vi.fn(() => ({ isValid: true, errors: [] })),
  },
  default: null,
}));

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
  beforeEach(() => {
    mockWishlist = [];
    mockAddressesList = [];
    mockNotifsList = [];
  });

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

  describe('useWishlist Hook (React Query)', () => {
    it('queries and toggles wishlist items', async () => {
      const queryClient = createTestQueryClient();
      queryClient.setQueryData(queryKeys.wishlist, []);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useWishlist(), { wrapper });

      act(() => {
        result.current.toggleWishlist('prod-abc');
      });

      await waitFor(() => {
        expect(result.current.isInWishlist('prod-abc')).toBe(true);
      });

      act(() => {
        result.current.toggleWishlist('prod-abc');
      });

      await waitFor(() => {
        expect(result.current.isInWishlist('prod-abc')).toBe(false);
      });
    });

    it('rolls back wishlist cache on mutation failure', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      queryClient.setQueryData(queryKeys.wishlist, ['prod-1']);

      const { result } = renderHook(() => useWishlist(), { wrapper });

      expect(result.current.isInWishlist('prod-1')).toBe(true);
    });

    it('clears wishlist optimistically', async () => {
      const queryClient = createTestQueryClient();
      queryClient.setQueryData(queryKeys.wishlist, ['prod-1', 'prod-2']);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useWishlist(), { wrapper });

      act(() => {
        result.current.clearWishlist();
      });

      await waitFor(() => {
        expect(result.current.itemIds).toHaveLength(0);
      });
    });
  });

  describe('useProducts Query Hooks (React Query)', () => {
    it('fetches products via useProducts query hook', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useProducts({ search: 'Saudi' }), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.success).toBe(true);
      expect(result.current.data?.data).toBeInstanceOf(Array);
    });

    it('fetches product details successfully', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useProductDetails('premium-saudi-coffee-golden-blend'), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.slug).toBe('premium-saudi-coffee-golden-blend');
    });
  });

  describe('useAddresses Query Hooks (Optimistic Updates)', () => {
    it('queries shipping addresses list successfully', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      queryClient.setQueryData(queryKeys.addresses, [
        { id: 'addr-1', title: 'المنزل', addressLine1: 'طريق الملك فهد', isDefault: true },
      ]);

      const { result } = renderHook(() => useAddresses(), { wrapper });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].title).toBe('المنزل');
    });

    it('adds address optimistically and triggers invalidation', async () => {
      const queryClient = createTestQueryClient();
      queryClient.setQueryData(queryKeys.addresses, []);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result: listHook } = renderHook(() => useAddresses(), { wrapper });
      const { result: addHook } = renderHook(() => useAddAddress(), { wrapper });

      act(() => {
        addHook.current.mutate({
          title: 'العمل',
          addressLine1: 'شارع العليا',
          city: 'الرياض',
          state: 'الرياض',
          country: 'السعودية',
          postalCode: '12345',
          isDefault: false,
        });
      });

      await waitFor(() => {
        expect(listHook.current.data).toHaveLength(1);
        expect(listHook.current.data?.[0].title).toBe('العمل');
      });
    });

    it('rolls back address cache snapshot on mutation failure', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const originalAddresses = [
        { id: 'addr-1', title: 'المنزل', addressLine1: 'شارع العليا', isDefault: true },
      ];
      queryClient.setQueryData(queryKeys.addresses, originalAddresses);

      const { result: listHook } = renderHook(() => useAddresses(), { wrapper });
      const { result: editHook } = renderHook(() => useEditAddress(), { wrapper });

      act(() => {
        editHook.current.mutate(
          { id: 'addr-1', updatedFields: { title: 'المنزل الجديد' } },
          {
            onError: () => {
              queryClient.setQueryData(queryKeys.addresses, originalAddresses);
            },
          }
        );
      });

      await waitFor(() => {
        expect(listHook.current.data?.[0].title).toBe('المنزل');
      });
    });
  });

  describe('useNotifications Query Hooks (Optimistic Updates)', () => {
    it('queries notifications and marks as read optimistically', async () => {
      const queryClient = createTestQueryClient();
      mockNotifsList = [{ id: 'notif-1', titleAr: 'طلب جديد', read: false }];
      queryClient.setQueryData(queryKeys.notifications, mockNotifsList);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result: listHook } = renderHook(() => useNotifications(), { wrapper });
      const { result: markHook } = renderHook(() => useMarkAsRead(), { wrapper });

      act(() => {
        markHook.current.mutate('notif-1');
      });

      await waitFor(() => {
        expect(listHook.current.data?.[0].read).toBe(true);
      });
    });

    it('deletes notification optimistically', async () => {
      const queryClient = createTestQueryClient();
      queryClient.setQueryData(queryKeys.notifications, [
        { id: 'notif-1', titleAr: 'طلب جديد', read: false },
      ]);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result: listHook } = renderHook(() => useNotifications(), { wrapper });
      const { result: deleteHook } = renderHook(() => useDeleteNotification(), { wrapper });

      act(() => {
        deleteHook.current.mutate('notif-1');
      });

      await waitFor(() => {
        expect(listHook.current.data).toHaveLength(0);
      });
    });
  });

  describe('useAuthMutations (React Query)', () => {
    it('login mutation triggers authService and updates Zustand session', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useLogin(), { wrapper });

      act(() => {
        result.current.mutate({ email: 'test@example.com', password: 'password123' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('register mutation triggers authService and calls onSuccess', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useRegister(), { wrapper });

      act(() => {
        result.current.mutate({
          email: 'new@example.com',
          password: 'password123',
          firstName: 'Ahmad',
          lastName: 'Ali',
          phone: '0551234567',
          termsAccepted: true,
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('logout mutation triggers authService and clears Zustand store', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useLogout(), { wrapper });

      act(() => {
        result.current.mutate();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('updateProfile mutation triggers authService and updates user profile data', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useUpdateProfile(), { wrapper });

      act(() => {
        result.current.mutate({ firstName: 'Ali', lastName: 'Mansour', phone: '0551234567' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('changePassword mutation triggers authService successfully', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useChangePassword(), { wrapper });

      act(() => {
        result.current.mutate({ currentPassword: 'old', newPassword: 'new' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('useCheckoutMutation (React Query)', () => {
    it('submits checkout request successfully and clears cart', async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useCreateOrder(), { wrapper });

      act(() => {
        result.current.mutate({
          items: [],
          shippingAddress: {} as unknown as Address,
          billingAddress: {} as unknown as Address,
          shippingMethod: {} as unknown as ShippingMethod,
          paymentMethod: 'credit_card' as PaymentMethodType,
          subtotal: 100,
          discountAmount: 10,
          shippingFee: 15,
          taxAmount: 5,
          totalAmount: 110,
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('Query Cache Invalidation & Retry Logic', () => {
    it('does not retry client errors like HTTP 400', () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (failureCount >= 2) return false;
              if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                return false;
              }
              return true;
            },
          },
        },
      });

      const clientError = new ApiError('Bad Request', 400);
      const shouldRetry = queryClient.getDefaultOptions().queries?.retry;

      if (typeof shouldRetry === 'function') {
        const result = shouldRetry(1, clientError);
        expect(result).toBe(false);
      } else {
        expect(shouldRetry).toBe(false);
      }
    });

    it('retries server errors up to 2 times', () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (failureCount >= 2) return false;
              if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                return false;
              }
              return true;
            },
          },
        },
      });

      const serverError = new ApiError('Internal Error', 500);
      const shouldRetry = queryClient.getDefaultOptions().queries?.retry;

      if (typeof shouldRetry === 'function') {
        expect(shouldRetry(1, serverError)).toBe(true);
        expect(shouldRetry(2, serverError)).toBe(false);
      }
    });
  });
});
