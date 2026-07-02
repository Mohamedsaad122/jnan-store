import { useThemeStore } from '@/store/theme.store';

export const useDarkMode = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  return {
    isDarkMode,
    theme,
    setTheme,
    toggleTheme,
  };
};

export default useDarkMode;
