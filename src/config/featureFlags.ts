import { env } from './env';

export const featureFlags = {
  /**
   * Toggles product wishlist actions.
   */
  enableWishlist: true,

  /**
   * Toggles applying checkout discount promo codes.
   */
  enableCoupons: true,

  /**
   * Toggles product reviews displaying and submittals.
   */
  enableReviews: true,

  /**
   * Toggles Instagram social widgets.
   */
  enableInstagram: false,

  /**
   * Toggles site-wide dark mode theme togglers.
   */
  enableDarkMode: true,

  /**
   * Controls page visits and clicks analytics logging.
   */
  enableAnalytics: env.VITE_ENABLE_ANALYTICS,

  /**
   * Governs whether the app serves static mock datasets or requests live server APIs.
   */
  enableMockApi: env.VITE_ENABLE_MOCK_API,
};

export default featureFlags;
