import { create } from 'zustand';

interface WishlistState {
  // Client-only UI states placeholder (Server state migrated to React Query)
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>()(() => ({
  reset: () => {},
}));

export default useWishlistStore;
