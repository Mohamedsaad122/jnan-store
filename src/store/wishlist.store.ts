import { create } from 'zustand';

interface WishlistState {
  itemIds: string[];
  setItemIds: (itemIds: string[]) => void;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  itemIds: [],
  setItemIds: (itemIds) => set({ itemIds }),
  reset: () => set({ itemIds: [] }),
}));

export default useWishlistStore;
