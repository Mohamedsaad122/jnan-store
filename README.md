# Jnan Store (متجر جنان) 🇸🇦

[![Production Build](https://github.com/Mohamedsaad122/jnan-store/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/Mohamedsaad122/jnan-store/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Vitest Coverage](https://img.shields.io/badge/Vitest-Coverage%2080%25-green.svg)](https://vitest.dev/)
[![E2E Coverage](https://img.shields.io/badge/Playwright-E2E%20Covered-brightgreen.svg)](https://playwright.dev/)

Jnan Store is a state-of-the-art, enterprise-grade Saudi e-commerce storefront specializing in premium dates, specialty coffee, fresh nuts, traditional sweets, and guesthouse brassware. Crafted with React 19, TypeScript, Vite, Tailwind CSS, and Zustand, it provides a seamless shopping experience localized in both Arabic and English.

---

## 🌟 Project Vision

To preserve and promote traditional Saudi hospitality and heritage through a premium, high-performance digital commerce platform. Jnan Store scales across desktop and mobile devices, ensuring speed, security, full keyboard accessibility, and robust internationalization.

---

## 🚀 Key Features

* **Bi-directional Localization (i18n)**: Out-of-the-box Arabic (RTL, font: *Tajawal*) and English (LTR, font: *Inter*) layout directions.
* **Feature-Based Clean Architecture**: Separation of concerns based on distinct functional boundaries (Auth, Shop, Cart, Checkout, Profile).
* **Robust State Management**: Zustand for global client-side UI configurations (Cart items, languages, theme, modal toggles) and TanStack Query (v5) for cache-first async server states (products, categories, orders, wishlist, addresses, notifications).
* **Reusable UI Components**: Clean UI primitives with flexible style overrides (Tailwind CSS + Shadcn design parameters).
* **Comprehensive Test Suites**: Strict coverage patterns via Vitest + RTL (unit/integration) and Playwright (end-to-end user journeys).
* **Strict Quality Gates**: GHA pipelines, Prettier formatting, ESLint rules (`--max-warnings 0`), Husky git hooks, and Conventional Commit specifications.

---

## 🛠 Tech Stack

| Technology Layer | Tooling Selection | Purpose |
| --- | --- | --- |
| **Framework Core** | React 19 (Strict Mode) | Component-driven UI framework |
| **Build Tooling** | Vite | High-performance dev server and bundler |
| **Static Types** | TypeScript (Strict Mode) | Strict typing safety and contracts |
| **Client Routing** | React Router DOM v6 | Code-split client navigation |
| **Style Sheet** | Tailwind CSS & Shadcn | Utility-first layout styles |
| **Global State** | Zustand | Low-overhead reactive UI states |
| **Remote Queries** | TanStack Query v5 | Caching, synchronization, and pagination |
| **Network Client** | Axios | Intercepted HTTP client |
| **Form Engine** | React Hook Form + Zod | Schema-based data validation |
| **Animation Engine** | Framer Motion | Fluid interface motions |
| **Test Runner** | Vitest + RTL | Isolated unit & component testing |
| **E2E Testing** | Playwright | Full web integration flows |

---

## 📐 Architecture Overview

Jnan Store uses a **Feature-Based Clean Architecture** split into specialized logical boundaries. Each feature folder contains its own UI components, state stores, services, and tests.

```
UI Components (DefaultLayout / Page Router)
  │
  ▼
React Query Hooks (Caching, mutations & status tracking)
  │
  ▼
Domain Services (Http calls & local mock controllers)
  │
  ▼
Mappers & Schemas (Transforms raw network DTOs into domain objects)
  │
  ▼
Axios Network Layer (Security headers, JSON formatting, interceptors)
```

---

## 📂 Folder Structure

The repository structure isolates functional modules and application-wide configurations cleanly:

```text
jnan-store/
├── .github/workflows/    # GitHub Actions CI pipelines
├── .husky/               # Git pre-commit and commit-msg hooks
├── docs/                 # Detailed architectural documentation
├── tests/e2e/            # Playwright End-to-End integration tests
├── src/
│   ├── app/              # Router bootstrap, GHA targets, and main App component
│   ├── assets/           # Media components, icons, and brand graphics
│   ├── components/       # Shared UI components (Buttons, Input, Modal, Breadcrumb)
│   ├── config/           # Validated environment schemas (Zod schema checking)
│   ├── constants/        # Global routes maps, API routes, and language settings
│   ├── features/         # Modular feature folders (auth, cart, checkout, home, products)
│   │   └── <feature>/    # Each feature holds its component, hooks, and tests
│   ├── hooks/            # Generic custom hooks (useLocalStorage, useDarkMode)
│   ├── layouts/          # Layout wrappers (DefaultLayout, AuthLayout)
│   ├── lib/              # Library clients setup (Axios API, i18n configure, QueryClient)
│   ├── locales/          # Translation directories (ar/en translation JSONs)
│   ├── pages/            # Code-split lazy view routing modules
│   ├── services/         # Core API services (Auth, Products, Orders, Coupons)
│   ├── store/            # Global Zustand stores (Cart, Wishlist, Themes)
│   ├── styles/           # Global styles and Tailwind base directives
│   ├── types/            # Project-wide TypeScript interfaces and contracts
│   └── utils/            # Helper utils (debounce, date formatter, currency utils)
```

---

## 🖼 Screenshots Placeholders

### 1. Storefront Desktop Showcase
![Storefront Showcase Desktop](docs/assets/placeholders/desktop_showcase.png)

### 2. Mobile Responsive Grid View
![Mobile Showcase Grid](docs/assets/placeholders/mobile_showcase.png)

---

## 📦 Installation & Setup

Follow these steps to run Jnan Store locally on your developer machine:

### Prerequisites
* Node.js (version 18+ recommended)
* npm (v9+ or equivalent package manager)

### 1. Clone the Repository
```bash
git clone https://github.com/Mohamedsaad122/jnan-store.git
cd jnan-store
```

### 2. Install Dependencies
Install modules using legacy peer resolutions due to React 19 dependencies for third-party libraries:
```bash
npm install --legacy-peer-deps
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory. Review [Environment Variables](#environment-variables) for configuration parameters.

### 4. Run Development Server
```bash
npm run dev
```
The server will boot at `http://localhost:3000`.

---

## 🔑 Environment Variables

The project uses Zod schema validation inside `src/config/env.ts` to ensure all critical env parameters exist at runtime.

| Key | Example Value | Description |
| --- | --- | --- |
| `VITE_API_URL` | `https://api.jnan-store.com/v1` | Backend REST API endpoint url |
| `VITE_APP_NAME` | `Jnan Store` | Storefront branding text |

Never access `import.meta.env` directly outside `src/config/env.ts`. Import env parameters using the validated wrapper:
```typescript
import { env } from '@/config/env';
console.log(env.VITE_API_URL);
```

---

## 🛠 Available Scripts

You can execute the following scripts in the project root:

* `npm run dev`: Boot local development server with hot module reloading.
* `npm run build`: Compile TypeScript classes and bundle Vite assets for production.
* `npm run typecheck`: Run typescript compiler verification in non-emitting mode (`tsc --noEmit`).
* `npm run lint`: Verify ESLint rules across the directory. Strict warning cap is enforced (`--max-warnings 0`).
* `npm run format`: Prettify project code layouts.
* `npm run test`: Run the Vitest test runner for unit and store checks.
* `npm run test:e2e`: Execute E2E integration scenarios with Playwright headless browser drivers.
* `npm run bundle-report`: Visualize build bundles using `vite-bundle-visualizer`.
* `npm run prepare`: Setup Husky hooks locally on development checkout.

---

## 🧪 Testing

Jnan Store uses a multi-layered testing paradigm. For detailed instructions, refer to [TESTING.md](docs/TESTING.md).

```bash
# Execute unit/integration/store tests
npm run test

# Run Playwright E2E scenarios
npm run test:e2e
```

---

## ⛓ CI/CD Pipeline

The project integrates GitHub Actions for continuous integration. The pipeline configuration is found inside `.github/workflows/ci.yml`.

On every Pull Request and main push, the pipeline automates:
1. Cache verification for `node_modules`
2. Installation of all dependencies
3. ESLint style validation
4. TypeScript validation checks
5. Vitest execution
6. Production bundling checks

---

## 🌐 Deployment

For complete hosting checklists, read [DEPLOYMENT.md](docs/DEPLOYMENT.md).

* **Hosting target**: Vercel or Netlify (static bundle deployment).
* **Artifact output directory**: `/dist` (produced by running `npm run build`).

---

## ⚡ Performance Optimization

* **Code Splitting**: Routes are dynamically imported using React `lazy` to decrease initial chunk loads.
* **Component Optimization**: Selectors inside Zustand state bindings prevent component over-renders.
* **Image Delivery**: Resizable web format images with progressive lazy-loading profiles (`loading="lazy"`).

---

## ♿ Accessibility (A11y)

* **Semantic HTML**: Structural landmarks (`main`, `nav`, `section`, etc.) are consistently used.
* **Accessible Actions**: Interactive inputs are labeled using native `<label>` configurations or `aria-label` definitions.
* **Contrast Indices**: Color palettes are styled using tailwind variables conforming with WCAG AA accessibility contrast ratios.

---

## 🌍 Internationalization (i18n)

The project leverages `i18next` for seamless language changes. Key translation catalogs are placed inside `src/locales/`:
- **`ar`**: Arabic locale translations.
- **`en`**: English language catalog.

Language stores detect locale preferences and adjust standard page layouts (`dir="rtl"` vs `dir="ltr"`) dynamically.

---

## 🗺 Future Roadmap

Review our extended milestones in [ROADMAP.md](docs/ROADMAP.md).

* **Version 1.0 (Completed)**: Core Foundation, Storefront UI components, Cart, Checkout flow, JWT Authentication, and Quality testing pipeline.
* **Version 2.0 (Current)**: Customer Account Dashboard (Phases 5.1 - 5.4) - Overview Home, Profile Settings, Address Book, Orders tracking, notifications.
* **Version 3.0**: Admin Management Console (Products CRUD, order lists, coupons, inventory, and role security).
* **Version 4.0**: Full Backend REST Integration (connecting live APIs and removing local mocks).
* **Version 5.0**: Payment Gateway Bindings (Mada, Apple Pay, STC Pay, Visa, Mastercard).
* **Version 6.0**: Production Launch setup (Docker, CI/CD pipelines, SSL, CDN, SEO, and optimization).

---

## 🤝 Contributing

We welcome contributions to Jnan Store! Please check [CONTRIBUTING.md](docs/CONTRIBUTING.md) to understand branch guidelines, code review standards, and commit structures.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for full details.
