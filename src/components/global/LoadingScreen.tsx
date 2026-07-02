import React from 'react';
import Logo from '@/components/global/Logo';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground transition-theme">
      <Logo className="scale-125 mb-6" />
      <div className="h-1 w-32 overflow-hidden rounded bg-muted/30">
        <div className="h-full w-1/2 rounded bg-gold animate-[pulse_1.2s_infinite]" />
      </div>
    </div>
  );
};

export default LoadingScreen;
