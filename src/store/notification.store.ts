import { create } from 'zustand';

interface NotificationUiState {
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

/**
 * Zustand store managing client-only UI configurations for notifications.
 * All notification server records reside inside React Query cache.
 */
export const useNotificationStore = create<NotificationUiState>()((set) => ({
  isDrawerOpen: false,
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
}));

export default useNotificationStore;
export interface NotificationItem {
  id: string;
  type: 'order' | 'promotion' | 'account' | 'security' | 'system';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  time: string;
  read: boolean;
}
