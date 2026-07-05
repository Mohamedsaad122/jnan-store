import { useCartStore } from '@/store/cart.store';

/**
 * Custom hook wrapping useCartStore to expose cart items, totals, and management actions.
 * Exposes standard cart mutating actions along with helpers for tax, shipping, and coupons.
 *
 * @returns An object containing the cart state properties, handlers, and backward-compatible aliases.
 */
export const useCart = () => {
  const {
    items,
    isOpen,
    appliedCoupon,
    totalAmount,
    totalQuantity,
    setOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getTotal,
    getItemsCount,
    getDiscountAmount,
    getShippingFee,
    getTaxAmount,
    reset,
  } = useCartStore();

  // Backward compatibility alias for existing product card and details bindings
  const addToCart = addItem;
  const removeFromCart = removeItem;

  return {
    items,
    isOpen,
    appliedCoupon,
    totalAmount,
    totalQuantity,
    setOpen,
    addItem,
    addToCart,
    removeItem,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getTotal,
    getItemsCount,
    getDiscountAmount,
    getShippingFee,
    getTaxAmount,
    reset,
  };
};

export default useCart;
