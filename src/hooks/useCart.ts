import { useCartStore, CartItemState } from '@/store/cart.store';

export const useCart = () => {
  const { items, isOpen, totalAmount, totalQuantity, setItems, setOpen, reset } = useCartStore();

  const addToCart = (newItem: Omit<CartItemState, 'quantity'> & { quantity?: number }) => {
    const quantityToAdd = newItem.quantity || 1;
    const existingIndex = items.findIndex((item) => item.productId === newItem.productId);

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantityToAdd,
      };
      setItems(updated);
    } else {
      setItems([...items, { ...newItem, quantity: quantityToAdd }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(items.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
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
    updateQuantity,
    reset,
  };
};

export default useCart;
