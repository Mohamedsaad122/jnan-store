import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from '@/layouts/DefaultLayout';
import AuthLayout from '@/layouts/AuthLayout';
import GuestRoute from '@/features/auth/components/GuestRoute';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load page components
const Home = lazy(() => import('@/pages/Home'));
const Shop = lazy(() => import('@/pages/Shop'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const Categories = lazy(() => import('@/pages/Categories'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const VerifyAccount = lazy(() => import('@/pages/VerifyAccount'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Orders = lazy(() => import('@/pages/Orders'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Lazy load dashboard components
const DashboardLayout = lazy(() => import('@/features/dashboard/layouts/DashboardLayout'));
const DashboardOverview = lazy(() => import('@/features/dashboard/pages/OverviewPage'));
const DashboardProfile = lazy(() => import('@/features/dashboard/pages/ProfilePage'));
const DashboardOrders = lazy(() => import('@/features/dashboard/pages/OrdersPage'));
const DashboardAddresses = lazy(() => import('@/features/dashboard/pages/AddressesPage'));
const DashboardSettings = lazy(() => import('@/features/dashboard/pages/SettingsPage'));
const DashboardSecurity = lazy(() => import('@/features/dashboard/pages/SecurityPage'));
const DashboardWishlist = lazy(() => import('@/features/dashboard/pages/WishlistPage'));
const DashboardNotifications = lazy(() => import('@/features/dashboard/pages/NotificationsPage'));
const DashboardSupport = lazy(() => import('@/features/dashboard/pages/SupportPage'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Main Storefront Layout Routes */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="checkout/success" element={<OrderSuccess />} />
        </Route>

        {/* Auth Flow Layout Routes */}
        <Route
          path="/auth"
          element={
            <GuestRoute>
              <AuthLayout />
            </GuestRoute>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<VerifyAccount />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="addresses" element={<DashboardAddresses />} />
          <Route path="wishlist" element={<DashboardWishlist />} />
          <Route path="notifications" element={<DashboardNotifications />} />
          <Route path="security" element={<DashboardSecurity />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="support" element={<DashboardSupport />} />
        </Route>

        {/* Custom Isolated Layout Routes (e.g. Minimalist Checkout layout) */}
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Checkout />
            </Suspense>
          }
        />

        {/* 404 Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
