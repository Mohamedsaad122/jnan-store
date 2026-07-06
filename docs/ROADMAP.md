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

## 📦 Version 2.5 — Backend Integration Foundation (Completed)

### 🚀 Phase 2.5.1 — API Infrastructure
- Structured API domains, mapped DTO payloads to clean camelCase entities, built Axios clients with automatic token refresh, and implemented retry policies.

### 🚀 Phase 2.5.2 — API Integration & Data Synchronization
- Standardized query key factory namespaces under a centralized key registry.
- Migrated all dashboard state lists (Addresses, Wishlist, Notifications, Sessions) to React Query hooks.
- Refactored Zustand stores to delete redundant server state lists, maintaining only UI triggers.
- Achieved 116 passing unit and integration tests.

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
