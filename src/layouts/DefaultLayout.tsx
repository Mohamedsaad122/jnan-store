import React from 'react';
import { Outlet } from 'react-router-dom';

const DefaultLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col transition-theme">
      {/* Primary site Header placeholder */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="font-tajawal text-xl font-bold text-primary">متجر جنان / Jnan Store</div>
          <nav className="flex space-x-4 space-x-reverse">
            {/* Header Navigation link placeholders */}
          </nav>
        </div>
      </header>

      {/* Main content page area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Primary site Footer placeholder */}
      <footer className="border-t bg-card text-card-foreground">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} متجر جنان (Jnan Store). جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

export default DefaultLayout;
