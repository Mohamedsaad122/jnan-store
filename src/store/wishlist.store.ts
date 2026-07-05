import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  itemIds: string[];
  setItemIds: (itemIds: string[]) => void;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      itemIds: [],
      setItemIds: (itemIds) => set({ itemIds }),
      reset: () => set({ itemIds: [] }),
    }),
    {
      name: 'jnan-wishlist-storage',
    }
  )
);

export default useWishlistStore;
