import { Category } from '@/types/domain';
import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';
import { MOCK_CATEGORIES } from './categories.mock';

export const categoriesService = {
  /**
   * Fetches the active categories list from either mock registry or backend API.
   */
  async getCategories(): Promise<Category[]> {
    if (!featureFlags.enableMockApi) {
      return request.get<Category[]>('/categories');
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_CATEGORIES.filter((c) => c.isActive);
  },
};

export default categoriesService;
