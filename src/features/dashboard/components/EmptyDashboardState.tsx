import React from 'react';
import { HelpCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { twMerge } from 'tailwind-merge';

interface EmptyDashboardStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className,
  ...props
}) => {
  return (
    <Card
      className={twMerge(
        'p-8 flex flex-col items-center justify-center text-center gap-4 border-border/40 select-none bg-card/40 backdrop-blur-xs min-h-[14rem]',
        className
      )}
      {...props}
    >
      <div className="h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
        {icon || <HelpCircle className="h-6 w-6 stroke-1.5" />}
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="font-bold text-sm text-primary font-tajawal">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>

      {actionText && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="text-xs font-bold px-5 bg-primary text-primary-foreground"
        >
          {actionText}
        </Button>
      )}
    </Card>
  );
};

export default EmptyDashboardState;
