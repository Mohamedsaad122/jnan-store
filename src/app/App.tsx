import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';
import AppRoutes from '@/app/AppRoutes';
import ErrorBoundary from '@/components/ErrorBoundary';

import { useThemeStore } from '@/store/theme.store';
import { toast } from 'react-hot-toast';

// Bootstrap internationalization configurations
import '@/lib/i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const App: React.FC = () => {
  const { theme } = useThemeStore();
  const [installPrompt, setInstallPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = React.useState(true);

  // Sync document theme classes
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // SW registration and update listener
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('[PWA] SW registered:', registration);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Show premium hot-toast update notify
                  toast(
                    (t) => (
                      <div className="flex flex-col gap-1 text-right font-tajawal" dir="rtl">
                        <span className="text-xs font-extrabold text-primary dark:text-gold">
                          يتوفر إصدار جديد للمتجر!
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          اضغط أدناه لتحديث التطبيق فوراً.
                        </span>
                        <button
                          onClick={() => {
                            window.location.reload();
                            toast.dismiss(t.id);
                          }}
                          className="mt-2 text-[10px] font-bold text-gold hover:underline bg-transparent border-0 cursor-pointer self-start p-0"
                        >
                          تحديث الآن / Update App
                        </button>
                      </div>
                    ),
                    { duration: 15000, position: 'top-center' }
                  );
                }
              });
            }
          });
        });
      });
    }
  }, []);

  // Capture PWA install promt
  React.useEffect(() => {
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log('[PWA] User choice outcome:', outcome);
    setInstallPrompt(null);
  };

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AppRoutes />

              {/* Premium Floating Install Banner */}
              {installPrompt && showInstallBanner && (
                <div
                  className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 p-4 rounded-2xl bg-card border border-gold/25 shadow-lg flex items-center justify-between gap-4 animate-fade-in font-tajawal select-none"
                  dir="rtl"
                >
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-xs font-bold text-primary dark:text-gold">
                      تثبيت تطبيق جنان
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      تصفح أسرع وبدون إنترنت كالتطبيقات الذكية.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleInstallApp}
                      className="h-8 px-4 rounded-xl bg-gold text-[#121212] hover:bg-gold/90 text-[10px] font-extrabold shadow-sm cursor-pointer border-0 transition-colors"
                    >
                      تثبيت / Install
                    </button>
                    <button
                      onClick={() => setShowInstallBanner(false)}
                      className="h-8 px-2 rounded-xl text-muted-foreground hover:text-foreground text-[10px] font-medium cursor-pointer border-0 bg-transparent"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              )}

              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  },
                }}
              />
            </BrowserRouter>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
