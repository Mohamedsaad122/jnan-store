import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  compareIds: string[];
  addToCompare: (id: string) => boolean; // returns true if added, false if full or already exists
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareIds: [],
      addToCompare: (id: string) => {
        const { compareIds } = get();
        if (compareIds.includes(id)) return false;
        if (compareIds.length >= 4) return false;

        set({ compareIds: [...compareIds, id] });
        return true;
      },
      removeFromCompare: (id: string) => {
        set({ compareIds: get().compareIds.filter((item) => item !== id) });
      },
      clearCompare: () => {
        set({ compareIds: [] });
      },
      isInCompare: (id: string) => {
        return get().compareIds.includes(id);
      },
    }),
    {
      name: 'jnan_compare_store',
    }
  )
);

export default useCompareStore;
