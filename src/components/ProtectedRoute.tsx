import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect unauthorized requests to login page
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
