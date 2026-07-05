import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address } from '@/types/domain';

interface AddressState {
  addresses: Address[];

  // Actions
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => void;
  editAddress: (id: string, updatedFields: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  reset: () => void;
}

// Initial pre-seeded mock Saudi addresses for instant testing
const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-riyadh-home',
    userId: 'mock-user-123',
    title: 'المنزل (الرياض)',
    addressLine1: 'شارع العليا العام، حي الياسمين',
    addressLine2: 'مبنى ٤١٢٤، شقة ٣',
    city: 'الرياض',
    state: 'منطقة الرياض',
    country: 'المملكة العربية السعودية',
    postalCode: '13315',
    isDefault: true,
  },
  {
    id: 'addr-jeddah-work',
    userId: 'mock-user-123',
    title: 'العمل (جدة)',
    addressLine1: 'طريق الملك عبد العزيز، حي الشاطئ',
    addressLine2: 'برج الشاشة، الدور ١٢',
    city: 'جدة',
    state: 'منطقة مكة المكرمة',
    country: 'المملكة العربية السعودية',
    postalCode: '23414',
    isDefault: false,
  },
];

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: INITIAL_ADDRESSES,

      addAddress: (newAddr) => {
        const currentList = get().addresses;
        const newId = `addr-${Date.now()}`;
        const newAddressItem: Address = {
          ...newAddr,
          id: newId,
          userId: 'mock-user-123',
        };

        let updatedList = [...currentList];
        if (newAddressItem.isDefault) {
          // Unmark previous defaults
          updatedList = updatedList.map((addr) => ({ ...addr, isDefault: false }));
        }

        // If it's the very first address, enforce default
        if (updatedList.length === 0) {
          newAddressItem.isDefault = true;
        }

        updatedList.push(newAddressItem);
        set({ addresses: updatedList });
      },

      editAddress: (id, updatedFields) => {
        const currentList = get().addresses;

        const updatedList = currentList.map((addr) => {
          if (addr.id === id) {
            return { ...addr, ...updatedFields };
          }
          // If the edited item is marked as default, unmark others
          if (updatedFields.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });

        // Enforce at least one default if list is not empty and no default remains
        const hasDefault = updatedList.some((addr) => addr.isDefault);
        if (!hasDefault && updatedList.length > 0) {
          updatedList[0].isDefault = true;
        }

        set({ addresses: updatedList });
      },

      deleteAddress: (id) => {
        const currentList = get().addresses;
        const target = currentList.find((addr) => addr.id === id);
        const updatedList = currentList.filter((addr) => addr.id !== id);

        // If we deleted the default address, promote the first remaining one to default
        if (target?.isDefault && updatedList.length > 0) {
          updatedList[0] = { ...updatedList[0], isDefault: true };
        }

        set({ addresses: updatedList });
      },

      setDefaultAddress: (id) => {
        const currentList = get().addresses;
        const updatedList = currentList.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }));
        set({ addresses: updatedList });
      },

      reset: () => {
        set({ addresses: INITIAL_ADDRESSES });
      },
    }),
    {
      name: 'jnan-address-storage',
    }
  )
);

export default useAddressStore;
