import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import ROUTES from '@/constants/routes';
import LoadingSpinner from '@/components/LoadingSpinner';

interface GuestRouteProps {
  children?: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // If logged in, redirect away from guest pages (like login/register) to home
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default GuestRoute;
