// Pages exports
export { default as LoginPage } from './pages/LoginPage';
export { default as RegisterPage } from './pages/RegisterPage';
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage';
export { default as ResetPasswordPage } from './pages/ResetPasswordPage';
export { default as VerifyAccountPage } from './pages/VerifyAccountPage';

// Guards exports
export { default as GuestRoute } from './components/GuestRoute';
export { default as RoleGuard } from './components/RoleGuard';

// UI components exports
export { default as PasswordField } from './components/PasswordField';
export { default as PasswordStrengthIndicator } from './components/PasswordStrengthIndicator';
export { default as OTPInput } from './components/OTPInput';
export { default as SocialLoginButtons } from './components/SocialLoginButtons';
export { default as DividerWithText } from './components/DividerWithText';

// Types & Schemas
export * from './types';
export * from './schemas/authSchemas';
export * from './hooks/useAuth';
