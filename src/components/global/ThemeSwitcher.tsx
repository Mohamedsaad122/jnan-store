import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/theme.store';
import { Button } from '@/components/ui/Button';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg"
      aria-label="تغيير المظهر / Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun className="h-4.5 w-4.5 text-gold animate-fade-in" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-primary animate-fade-in" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
