# Repository Folder Structure Guide

This document provides a detailed breakdown of the directory layout of Jnan Store, explaining the responsibility of each folder and the reasoning behind our design.

---

## 1. Directory Tree

Here is the top-level tree of Jnan Store's source folder (`src/`):

```text
src/
├── app/               # Global bootstrapper, routing tables, and core providers
├── assets/            # Static media resources (SVGs, localized graphics)
├── components/        # Shared stateless UI components (Buttons, Modals)
│   ├── ui/            # Basic UI primitives (Button, Input, QuantitySelector)
│   └── global/        # Shared global layout frames (Header, Footer, Navbar)
├── config/            # Strict configuration schemas and validation (Zod)
├── constants/         # Static global routing, settings, and roles maps
├── features/          # Domain-driven feature slices (Modular)
│   ├── auth/          # Authentication schemas, inputs, and OTP pages
│   ├── cart/          # Cart drawers and counters
│   ├── checkout/      # Address list, payment forms, and orders success
│   ├── home/          # Hero carousels, lists, and banners
│   └── products/      # Product tabs, related products, and reviews
├── hooks/             # Generic custom hooks (useLocalStorage, useDarkMode)
├── layouts/           # Structural page container grids (Default, Auth layouts)
├── lib/               # Third-party library initializations (Axios, i18n, React Query)
├── locales/           # Localized JSON translation directories (Arabic/English)
├── pages/             # Code-split page components (lazy loaders)
├── services/          # HTTP request handlers, mapper adapters, and mocks
├── store/             # Zustand state stores (Cart, Auth, Wishlist)
├── styles/            # CSS variables and Tailwind directive hooks
├── types/             # Common domain interfaces and types
└── utils/             # Reusable helper functions (debounce, storage, validators)
```

---

## 2. Directory Responsibilities

### `src/app/`
Contains the application root (`App.tsx`) and route mapping entries (`AppRoutes.tsx`). This folder is responsible for bootstrapping the app, registering the router, and configuring global providers (QueryClient, Helmet, Router).

### `src/components/`
Holds reusable UI elements shared across multiple features. It is divided into:
- **`ui/`**: Core primitives (like `Button.tsx`, `Input.tsx`, `QuantitySelector.tsx`) that contain minimal business logic and can be used anywhere.
- **`global/`**: Layout and structural elements that remain consistent across pages (e.g., `Header.tsx`, `Footer.tsx`).

### `src/config/`
Provides strict validation for environment variables at runtime (`env.ts`) using Zod. This prevents the application from booting if required variables (like `VITE_API_URL`) are missing.

### `src/features/`
Organized by functional business domains (e.g., `auth/`, `cart/`, `checkout/`, `products/`). Each feature folder is self-contained and groups components, hooks, schemas, and tests that belong to that domain. This minimizes directory hopping and allows features to be updated or replaced independently.

### `src/hooks/`
Contains generic, reusable React hooks (e.g., `useLocalStorage`, `useDarkMode`, `useCountdown`) that do not belong to a specific feature.

### `src/layouts/`
Provides structural layout wrappers (e.g. `DefaultLayout.tsx`, `AuthLayout.tsx`) that define the page grid and mount the React Router `<Outlet />`.

### `src/lib/`
Houses initializations and configurations for third-party libraries:
- **`api/`**: The Axios client configuration, including request/response interceptors and error mappings.
- **`react-query/`**: The TanStack Query client configuration.
- **`i18n/`**: The internationalization initialization.

### `src/locales/`
Contains translation JSON files for Arabic (`ar/translation.json`) and English (`en/translation.json`).

### `src/pages/`
Defines page-level components that act as route entry points. Pages are lazy-loaded to reduce initial bundle sizes.

### `src/services/`
Handles API integrations, data transformations (mapping DTOs to Domain models), and local mock datasets for offline execution.

### `src/store/`
Houses Zustand store definitions (e.g., `cart.store.ts`, `auth.store.ts`) that manage client-side state.

---

## 3. Rationale Behind the Structure

This folder structure was chosen to address key challenges in large-scale frontend applications:

1. **Scalability**: By organizing code into features, developers can add new business domains without cluttering shared directories.
2. **Decoupling**: Isolating API clients, mappers, and store files from components ensures that changes to the backend API or state management libraries do not affect UI components.
3. **High Cohesion, Low Coupling**: Placing components close to their feature-specific files ensures related code remains grouped together while keeping dependencies simple.
