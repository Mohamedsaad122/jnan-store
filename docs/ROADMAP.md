# Jnan Store - Project Roadmap

This document outlines the development roadmap of Jnan Store, organizing our sprints, phases, and milestones into an enterprise-ready release sequence.

---

## 📦 Version 1.0 (Completed)

### ✅ Phase 1 — Project Foundation
- Initialized layout scaffolding with Vite, React 19, TypeScript, and Tailwind CSS.
- Established design tokens (Gold, Cream, Slate colors, and transitions).
- Created shared UI primitives (Button, Input, Card, Modal, Alerts).
- Integrated internationalization (i18n) for Arabic (RTL, Tajawal) and English (LTR, Inter).

### ✅ Phase 1.5 — Enterprise Foundation
- Set up global state frameworks (Zustand for client-only UI, TanStack Query v5 for server caches).
- Configured client-side routing via React Router DOM v6.
- Established the Axios HTTP network client with authentication request/response interceptors.

### ✅ Phase 2 — Storefront
- **Home**: Banner carousel, categories grid, featured products, flash sales, testimonials, why choose us, newsletter subscription, and global footer.

### ✅ Phase 3 — Commerce
- **Shop**: Category-based filtering, price sliders, sorting, search lookup, and responsive layout.
- **Product Details**: Multi-image galleries, attribute selections, tabbed descriptions/reviews, related shelves.
- **Cart**: Slide-out mini drawer and a separate dedicated Cart page with subtotal/quantity calculators.
- **Wishlist**: Direct heart-toggle bookmarks with localStorage persistence.
- **Checkout**: Address selector modals, coupon verification schemas, dynamic shipping fees, and VAT calculations.

### ✅ Phase 4 — Authentication
- Developed views for Login, Register, Forgot Password, Reset Password, Account Verification, and OTP entries.
- Linked client-side JWT token storage and route security guards (`ProtectedRoute` / `GuestRoute`).

### ✅ API Integration Readiness Sprint
- Created custom mapper functions (e.g., `products.mapper.ts`, `auth.mapper.ts`) translating raw API DTO structures into domain entities.
- Abstracted remote queries into distinct services using TanStack Query hooks.

### ✅ Quality Engineering & DevOps Sprint
- Configured test runners (Vitest + React Testing Library) and Playwright E2E browser tests.
- Set up Husky pre-commit hooks, Commitlint rules, and a GitHub Actions CI pipeline with zero-warning tolerances.

### ✅ Documentation & Repository Excellence Sprint
- Wrote detailed documents for architecture, folder conventions, data flow, state paradigms, and deployment.

---

## 📦 Version 2.0 (Completed)

### 🚀 Phase 5 — Customer Dashboard
- **Phase 5.1 — Dashboard Foundation**: Scaffolded responsive layouts, collapsible sidebars, dynamic header breadcrumbs, and lazy route loading.
- **Phase 5.2 — Profile & Address Book**: Built profile overview cards, personal info editors, base64 avatar management, and CRUD shipping address cards.
- **Phase 5.3 — Orders & Wishlist**: Built orders logs, details, chronological progress timelines, invoice summaries, and wishlist item toggle matrices.
- **Phase 5.4 — Notifications, Security & Settings**: Completed settings drawers, active sessions managers, password resets, and notifications.

---

## 📦 Version 2.5 — Platform Stability & UI Polish (Completed)

### 🚀 Phase 2.5.1 — API Integration, Stability & Missing Pages
- Synchronized category filtering and shop queries to eliminate search rendering loop conditions.
- Completed customer-facing missing public pages (Contact Us, Offers, Best Sellers pages).
- Lazy-loaded routing and navigation links integration across header/footer/mobile drawers.
- Achieved 100% passing test coverage (116 unit and integration test specs).

### 🚀 Phase 2.5.2 — Enterprise UX, Performance & SEO Sprint
- Created reusable `ErrorState` and `EmptyState` components to unify empty/error layout boundaries.
- Polished dark mode, verified touch targets (>= 48px), and added focus-visible outlines for WCAG AA compliance.
- Injected dynamic SEO `Helmet` tags (Title, Description, Canonical, OG tags) on all storefront routes.
- Memoized layout containers (such as `ShopToolbar` via `React.memo`) to eliminate redundant rerenders.
- Passed all Quality Gates (lint, typecheck, tests, production build) with zero warnings or errors.

