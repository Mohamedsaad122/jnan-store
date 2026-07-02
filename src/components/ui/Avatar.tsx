import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallbackText: string;
}

export const Avatar: React.FC<AvatarProps> = ({ className, src, alt, fallbackText, ...props }) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      className={twMerge(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-muted',
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || 'User Profile'}
          onError={() => setHasError(true)}
          className="h-full w-full aspect-square object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gold-light font-tajawal text-sm font-semibold text-primary">
          {fallbackText.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
