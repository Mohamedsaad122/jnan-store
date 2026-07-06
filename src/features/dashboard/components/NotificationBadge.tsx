import React from 'react';
import { twMerge } from 'tailwind-merge';

interface NotificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className,
  ...props
}) => {
  if (count <= 0) return null;

  return (
    <span
      className={twMerge(
        'inline-flex items-center justify-center h-4.5 min-w-[18px] px-1 text-[9px] font-black text-white bg-destructive rounded-full select-none leading-none animate-pulse',
        className
      )}
      {...props}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;