---

## 📦 Version 2.6.0 — Premium Storefront Experience Sprint (Completed)
- **Progressive Web App (PWA)**: Added service worker precaching shell, offline fallbacks, app manifest properties, update popups, and install prompts.
- **Product Gallery Upgrade**: Added Framer Motion swipes, zoom-in scaling, fullscreen slides modal, and keyboard controls.
- **Advanced Search Experience**: Added instant keyword highlighting, query logs, matches overlays, and list index arrow key navigation.
- **Recently Viewed Horizontal shelf**: Converted vertical grids to a responsive horizontal swipe carousel with a clear log action.
- **Product Comparisons**: Managed compare Zustand states, CompareBar sticky layout tray, comparative details table, and Add to Cart shortcut triggers.
- **Reviews Polishing & Social Sharing**: Added verified icons, review count rating bars filters, helpful button click logs, and sharing modal options.

---

## 📦 Version 2.7.0 — Enterprise Commerce Intelligence Sprint (Completed)
- **Smart Recommendation Engine**: Built `useRecommendations` client-side query hooks selecting complementary categories (e.g. coffee to dates), trending, and frequently bought together items. Integrated swipeable carousels inside `ProductDetails.tsx`.
- **Multi-Value Enterprise Filtering**: Extended `useProductFilters.ts` to support multi-value query parameter serialization (`categories`, `brands`, `colors`, `sizes`). Mounted sidebar checkbox lists and individual active filter chips grid.
- **Premium Cart Experience**: Upgraded `useCartStore` with `savedForLater` state array and corresponding movement hooks (`moveToSaved`, `moveToCart`, `removeFromSaved`) rendered as a secondary grid under the active cart list, gift wrapping message configurations, undo deletion banners, and popular coupons suggester chips.
- **Checkout Polish**: Stepper layout progress indicators, delivery speed previews, and gift wrapping fees totals breakdown.
- **Standardized Micro-Interactions**: Configured smooth easing scales (98%) on pressed states, Cubic Bezier transitions (250ms), and custom focus indicator ring outlines for WCAG AA compliance.

---

## 📦 Version 3.0 — Admin Platform (Next)
- **Overview Dashboard**: Analytics dashboard graphing sales metrics, signups, and conversion values.
- **Products & Categories CRUD**: Administrative portals to add, edit, or delete items and category trees.
- **Inventory Control**: Real-time stock counters and supplier thresholds notification handlers.
- **Order Management Console**: Update delivery statuses (processing, shipped, complete), verify payments, and handle refund requests.
- **User Moderation & Analytics**: Review customer dispute logs and approve/reject product review submissions.

---

## 📦 Version 4.0 — Backend Integration
- **Remove Mock Services**: Swap local simulated latency arrays (`MOCK_PRODUCTS`, mock timers) for live server instances.
- **Connect Real APIs**: Map API endpoints using validated environment configurations.
- **Authentication Service Integration**: Connect native verification portals and session checks.
- **Transactional Hooks**: Integrate real APIs for Orders, Coupons, User Profiles, and Media uploads.

---

## 📦 Version 5.0 — Payments Integration
- **Saudi Gateway Bindings**: Integrate native payment endpoints supporting **Mada**, **Apple Pay**, and **STC Pay**.
- **Credit Card Integrations**: Implement secure checkout forms supporting Visa and Mastercard.
- **Refund webhook tracking**: Secure transaction confirmations and receipt notifications.

---

## 📦 Version 6.0 — Production Launch
- **Dockerization**: Create production Docker configurations for hosting nodes.
- **CI/CD Deployment Pipelines**: Configure automatic deployment flows on AWS/Vercel/Netlify.
- **Monitoring & Auditing**: Install server logging aggregators and error trackers (e.g., Sentry).
- **SEO & Performance Audit**: Optimize image loading, build code-split bundles, configure CDN caches, and implement structured schema tags.
