# Project Roadmap

This document outlines the completed milestones of Jnan Store and details our plan for future development phases.

---

## 1. Completed Milestones

- [x] **Phase 1: Foundation & Design System**
  - Project initialization with Vite, React 19, TypeScript, and Tailwind CSS.
  - Setup core design tokens, colors (gold, slate, warm shades), and animations.
  - Setup UI components (Button, Input, Dropdown, Modal, Toast alerts).
  - Setup localized layout structure (AR/EN language switcher, LTR/RTL support).
- [x] **Phase 2: Core Storefront Features**
  - **Home**: Banner carousels, categories, featured items, and recommendations.
  - **Shop**: Category filtering, price sorting, search, and lazy image loading.
  - **Product Details**: Variant selections, tabbed technical specs, and reviews list.
  - **Cart**: Slide-out drawer, item quantities management, and subtotals calculation.
  - **Wishlist**: Toggle bookmark state with local storage persistence.
- [x] **Phase 3: Checkout & Authentication**
  - **Authentication**: JWT token storage, OTP input, password reset, and registration.
  - **Checkout**: Address selection, coupon validations, shipping fees, VAT computation, and order placement.
- [x] **Phase 4: Testing & DevOps**
  - **Testing**: Setup Vitest, React Testing Library, and Playwright. Added 80+ unit/integration specs and 6 E2E flows.
  - **DevOps**: Setup GitHub Actions CI workflow, Husky pre-commit hooks, Commitlint, and Conventional Commits.

---

## 2. Future Development Roadmap

### Phase 5: Production Payment Gateways
- **Mada & Apple Pay Integration**: Bind native Saudi payment gateways and Apple Pay using secure merchant gateways.
- **Order Tracking API**: Enable order status webhooks (e.g. processing, dispatched, delivered) and map tracking IDs to SMS notifications.

### Phase 6: Vendor & Admin Portals
- **Vendor Dashboard**: Create interfaces for merchants to list products, manage inventory levels, and check sales metrics.
- **Admin Management Console**: Create role-based dashboards to manage active users, update coupon codes, and handle customer dispute reports.

### Phase 7: Architecture Scale & Performance
- **Next.js Transition**: Migrate to Next.js / Server-Side Rendering (SSR) to improve search engine optimization (SEO) and speed up first contentful paint times.
- **Enhanced Search**: Integrate Algolia or Elasticsearch for fast product lookup.
- **Progressive Web App (PWA)**: Support offline shopping carts, push notifications, and local caching.
