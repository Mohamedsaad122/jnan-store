# Automated Testing Guide

This document outlines the testing strategy, frameworks, folder conventions, and mock architectures of Jnan Store.

---

## 1. Testing Frameworks & Tools

We use a two-tiered testing approach to verify component logic, store state transitions, hook behaviors, and complete user journeys:

| Test Type | Tools Used | Scope & Purpose |
| --- | --- | --- |
| **Unit & Integration** | Vitest, MSW, Zustand resetters | Services, mappers, helper utilities, and global stores |
| **Component** | React Testing Library, JSDOM | UI component rendering, user interactions, translation text checks, and accessibility |
| **End-to-End (E2E)** | Playwright (Headless Chromium) | Full multi-page workflows, page routing, form inputs, and redirects |

---

## 2. Directory Layout & Conventions

Test files are placed alongside the code they test to ensure cohesion and discoverability:

- **Component & Unit Tests**: Named `<module>.test.ts` or `<module>.test.tsx` and placed in the same folder as the source file:
  ```text
  src/components/ui/
  ├── Button.tsx
  └── Button.test.tsx
  ```
- **Zustand Store Tests**: Grouped under `src/store/stores.test.ts`.
- **Custom Hook Tests**: Grouped under `src/hooks/hooks.test.tsx`.
- **E2E Integration Specs**: Grouped under `tests/e2e/`.

---

## 3. Test Execution Commands

Available scripts in `package.json` for running tests:

```bash
# Run Vitest test runner (All Unit, Component, Store, and Hook tests)
npm run test

# Run Vitest test runner with interactive UI dashboard
npm run test:watch

# Run Playwright E2E tests (Make sure to run 'npx playwright install chromium' first)
npm run test:e2e
```

---

## 4. Unit & Component Test Environment

### Vitest Configuration (`vite.config.ts`)
Vitest is configured with `jsdom` to emulate a browser environment:
- **`globals: true`**: Exposes global test functions (like `describe`, `it`, `expect`, `vi`) automatically.
- **`setupFiles: './src/test/setup.ts'`**: Sets up the mock environment before running tests.

### Global Test Setup (`src/test/setup.ts`)
- **MSW Server Integration**: Boots up the MSW mock server before running tests and resets handlers after each test.
- **IntersectionObserver Mock**: Mocks `IntersectionObserver` as an ES6 class to support Framer Motion animations.
- **Window Media Mocks**: Mocks `window.matchMedia` configurations.
- **Zustand Store Resets**: Clears Zustand store state before each test run to ensure test isolation.

### Custom Component Render Wrapper (`src/test/render.tsx`)
UI components often depend on global context providers (e.g. routing, translations, or query caching). The custom `render` wrapper provides these contexts automatically:
- `MemoryRouter`: Mocks the routing environment.
- `QueryClientProvider`: Configures a clean TanStack Query client instance.
- `HelmetProvider`: Mocks document title and metadata updates.
- `i18next`: Configures translations.

> [!IMPORTANT]
> When testing components, always import the custom `render` wrapper from `@/test/render` rather than `@testing-library/react` to ensure these providers are initialized correctly.

---

## 5. Mocking Strategy

### API Request Interception (MSW)
We use **MSW (Mock Service Worker)** to intercept Axios requests. This allows us to test API integrations without making real network requests:
- Request interceptors are configured in `src/test/mocks/handlers.ts` to capture outgoing calls to `https://api.jnan-store.com/v1/*`.
- Handlers return mock data from `src/test/fixtures/` to simulate different API responses (such as successful login, validation failures, or item lookups).

---

## 6. Code Coverage Goals

- **Unit Tests (Utils & Mappers)**: **100% code coverage** is targeted.
- **Service Layer (API requests)**: Target **90% coverage**, including error scenarios (400 validation, 401 expiration, etc.).
- **Global Stores (Zustand)**: **100% coverage** for actions and state computations.
- **Components**: Focus on verifying core user flows, localized content, and disabled states.
