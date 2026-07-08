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
  savedForLater: CartItemState[];
  isOpen: boolean;
  appliedCoupon: Coupon | null;
  totalAmount: number; // Pre-calculated total for backward-compatibility
  totalQuantity: number; // Pre-calculated count for backward-compatibility
  giftWrap: boolean;
  giftMessage: string;

  // Actions
  setOpen: (isOpen: boolean) => void;
  addItem: (item: Omit<CartItemState, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;

  moveToSaved: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSaved: (productId: string) => void;
  setGiftOptions: (giftWrap: boolean, giftMessage: string) => void;

  // Getters
  getItemsCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTaxAmount: () => number;
  getGiftWrapFee: () => number;
  getTotal: () => number;
  reset: () => void;
}

// Helper to calculate totals for state updates
const calculateTotals = (items: CartItemState[], coupon: Coupon | null, giftWrap = false) => {
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
  const giftFee = giftWrap ? 10 : 0;
  const totalAmount = Math.max(0, subtotal - discount + shipping + tax + giftFee);

  return {
    totalQuantity,
    totalAmount,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      isOpen: false,
      appliedCoupon: null,
      totalAmount: 0,
      totalQuantity: 0,
      giftWrap: false,
      giftMessage: '',

      setOpen: (isOpen) => set({ isOpen }),

      addItem: (newItem) => {
        const { items, appliedCoupon, giftWrap } = get();
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

        const totals = calculateTotals(updatedItems, appliedCoupon, giftWrap);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      removeItem: (productId) => {
        const { items, appliedCoupon, giftWrap } = get();
        const updatedItems = items.filter((item) => item.productId !== productId);
        const totals = calculateTotals(updatedItems, appliedCoupon, giftWrap);
        set({
          items: updatedItems,
          ...totals,
        });
      },

      updateQuantity: (productId, quantity) => {
        const { items, appliedCoupon, giftWrap } = get();
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updatedItems = items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        const totals = calculateTotals(updatedItems, appliedCoupon, giftWrap);
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
          giftWrap: false,
          giftMessage: '',
        });
      },

      applyCoupon: (coupon) => {
        const { items, giftWrap } = get();
        const totals = calculateTotals(items, coupon, giftWrap);
        set({
          appliedCoupon: coupon,
          ...totals,
        });
      },

      removeCoupon: () => {
        const { items, giftWrap } = get();
        const totals = calculateTotals(items, null, giftWrap);
        set({
          appliedCoupon: null,
          ...totals,
        });
      },

      moveToSaved: (productId) => {
        const { items, savedForLater, appliedCoupon, giftWrap } = get();
        const target = items.find((item) => item.productId === productId);
        if (!target) return;

        const updatedItems = items.filter((item) => item.productId !== productId);
        const updatedSaved = [...savedForLater.filter((s) => s.productId !== productId), target];

        const totals = calculateTotals(updatedItems, appliedCoupon, giftWrap);
        set({
          items: updatedItems,
          savedForLater: updatedSaved,
          ...totals,
        });
      },

      moveToCart: (productId) => {
        const { items, savedForLater, appliedCoupon, giftWrap } = get();
        const target = savedForLater.find((item) => item.productId === productId);
        if (!target) return;

        const updatedSaved = savedForLater.filter((item) => item.productId !== productId);
        const existingIdx = items.findIndex((item) => item.productId === productId);

        let updatedItems: CartItemState[];
        if (existingIdx > -1) {
          updatedItems = [...items];
          updatedItems[existingIdx] = {
            ...updatedItems[existingIdx],
            quantity: updatedItems[existingIdx].quantity + target.quantity,
          };
        } else {
          updatedItems = [...items, target];
        }

        const totals = calculateTotals(updatedItems, appliedCoupon, giftWrap);
        set({
          items: updatedItems,
          savedForLater: updatedSaved,
          ...totals,
        });
      },

      removeFromSaved: (productId) => {
        const { savedForLater } = get();
        set({
          savedForLater: savedForLater.filter((item) => item.productId !== productId),
        });
      },

      setGiftOptions: (giftWrap, giftMessage) => {
        const { items, appliedCoupon } = get();
        const totals = calculateTotals(items, appliedCoupon, giftWrap);
        set({
          giftWrap,
          giftMessage,
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

      getGiftWrapFee: () => {
        return get().giftWrap ? 10 : 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        const tax = get().getTaxAmount();
        const giftFee = get().getGiftWrapFee();
        return Math.max(0, subtotal - discount + shipping + tax + giftFee);
      },

      reset: () => {
        set({
          items: [],
          savedForLater: [],
          appliedCoupon: null,
          totalAmount: 0,
          totalQuantity: 0,
          giftWrap: false,
          giftMessage: '',
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
