import React from 'react';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export interface EmptyStateAction {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  to?: string;
  href?: string;
}

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const renderButton = (action: EmptyStateAction, variant: 'primary' | 'outline' | 'gold') => {
    const buttonElement = (
      <Button
        variant={variant}
        onClick={action.onClick}
        className="text-xs font-bold px-6 h-10 rounded-xl flex items-center justify-center gap-2 w-full cursor-pointer focus-visible:ring-2 focus-visible:ring-gold"
      >
        {action.label}
      </Button>
    );

    if (action.to) {
      return (
        <Link to={action.to} className="w-full sm:w-auto">
          {buttonElement}
        </Link>
      );
    }

    if (action.href) {
      return (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          {buttonElement}
        </a>
      );
    }

    return <div className="w-full sm:w-auto">{buttonElement}</div>;
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-8 md:p-16 border border-dashed border-border/50 rounded-3xl text-center font-tajawal select-none w-full max-w-xl mx-auto bg-card/20 backdrop-blur-xs"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="h-16 w-16 rounded-2xl bg-muted/30 dark:bg-muted/15 flex items-center justify-center mb-5 border border-border/10">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-primary dark:text-gold mb-2">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground max-w-md mb-8 leading-relaxed font-light">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
        {primaryAction && renderButton(primaryAction, 'gold')}
        {secondaryAction && renderButton(secondaryAction, 'outline')}
      </div>
    </div>
  );
};

export default EmptyState;
