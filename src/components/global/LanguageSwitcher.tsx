import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import { Button } from '@/components/ui/Button';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-1.5 space-x-reverse"
      aria-label="تغيير اللغة / Change Language"
    >
      <Globe className="h-4 w-4 opacity-75" />
      <span className="text-xs font-semibold">{language === 'ar' ? 'EN' : 'عربي'}</span>
    </Button>
  );
};

export default LanguageSwitcher;
