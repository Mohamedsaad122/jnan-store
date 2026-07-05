import React from 'react';
import { Chrome } from 'lucide-react';

export const SocialLoginButtons: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full font-tajawal text-xs select-none">
      <button
        type="button"
        onClick={() => {}}
        className="flex items-center justify-center gap-2 h-10 border border-border/80 bg-background/50 hover:bg-muted/30 rounded-xl transition-all font-semibold text-primary"
      >
        <Chrome className="h-4 w-4 shrink-0 text-red-500" />
        <span>جوجل</span>
      </button>

      <button
        type="button"
        onClick={() => {}}
        className="flex items-center justify-center gap-2 h-10 border border-border/80 bg-background/50 hover:bg-muted/30 rounded-xl transition-all font-semibold text-primary"
      >
        <svg className="h-4 w-4 shrink-0 fill-current text-primary" viewBox="0 0 24 24">
          <path d="M12.2 12.6c0-2.4 2-3.6 2-3.7-1.1-1.6-2.9-1.8-3.5-1.9-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.2-.9-1.6 0-3.1.9-4 2.4-1.7 3-1.7 8.3 0 11.2.8 1.5 1.8 3.1 3.4 3.1 1.5 0 2.1-1 3.9-1s2.3 1 3.9 1c1.6 0 2.5-1.5 3.3-3.1.9-1.4 1.3-2.8 1.3-2.9 0 0-3.1-1.2-3.1-4.7zM15.3 4.9c.7-.8 1.1-2 1-3.2-1 .1-2.3.7-3.1 1.6-.7.8-1.1 2-1 3.2 1.1.1 2.3-.5 3.1-1.6z" />
        </svg>
        <span>آبل</span>
      </button>
    </div>
  );
};

export default SocialLoginButtons;
