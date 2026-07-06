# State Management Architecture Guide

This document details the state management strategy of Jnan Store, explaining how we divide responsibilities between client-only UI state, cached server data, local component states, and persistence.

---

## 1. State Division Strategy

We categorize application state into three distinct zones based on lifetime and origin:

```
                  ┌──────────────────────────────────────────┐
                  │          State Division Model            │
                  └──────────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
 ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
 │ Server State │              │ Global Client│              │  Local State │
 │ (React Query)│              │   (Zustand)  │              │ (useState)   │
 └──────────────┘              └──────────────┘              └──────────────┘
 - API cache                   - Cart items                   - Toggles
 - Product listing             - Auth tokens                  - Form inputs
 - Coupon check                - Active language              - Active tab index
```

---

## 2. Server State (TanStack Query)

We use **TanStack Query (v5)** for data that originates from a remote server. It handles caching, loading states, mutations, and automatic background updates.

### Query Strategy
- **Query Keys**: Structured hierarchically using a central factory dictionary (`src/lib/react-query/queryKeys.ts`). This ensures query keys are consistent and prevents duplicate fetch keys.
- **Stale Time**: Defaults to 5 minutes (`1000 * 60 * 5`) for general products and categories.
- **GC Time (Garbage Collection)**: Caches remain in memory for 10 minutes before garbage collection.
- **Queries**: Fetched dynamically and enabled only when required parameters (such as `productId`) are present.
  ```typescript
  export const useProductDetails = (idOrSlug: string) => {
    return useQuery({
      queryKey: queryKeys.product(idOrSlug),
      queryFn: () => productsService.getProductById(idOrSlug),
      enabled: !!idOrSlug,
    });
  };
  ```

### Mutation & Invalidation Strategy
When a write operation occurs (e.g. updating a user profile or submitting an order):
1. React Query triggers a mutation.
2. Upon success, we call `queryClient.invalidateQueries` to mark related cache entries as stale, triggering an automatic refresh of the visual page interface.
3. This keeps server data synchronized across page transitions.

---

## 3. Global Client State (Zustand)

For client-side data shared across multiple features, we use **Zustand**. It is lightweight, has no boilerplate, and runs outside the React render cycle for improved performance.

### Zustand Stores in Jnan Store:
* **`useCartStore`**: Manages cart items, coupon validation states, and handles totals, taxes, and shipping calculations.
* **`useAuthStore`**: Manages authenticated user profiles, login/logout transitions, and handles `accessToken`/`refreshToken` state.
* **`useWishlistStore`**: Client-side UI drawer/modal states. Wishlist data listings are managed by React Query.
* **`useAddressStore`**: Client-side UI modal open/close transitions. Shipping addresses list data is managed by React Query.
* **`useLanguageStore`**: Manages the active language locale code (`ar` | `en`) and toggles document layouts (`rtl` / `ltr`).
* **`useThemeStore`**: Manages visual theme modes (`light` | `dark`).

### Optimization with Selectors
To prevent components from re-rendering when unrelated store properties change, components should select only the specific state values they need:
```typescript
// Good: Component only re-renders if cart item quantity changes
const totalQuantity = useCartStore((state) => state.totalQuantity);

// Avoid: Component re-renders on any cart store update (such as drawer toggle)
const { totalQuantity, isOpen } = useCartStore();
```

---

## 4. Derived State Optimization

Derived state (data calculated from existing state, such as cart subtotals or filtered product lists) should be computed on-the-fly during render or cached using selectors rather than stored in state:

- **Cart Totals**: Computed dynamically in the store whenever items are added or removed:
  ```typescript
  const calculateTotals = (items: CartItemState[], coupon: Coupon | null) => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // Add VAT, shipping, and discounts
    return { totalQuantity, totalAmount };
  };
  ```
- **Filter Parameters**: The `useProductFilters` hook computes filter parameters dynamically without duplicating category state.

---

## 5. Local State & UI State

Component-level state (e.g. modal open toggles, password visibility states, or raw text input values) is kept local using standard React `useState` hooks. 

### Guidelines for Local State:
- If state is only used by a single component and its children (via props), use local React state.
- Avoid placing highly active transient states (like raw form inputs) into global Zustand stores, as this can cause unnecessary re-renders.

---

## 6. Persistence Strategy

Zustand stores that need to persist across page reloads (such as `useCartStore`, `useAuthStore`, and `useWishlistStore`) leverage Zustand's **persist middleware**:

* **Storage Engines**:
  - `useCartStore` uses standard `localStorage` to persist items.
  - `useAuthStore` uses a secure storage wrapper to safeguard session tokens.
* **Hydration**: Configured to hydrate synchronously during app boot to prevent layout shifts.
