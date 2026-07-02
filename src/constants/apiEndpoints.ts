export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PRODUCTS: {
    BASE: '/products',
    DETAILS: (id: string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    REVIEWS: (id: string) => `/products/${id}/reviews`,
  },
  ORDERS: {
    BASE: '/orders',
    DETAILS: (id: string) => `/orders/${id}`,
  },
  CART: '/cart',
  COUPONS: '/coupons',
} as const;

export default API_ENDPOINTS;
