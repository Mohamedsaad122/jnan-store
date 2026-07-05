import React from 'react';

interface DividerWithTextProps {
  children: React.ReactNode;
}

export const DividerWithText: React.FC<DividerWithTextProps> = ({ children }) => {
  return (
    <div className="relative my-6 select-none">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/60" />
      </div>
      <div className="relative flex justify-center text-[10px] uppercase font-tajawal">
        <span className="bg-card px-2.5 text-muted-foreground">{children}</span>
      </div>
    </div>
  );
};

export default DividerWithText;
