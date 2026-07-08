export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAILS: '/shop/:id',
  CATEGORIES: '/categories',
  WISHLIST: '/wishlist',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/checkout/success',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ORDERS: '/orders',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ABOUT: '/about',
  CONTACT: '/contact',
  BEST_SELLERS: '/best-sellers',
  OFFERS: '/offers',
} as const;

export default ROUTES;
