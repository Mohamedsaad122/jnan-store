# API Architecture & Integration Guide

This document outlines the API data architecture of Jnan Store, explaining how data flows between the user interface, custom hooks, service layers, mapping adapters, network clients, and backend APIs.

---

## 1. Request & Response Flows

To keep presentation and network layers decoupled, data undergoes explicit transformation steps.

### Request Flow (UI ➔ Backend)

```
[ UI Component ] (Captures click, form submit, or page load event)
       │
       ▼
[ Custom Hook ] (React Query Mutation or Query hook coordinates params)
       │
       ▼
[ Domain Service ] (authService, productsService, etc. defines logic and paths)
       │
       ▼
[ Mapper / Adapter ] (Formats domain object structures to match API expectations)
       │
       ▼
[ Data Transfer Object (DTO) ] (Strict contract representation of the payload shape)
       │
       ▼
[ Axios Client ] (Appends auth tokens, sets content types, handles serialization)
       │
       ▼
[ REST API / Backend ] (Processes request)
```

1. **UI Component**: The user interacts with the page (e.g., clicks "Add to Cart" or submits a login form).
2. **Custom Hook**: Captures parameters and triggers a React Query mutation or query execution.
3. **Domain Service**: Method gets called with arguments. It provides the endpoint path and handles logical parameters.
4. **Mapper / Adapter**: If the backend requires a different format, the mapper transforms our camelCase UI models to the snake_case or specific format required by the API.
5. **DTO**: Validated data payload structure representation. No UI components directly consume or import DTO shapes.
6. **Axios Client**: Sends the HTTP request. It attaches headers such as `Authorization: Bearer <token>` and `Accept-Language: ar`.
7. **REST API / Backend**: Receives the request and performs operations.

---

### Response Flow (Backend ➔ UI)

```
[ REST API / Backend ] (Returns raw JSON response payload)
       │
       ▼
[ Axios Client ] (Intercepts response, handles response formats, check status codes)
       │
       ▼
[ API DTO ] (Typescript type representation of the raw API response)
       │
       ▼
[ Mapper / Adapter ] (Translates snake_case and raw structures to camelCase Domain Models)
       │
       ▼
[ Domain Model ] (Clean interface used throughout the React UI app)
       │
       ▼
[ Custom Hook / Store ] (Caches result inside TanStack Query or dispatches to store)
       │
       ▼
[ UI Component ] (Receives clean domain model and re-renders visually)
```

1. **REST API / Backend**: Responds with a JSON payload (e.g., containing user profile info).
2. **Axios Client**: Receives the response. Response interceptors handle global error checking (e.g., HTTP 401 triggers token refresh and queue processing).
3. **API DTO**: Raw response is validated against TypeScript DTOs.
4. **Mapper / Adapter**: Maps API fields (e.g., `user_email`, `first_name`) to local domain fields (`email`, `firstName`).
5. **Domain Model**: Outputs a clean, strictly typed Domain object.
6. **Custom Hook / Store**: TanStack Query updates its cache, notifies components, or Zustand dispatches actions.
7. **UI Component**: Displays the formatted data.

---

## 2. Axios Client & Interceptors

The base network configuration resides in `src/lib/api/axios.ts` (using the environment variable configuration `env.VITE_API_BASE_URL` and a default timeout threshold of 10000ms).

### Request Interceptor
- Automatically injects the active authentication token from `localStorage`:
  ```typescript
  config.headers.Authorization = `Bearer ${token}`;
  ```

### Response Interceptor & Automatic Token Refresh
To handle token expiry (HTTP 401 Unauthorized), the response interceptor implements a queue-based token refresh mechanism:
1. **Detection**: Catches HTTP `401 Unauthorized` responses.
2. **Token Refresh Request**: Initiates a POST request to `/auth/refresh-token` passing the stored `auth_refresh_token`.
3. **Queue Mechanism**: While the token refresh is in flight, subsequent incoming requests are queued.
4. **Retry**: Upon successful token renewal, the new token is saved in `localStorage`, and the queued pending requests are automatically retried with the updated authorization header.
5. **Purge**: If the refresh request itself fails, the local session variables are wiped and the user is redirected to the login flow.

---

## 3. Global Error Handling & Normalization

All network request errors are intercepted and mapped to structured TypeScript error classes defined in `src/utils/errors.ts`:

* **`ValidationError` (HTTP 400)**: Maps nested backend validation messages (e.g. database validation failures) into key-value pairs to populate form alerts automatically.
* **`UnauthorizedError` (HTTP 401)**: Triggered when authentication credentials have expired or are missing.
* **`ForbiddenError` (HTTP 403)**: Thrown when the current user's role lacks the necessary permissions.
* **`NotFoundError` (HTTP 404)**: Indicates that the requested resource could not be found.
* **`ConflictError` (HTTP 409)**: Thrown when a unique constraint is violated (e.g., registering an email that is already in use).
* **`UnknownServerError` (HTTP 500)**: Captures general internal server errors.

---

## 4. Query Client & Retry Policies

We customize TanStack Query (`src/lib/queryClient.ts`) to prevent wasteful retries on known client-side errors:
* **Max Retries**: Set to `2` for server errors or network faults.
* **Retry Filter**: Requests encountering client-side validation errors (HTTP 4xx series) are never retried.

---

## 5. Request Cancellation

To avoid race conditions and save bandwidth, the request engine supports Axios `AbortController` signals. You can cancel requests by passing `signal` within the Axios request configurations:
```typescript
const controller = new AbortController();
const products = await productsService.getProducts({
  signal: controller.signal
});

// To cancel the request
controller.abort();
```

---

## 6. Hybrid Service API Feature Toggles

To enable seamless testing and development, each service is built to dynamically switch between **Mock Dataset Mode** and **Live REST API Mode** utilizing environment settings alone.
* Configuration flag `VITE_ENABLE_MOCK_API` (exposed through `featureFlags.enableMockApi`) controls the routing direction.
* **Zustand Optimistic States**: Stores (such as `useAddressStore` and `useNotificationStore`) update local states synchronously to keep the UI instant, then execute optional background backend API syncs only when live API mode is activated.
