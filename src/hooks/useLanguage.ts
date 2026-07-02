import { useLanguageStore } from '@/store/language.store';

export const useLanguage = () => {
  const { language, setLanguage } = useLanguageStore();
  const isRtl = language === 'ar';

  return {
    language,
    isRtl,
    setLanguage,
  };
};

export default useLanguage;
