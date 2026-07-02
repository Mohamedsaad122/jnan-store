import { create } from 'zustand';

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
  totalAmount: number;
  totalQuantity: number;
  setItems: (items: CartItemState[]) => void;
  setOpen: (isOpen: boolean) => void;
  reset: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  totalAmount: 0,
  totalQuantity: 0,
  setItems: (items) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    set({ items, totalQuantity, totalAmount });
  },
  setOpen: (isOpen) => set({ isOpen }),
  reset: () => set({ items: [], totalAmount: 0, totalQuantity: 0, isOpen: false }),
}));

export default useCartStore;
