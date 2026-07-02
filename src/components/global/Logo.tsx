import React from 'react';
import { Coffee } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge('flex items-center space-x-2 space-x-reverse select-none', className)}>
      {/* Brand Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-gold border border-gold/20 shadow-inner">
        <Coffee className="h-5 w-5" />
      </div>

      {/* Brand Text (Arabic / English metadata) */}
      <div className="flex flex-col text-right">
        <span className="font-tajawal text-base font-bold leading-tight text-primary dark:text-gold">
          متجر جنان
        </span>
        <span className="font-sans text-[9px] tracking-wider text-muted-foreground font-semibold">
          JNAN STORE
        </span>
      </div>
    </div>
  );
};

export default Logo;
