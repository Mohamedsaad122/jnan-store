export const LANGUAGES = {
  AR: 'ar',
  EN: 'en',
} as const;

export type SupportedLanguage = typeof LANGUAGES[keyof typeof LANGUAGES];

export const LANGUAGE_DETAILS = {
  ar: {
    code: 'ar',
    dir: 'rtl',
    label: 'العربية',
  },
  en: {
    code: 'en',
    dir: 'ltr',
    label: 'English',
  },
} as const;

export default LANGUAGES;
