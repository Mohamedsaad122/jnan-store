export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type ThemeMode = typeof THEME_MODES[keyof typeof THEME_MODES];

export const THEME_COLORS = {
  COFFEE: '#4A3525',
  GOLD: '#C5A880',
  GREEN: '#4F6F52',
  CREAM: '#FDFBF7',
} as const;

export default THEME_MODES;
