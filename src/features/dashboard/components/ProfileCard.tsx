import React from 'react';
import Card from '@/components/ui/Card';
import { twMerge } from 'tailwind-merge';

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  description,
  children,
  className,
  ...props
}) => {
  return (
    <Card
      className={twMerge(
        'p-6 border-border/40 bg-card/40 backdrop-blur-md shadow-xs text-right font-tajawal',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-border/10 pb-4 mb-4 select-none">
          {title && <h3 className="text-sm font-bold text-primary">{title}</h3>}
          {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
      )}
      <div className="mt-2">{children}</div>
    </Card>
  );
};

export default ProfileCard;
