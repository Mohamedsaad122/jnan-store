import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist/wishlist.service';
import { queryKeys } from '@/lib/react-query/queryKeys';

/**
 * Custom hook wrapping TanStack Query to manage bookmarked products.
 * Handles checking bookmark status and toggling products on/off the wishlist.
 * Serves as the single source of truth using React Query cache layers instead of Zustand.
 */
export const useWishlist = () => {
  const queryClient = useQueryClient();

  const { data: itemIds = [] } = useQuery<string[]>({
    queryKey: queryKeys.wishlist,
    queryFn: () => wishlistService.getWishlist(),
    staleTime: 15 * 60 * 1000, // 15 minutes cache freshness
  });

  const toggleMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.toggleWishlist(productId),
    // Optimistic Update
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist });
      const previousWishlist = queryClient.getQueryData<string[]>(queryKeys.wishlist) || [];

      const isCurrentlyIn = previousWishlist.includes(productId);
      const updatedWishlist = isCurrentlyIn
        ? previousWishlist.filter((id) => id !== productId)
        : [...previousWishlist, productId];

      queryClient.setQueryData(queryKeys.wishlist, updatedWishlist);

      return { previousWishlist };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.wishlist, context.previousWishlist);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => wishlistService.clearWishlist(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist });
      const previousWishlist = queryClient.getQueryData<string[]>(queryKeys.wishlist) || [];

      queryClient.setQueryData(queryKeys.wishlist, []);

      return { previousWishlist };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.wishlist, context.previousWishlist);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    },
  });

  const toggleWishlist = (productId: string) => {
    toggleMutation.mutate(productId);
  };

  const clearWishlist = () => {
    clearMutation.mutate();
  };

  const isInWishlist = (productId: string): boolean => {
    return itemIds.includes(productId);
  };

  return {
    itemIds,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    isLoading: toggleMutation.isPending || clearMutation.isPending,
  };
};

export default useWishlist;
