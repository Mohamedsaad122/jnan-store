import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/theme.store';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg relative overflow-hidden flex items-center justify-center focus-visible:ring-2 focus-visible:ring-gold"
      aria-label={
        theme === 'dark'
          ? 'تفعيل الوضع المضيء / Switch to Light Mode'
          : 'تفعيل الوضع المظلم / Switch to Dark Mode'
      }
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -15, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 15, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex items-center justify-center w-full h-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-gold" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-primary" />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};

export default ThemeSwitcher;
