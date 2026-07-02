# Jnan Store (متجر جنان) Storefront Architecture

Jnan Store is an enterprise-scale, production-ready Saudi-inspired e-commerce storefront for coffee, nuts, sweets, spices, and gifts. It is built using **React 19 + TypeScript + Vite + Tailwind CSS**.

---

## 🛠 Tech Stack

- **Framework**: React 19
- **Type Checking**: TypeScript (Strict Mode)
- **Bundler & Build Tooling**: Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS & Shadcn/UI
- **State Management**: Zustand
- **Data Fetching & Cache**: TanStack Query (v5)
- **Networking**: Axios
- **Form Validation**: React Hook Form & Zod
- **Animations**: Framer Motion
- **Localization (i18n)**: i18next
- **Carousel slider**: Swiper
- **Charts**: Recharts
- **Notification alerts**: React Hot Toast

---

## 📂 Folder Structure

```text
src/
├── app/               # Application-wide bootstraps, routes definitions, and App root
├── assets/            # Static assets like images, SVGs, and brand assets
├── components/        # Reusable stateless atomic UI components (Buttons, Modals)
├── config/            # Strict Environment configuration validation schemas (Zod)
├── constants/         # Static enums, roles, keys, and API path maps
├── context/           # Low-frequency react-context layers (Auth context)
├── features/          # Domain-driven features layers (auth, shop, cart, checkout)
├── hooks/             # Custom reusable hooks (useLocalStorage, useDarkMode)
├── interfaces/        # blueprinted interface signatures and services contracts
├── layouts/           # Structural layout containers (Default, Auth, Admin layouts)
├── lib/               # Custom configuration modules (i18n, queryClient)
├── locales/           # Arabic (RTL) and English (LTR) JSON translate sheets
├── pages/             # Code-split lazy page modules (18 core views templates)
├── schemas/           # Zod validation schemas for forms
├── services/          # API services folders (Axios instance, auth service APIs)
├── store/             # Zustand stores holding UI states, Cart, Wishlist, Notifications
├── styles/            # Tailwind base directives and variables index.css
├── types/             # Common TypeScript typings (auth payloads, domain models)
└── utils/             # Pure helper utilities (date formatters, local storage base)
```

---

## 📐 Coding Rules & Best Practices

1. **Zero Raw meta-environments**:
   Never access `import.meta.env` directly outside `src/config/env.ts`. Query variables using the validated configuration module:
   ```typescript
   import { env } from '@/config/env';
   const url = env.VITE_API_URL;
   ```
2. **Absolute Import Aliasing**:
   Always import using absolute alias paths starting with `@/` to ensure maintainability:
   ```typescript
   import { useCartStore } from '@/store/cart.store';
   ```
3. **No Direct Storage Mutations**:
   Query or mutate browser state tables exclusively using the utilities defined in `src/utils/storage.ts` or custom hooks like `useLocalStorage`. Use `secureStorage` for storing tokens.
4. **Strict Typing**:
   Avoid using `any`. If custom shapes cannot be predetermined, fall back to `unknown` or define them in generic constraints.

---

## 🏷 Naming Conventions

- **Components / Pages / Layouts**: PascalCase (e.g., `DefaultLayout.tsx`, `ProductCard.tsx`).
- **Hooks**: camelCase starting with `use` (e.g., `useLocalStorage.ts`).
- **Zustand stores**: filename ends with `.store.ts` (e.g., `auth.store.ts`).
- **Helper Utilities**: camelCase (e.g., `formatCurrency.ts`).
- **Constants**: UPPER_SNAKE_CASE (e.g., `ROUTES.SHOP`).

---

## 🌿 Git Branching Strategy

- **`main`**: Production-ready branch. Keeps only fully verified code chunks.
- **`dev`**: Daily integration branch. Keeps latest merged features.
- **Feature Branches (`feat/...`)**: Individual developers write features here (e.g., `feat/cart-logic`).
- **Bug Fix Branches (`fix/...`)**: Patches and quick corrections (e.g., `fix/header-rtl`).

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (version 18+ recommended)
- npm or pnpm

### 1. Installation
Install all dependencies with legacy peer resolutions to allow React 19 libraries to link:
```bash
npm install --legacy-peer-deps
```

### 2. Development Mode
Start the local server at `http://localhost:3000`:
```bash
npm run dev
```

### 3. Linting and Formatting
To verify linting errors and code format rules:
```bash
npm run lint
npm run format
```

### 4. Build Compilation
Compile TypeScript assets and bundle the Vite output for production:
```bash
npm run build
```

---

## 🛠 How to Add New Features

To add a new domain feature (e.g. `reviews`):
1. Create a subfolder under `src/features/reviews`.
2. Add review-specific types in `src/types/domain.ts` (already prepared).
3. If endpoints are needed, add route endpoints in `src/constants/apiEndpoints.ts`.
4. Call `apiClient` inside `src/services/` or `src/features/reviews/services/`.
5. Connect query states using TanStack query and expose states via hooks.
