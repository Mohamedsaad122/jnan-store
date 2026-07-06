import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';

/**
 * Service to sync wishlist bookmarks, querying mock state or calling REST API endpoints.
 */
export const wishlistService = {
  /**
   * Fetches user's saved wishlist item IDs.
   */
  async getWishlist(): Promise<string[]> {
    if (!featureFlags.enableMockApi) {
      return request.get<string[]>('/wishlist');
    }
    return []; // Handled by localStorage inside useWishlistStore in mock mode
  },

  /**
   * Toggles product in user's wishlist database.
   */
  async toggleWishlist(productId: string): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      const response = await request.post<{ inWishlist: boolean }>('/wishlist/toggle', {
        productId,
      });
      return response.inWishlist;
    }
    return true;
  },

  /**
   * Wipes all bookmarks from user's wishlist database.
   */
  async clearWishlist(): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.delete('/wishlist');
      return true;
    }
    return true;
  },
};

export default wishlistService;
