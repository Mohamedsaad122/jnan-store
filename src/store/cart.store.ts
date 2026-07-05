import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '@/types/domain';

export interface CartItemState {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItemState[];
  isOpen: boolean;
  appliedCoupon: Coupon | null;
  totalAmount: number; // Pre-calculated total for backward-compatibility
  totalQuantity: number; // Pre-calculated count for backward-compatibility

  // Actions
  setOpen: (isOpen: boolean) => void;
  addItem: (item: Omit<CartItemState, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;

  // Getters
  getItemsCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  reset: () => void;
}

// Helper to calculate totals for state updates
const calculateTotals = (items: CartItemState[], coupon: Coupon | null) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Discount
  let discount = 0;
  if (coupon) {
    const isMinOrderSatisfied = !coupon.minOrderValue || subtotal >= coupon.minOrderValue;
    if (isMinOrderSatisfied) {
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
      discount = Math.min(discount, subtotal);
    }
  }

  const shipping = subtotal > 0 && subtotal >= 200 ? 0 : subtotal > 0 ? 15 : 0;
  const tax = Math.max(0, (subtotal - discount) * 0.15); // Saudi VAT 15%
  const totalAmount = Math.max(0, subtotal - discount + shipping + tax);

  return {
    totalQuantity,
    totalAmount,
  };
};

/**
 * Global Zustand store managing the shopping cart items, drawer visibility,
 * applied coupons, and automatic VAT, shipping, and total calculations.
 * Persists the cart items state to localStorage automatically.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      totalAmount: 0,
      totalQuantity: 0,

      setOpen: (isOpen) => set({ isOpen }),

      addItem: (newItem) => {
        const { items, appliedCoupon } = get();
        const qtyToAdd = newItem.quantity || 1;
        const existingIdx = items.findIndex((item) => item.productId === newItem.productId);

        let updatedItems: CartItemState[];
        if (existingIdx > -1) {
          updatedItems = [...items];
          updatedItems[existingIdx] = {
            ...updatedItems[existingIdx],
            quantity: updatedItems[existingIdx].quantity + qtyToAdd,
          };
        } else {
          updatedItems = [...items, { ...newItem, quantity: qtyToAdd }];
        }

        const totals = calculateTotals(updatedItems, appliedCoupon);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      removeItem: (productId) => {
        const { items, appliedCoupon } = get();
        const updatedItems = items.filter((item) => item.productId !== productId);
        const totals = calculateTotals(updatedItems, appliedCoupon);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      updateQuantity: (productId, quantity) => {
        const { items, appliedCoupon } = get();
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updatedItems = items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        const totals = calculateTotals(updatedItems, appliedCoupon);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      clearCart: () => {
        set({
          items: [],
          appliedCoupon: null,
          totalAmount: 0,
          totalQuantity: 0,
        });
      },

      applyCoupon: (coupon) => {
        const { items } = get();
        const totals = calculateTotals(items, coupon);
        set({
          appliedCoupon: coupon,
          ...totals,
        });
      },

      removeCoupon: () => {
        const { items } = get();
        const totals = calculateTotals(items, null);
        set({
          appliedCoupon: null,
          ...totals,
        });
      },

      // Getter functions
      getItemsCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const { appliedCoupon } = get();
        const subtotal = get().getSubtotal();
        if (!appliedCoupon) return 0;

        const isMinOrderSatisfied =
          !appliedCoupon.minOrderValue || subtotal >= appliedCoupon.minOrderValue;
        if (!isMinOrderSatisfied) return 0;

        let discount = 0;
        if (appliedCoupon.discountType === 'percentage') {
          discount = (subtotal * appliedCoupon.discountValue) / 100;
        } else {
          discount = appliedCoupon.discountValue;
        }
        if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
        return Math.min(discount, subtotal);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 200 ? 0 : 15;
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        return Math.max(0, (subtotal - discount) * 0.15);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        const tax = get().getTaxAmount();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      reset: () => {
        set({
          items: [],
          appliedCoupon: null,
          totalAmount: 0,
          totalQuantity: 0,
          isOpen: false,
        });
      },
    }),
    {
      name: 'jnan-cart-storage',
    }
  )
);

export default useCartStore;
