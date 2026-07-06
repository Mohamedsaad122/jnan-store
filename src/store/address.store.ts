import { create } from 'zustand';
import { Address } from '@/types/domain';

interface AddressState {
  isModalOpen: boolean;
  editingAddress: Address | null;

  // Actions
  openAddModal: () => void;
  openEditModal: (address: Address) => void;
  closeModal: () => void;
}

/**
 * Zustand store managing client-only UI states for shipping address modals.
 * Server-side address lists and actions reside in React Query.
 */
export const useAddressStore = create<AddressState>()((set) => ({
  isModalOpen: false,
  editingAddress: null,

  openAddModal: () => set({ isModalOpen: true, editingAddress: null }),
  openEditModal: (address) => set({ isModalOpen: true, editingAddress: address }),
  closeModal: () => set({ isModalOpen: false, editingAddress: null }),
}));

export default useAddressStore;
