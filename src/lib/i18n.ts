import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arTranslation from '@/locales/ar/translation.json';
import enTranslation from '@/locales/en/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: arTranslation },
      en: { translation: enTranslation },
    },
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Synchronize document attributes based on the current locale
export const updateLayoutDirection = (lang: string) => {
  const dir = lang.startsWith('ar') ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
  
  // Set fonts based on language
  if (dir === 'rtl') {
    document.body.classList.remove('font-sans');
    document.body.classList.add('font-tajawal');
  } else {
    document.body.classList.remove('font-tajawal');
    document.body.classList.add('font-sans');
  }
};

// Initialize direction based on current resolved language
updateLayoutDirection(i18n.resolvedLanguage || 'ar');

// Listen to runtime language changes
i18n.on('languageChanged', (lng) => {
  updateLayoutDirection(lng);
});

export default i18n;
