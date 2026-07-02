import { useWishlistStore } from '@/store/wishlist.store';

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
