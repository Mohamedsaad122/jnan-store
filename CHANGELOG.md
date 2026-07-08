# Changelog

All notable changes to the Jnan Store storefront project will be documented in this file.

---

## [2.7.0] - 2026-07-07
### Added
- **Smart Recommendation Engine**: Built `useRecommendations` client-side query hooks selecting complementary categories (e.g. coffee to dates), trending, and frequently bought together items. Integrated swipeable carousels inside `ProductDetails.tsx`.
- **Saved For Later Shelf**: Upgraded `useCartStore` with `savedForLater` state array and corresponding movement hooks (`moveToSaved`, `moveToCart`, `removeFromSaved`) rendered as a secondary grid under the active cart list.
- **Undo Cart Deletions Banner**: Injected a floating banner displaying a confirmation prompt to undo and restore items removed from the active cart.
- **Gift Wrapping Selection**: Customizable options box to wrap orders as gifts (+10 SAR) with personalized message parameters saved to checkout totals.
- **Checkout Progress Stepper**: Built a responsive, multi-step progress stepper highlighting the checkout stages (Address, Shipping, Payment) based on filled inputs.
- **Coupon Suggestion Badges**: Clickable quick suggestion chips on the cart page allowing users to apply popular promo coupons (`JNAN10`, `WELCOME50`) in one tap.

### Modified
- **Enterprise Filtering System**: Extended `useProductFilters.ts` to support multi-value query parameter serialization (`categories`, `brands`, `colors`, `sizes`) encoded as comma-separated values. Mounted sidebar checkbox lists and individual filter chips grid.
- **Standardized Micro-Interactions**: Configured smooth easing scales (98%) on pressed states, Cubic Bezier transitions (250ms), and custom focus indicator ring outlines for WCAG AA compliance.

---

## [2.6.0] - 2026-07-07
### Added
- **Progressive Web App (PWA)**: Full support with `manifest.json`, standard application colors, offline cache-first service worker (`sw.js`), and bilingual custom connection-loss landing page (`offline.html`).
- **Product Comparison Tray**: Added Zustand store to select up to 4 items and sticky bottom bar (`CompareBar.tsx`) above mobile bottom navigation bar. Built comparative specs matrix (rating, category, stock, specifications) with direct Add to Cart buttons.
- **Advanced Search suggestions**: Highlighting matching text, recent query history logged in localStorage, popular searches keywords tags, keyboard navigation indexes (ArrowUp/ArrowDown/Enter), and contextual recommendation empty states.
- **Social Sharing Triggers**: Shared overlay dialog on Product Details page mapping native navigator share on mobile, or Copy Link, WhatsApp, Telegram, X, and Facebook anchors.
- **Floating Compare toggle button**: Placed inline beside the heart wishlist icon inside `ProductCard` to let users quickly compare items.

### Modified
- **Product Details Image Gallery**: Upgraded to support Framer Motion drag gestures for mobile swiping, global arrow-key keyboard navigation, smooth crossfade transition animations, and a fullscreen modal viewer.
- **Recently Viewed shelf**: Converted list grid into horizontal scrollable carousel with a "Clear History" action button.
- **Reviews & Helpful Triggers**: Upgraded Reviews tab panel with star ratings progress bar breakdown, rating count filters, verified purchase tags, sorting, helpful thumbs-up counters, and empty search messages.
- **Toasts Notification helper**: Integrated unified styling overlays, and support for success, error, warning, info, loading, and promise-based toasts.

---

## [2.5.2] - 2026-07-07
### Added
- **ErrorState**: Reusable error boundaries supporting offline, network, 404, and forbidden access states with retry callbacks.
- **EmptyState**: Reusable empty state layouts with customized primary actions.
- **Helmet SEO configuration**: Dynamic Meta Tags, open-graph metadata, canonical targets, and keywords mapping on all storefront routes.
- **About Us page**: Fully localized about narrative, core values grid (Quality, Authenticity, Saudi Hospitality), and SEO keywords.

### Modified
- **Categories Listing**: Replaced static layout placeholders with TanStack Query fetching, loader skeletons, and error retry handlers.
- **Toolbar rendering**: Wrapped `ShopToolbar.tsx` with `React.memo` to restrict redundant draw loops.
- **Wishlist & Cart**: Replaced custom empty screens with the reusable `EmptyState` component.

---

## [2.5.1] - 2026-07-06
### Added
- Synchronized category filtering and shop queries to resolve infinite search rendering loop conditions.
- Completed missing public pages (Contact Us, Offers, Best Sellers pages).
- Registered lazy-loaded split chunks inside `AppRoutes` to decrease primary bundle load times.
