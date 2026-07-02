import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, { updateLayoutDirection } from '@/lib/i18n';

interface LanguageState {
  language: 'ar' | 'en';
  setLanguage: (language: 'ar' | 'en') => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ar',
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
        updateLayoutDirection(language);
      },
    }),
    {
      name: 'jnan-language-store',
    }
  )
);

export default useLanguageStore;
