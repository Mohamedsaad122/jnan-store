import React from 'react';
import Card from '@/components/ui/Card';
import { twMerge } from 'tailwind-merge';

interface SecurityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  title,
  description,
  children,
  className,
  ...props
}) => {
  return (
    <Card
      className={twMerge(
        'p-5 sm:p-6 border border-border/40 bg-card/40 backdrop-blur-md shadow-xs text-right font-tajawal select-none',
        className
      )}
      {...props}
    >
      <div className="border-b border-border/10 pb-4 mb-4">
        <h3 className="text-sm font-black text-primary">{title}</h3>
        {description && <p className="text-[11px] text-muted-foreground mt-1">{description}</p>}
      </div>
      <div>{children}</div>
    </Card>
  );
};

export default SecurityCard;
