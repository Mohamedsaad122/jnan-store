import { Address } from '@/types/domain';
import { featureFlags } from '@/config/featureFlags';
import { request } from '@/lib/api/request';

/**
 * Service to manage shipping and billing addresses, query mock registries or request live endpoints.
 */
export const addressesService = {
  /**
   * Fetches saved shipping addresses list.
   */
  async getAddresses(): Promise<Address[]> {
    if (!featureFlags.enableMockApi) {
      return request.get<Address[]>('/addresses');
    }
    return []; // Handled by local Zustand storage pre-seed in mock mode
  },

  /**
   * Saves a new address record.
   */
  async addAddress(address: Omit<Address, 'id' | 'userId'>): Promise<Address> {
    if (!featureFlags.enableMockApi) {
      return request.post<Address>('/addresses', address);
    }
    return {
      ...address,
      id: `addr-${Date.now()}`,
      userId: 'mock-user-123',
    };
  },

  /**
   * Updates an existing address record.
   */
  async editAddress(id: string, updatedFields: Partial<Address>): Promise<Address> {
    if (!featureFlags.enableMockApi) {
      return request.put<Address>(`/addresses/${id}`, updatedFields);
    }
    return {
      id,
      userId: 'mock-user-123',
      title: updatedFields.title || '',
      addressLine1: updatedFields.addressLine1 || '',
      addressLine2: updatedFields.addressLine2 || '',
      city: updatedFields.city || '',
      state: updatedFields.state || '',
      country: updatedFields.country || '',
      postalCode: updatedFields.postalCode || '',
      isDefault: !!updatedFields.isDefault,
    };
  },

  /**
   * Deletes an address record.
   */
  async deleteAddress(id: string): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.delete(`/addresses/${id}`);
      return true;
    }
    return true;
  },

  /**
   * Sets a default shipping address.
   */
  async setDefaultAddress(id: string): Promise<boolean> {
    if (!featureFlags.enableMockApi) {
      await request.post(`/addresses/${id}/default`);
      return true;
    }
    return true;
  },
};

export default addressesService;
