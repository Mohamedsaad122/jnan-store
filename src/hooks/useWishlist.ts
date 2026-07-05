import { useWishlistStore } from '@/store/wishlist.store';

/**
 * Custom hook wrapping useWishlistStore to manage bookmarked products.
 * Handles checking bookmark status and toggling products on/off the wishlist.
 *
 * @returns An object containing the array of item IDs, toggle handler, status check function, and a reset action.
 */
export const useWishlist = () => {
  const { itemIds, setItemIds, reset } = useWishlistStore();

  const toggleWishlist = (productId: string) => {
    if (itemIds.includes(productId)) {
      setItemIds(itemIds.filter((id) => id !== productId));
    } else {
      setItemIds([...itemIds, productId]);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return itemIds.includes(productId);
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
