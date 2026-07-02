import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h2 className="font-tajawal text-3xl font-bold tracking-tight text-primary">
            متجر جنان
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            بوابة الحساب الموحدة
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
