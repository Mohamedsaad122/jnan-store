import { useCartStore } from '@/store/cart.store';

export const useCart = () => {
  const { items, isOpen, totalAmount, totalQuantity, setItems, setOpen, reset } = useCartStore();

  const addToCart = () => {
    // Infrastructure actions placeholder
  };

  const removeFromCart = () => {
    // Infrastructure actions placeholder
  };

  return {
    items,
    isOpen,
    totalAmount,
    totalQuantity,
    setItems,
    setOpen,
    addToCart,
    removeFromCart,
    reset,
  };
};

export default useCart;
