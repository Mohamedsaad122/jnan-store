# Architectural Decisions Records (ADR)

This document records the architectural decisions made during the design and development of Jnan Store, detailing the technical choices, context, and alternatives considered.

---

## ADR 1: Zustand instead of Redux Toolkit

### Context
We needed a global state manager to sync client-only UI states (such as shopping cart items, wishlist bookmark lists, and user session tokens) across pages.

### Decision
We chose **Zustand** over Redux Toolkit.

### Consequences & Rationale
- **Minimal Boilerplate**: Zustand does not require action creators, action types, reducer configuration, or complex context providers. A store can be defined in a single file in under 30 lines.
- **Render Performance**: By using state selectors (`useCartStore(state => state.totalQuantity)`), components only re-render when the selected properties change.
- **Outside React Lifecycle**: Zustand stores can be accessed and updated directly from outside React components (e.g. within Axios request interceptors), making token management cleaner.

---

## ADR 2: TanStack Query (React Query) for Server State

### Context
We needed a way to manage remote server data fetching, loading flags, caching, pagination, and query status.

### Decision
We chose **TanStack Query (v5)**.

### Consequences & Rationale
- **Decoupled Caching**: Server data is cached automatically and updated in the background without manually writing fetch/loading reducers.
- **Pagination & Infinite Scroll**: Built-in support for page parameters and queries makes filtering product shelves simple.
- **Automatic Invalidation**: React Query automatically refetches stale data when mutating operations complete (e.g. invalidating query keys after submitting a coupon code or order).

---

## ADR 3: DTO and Mapper Layer Separation

### Context
Changes to backend API contracts (e.g., changing key names from snake_case to camelCase) can lead to broken UI components if data is directly bound.

### Decision
We introduced **DTO (Data Transfer Object) and Mapper** layers.

### Consequences & Rationale
- **Isolation**: API models are typed strictly as DTOs. Mappers translate these DTO fields to fit clean local Domain Models.
- **Single Point of Maintenance**: If backend property names change, we only update the mapper functions. React components remain unchanged.

---

## ADR 4: Feature-Based Directory Architecture

### Context
Traditional layered setups (grouping all files by file type, e.g., all components together, all store files together) become hard to navigate as the codebase grows.

### Decision
We adopted a **Feature-Based Directory Structure** under `src/features/`.

### Consequences & Rationale
- **High Cohesion**: Related UI components, custom hooks, and specs are grouped together within feature directories (e.g., `src/features/checkout/`), simplifying navigation.
- **Deletability**: A feature can be modified or deleted with minimal impact on the rest of the application.

---

## ADR 5: React Hook Form + Zod for Forms

### Context
Authentication registration, login, and shipping address inputs require strict validation before submission.

### Decision
We chose **React Hook Form** combined with **Zod** schema validations.

### Consequences & Rationale
- **Performance**: React Hook Form uses uncontrolled inputs under the hood to minimize re-renders.
- **Single Source of Truth**: Zod schemas validate both runtime inputs and compile-time TypeScript typings.

---

## ADR 6: Axios for the Network Client

### Context
We needed an HTTP client to manage requests, inject headers, format payloads, handle error mapping, and configure timeouts.

### Decision
We chose **Axios**.

### Consequences & Rationale
- **Interceptors**: Axios interceptors make it easy to inject authentication tokens and handle token refresh cycles globally.
- **Error Mapping**: Automatically converts network exceptions into typed error classes (`src/utils/errors.ts`) to normalize error handling.

---

## ADR 7: Tailwind CSS & Shadcn/UI for Styling

### Context
The user interface must look premium, modern, support RTL Arabic layouts, and run responsively.

### Decision
We chose **Tailwind CSS** combined with **Shadcn/UI** design parameters.

### Consequences & Rationale
- **RTL Support**: Tailwind CSS provides direct support for right-to-left layout directions via start/end helper utilities (e.g., `ps-4`, `pe-2`).
- **Performance**: Tailwind CSS compiles to utility classes to keep build sizes small.
- **Consistent Design Tokens**: Design parameters (spacing, colors, typography) are defined centrally to ensure visual consistency.
