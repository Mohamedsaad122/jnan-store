import { useWishlistStore } from '@/store/wishlist.store';

export const useWishlist = () => {
  const { itemIds, setItemIds, reset } = useWishlistStore();

  const toggleWishlist = () => {
    // Infrastructure actions placeholder
  };

  const isInWishlist = (_productId: string): boolean => {
    // Infrastructure actions placeholder
    return false;
  };

  return {
    itemIds,
    setItemIds,
    toggleWishlist,
    isInWishlist,
    reset,
  };
};

export default useWishlist;
