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
5. **DTO**: Validated data payload structure representation.
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
2. **Axios Client**: Receives the response. Response interceptors handle global error checking (e.g., HTTP 401 triggers logout or refresh).
3. **API DTO**: Raw response is validated against TypeScript DTOs.
4. **Mapper / Adapter**: Maps API fields (e.g., `user_email`, `first_name`) to local domain fields (`email`, `firstName`).
5. **Domain Model**: Outputs a clean, strictly typed Domain object.
6. **Custom Hook / Store**: TanStack Query updates its cache, notify components, or Zustand dispatches actions.
7. **UI Component**: Displays the formatted data.

---

## 2. Axios Client & Interceptors

The base network configuration resides in `src/lib/api/apiClient.ts` (using the environment variable configuration `env.VITE_API_URL`).

### Request Interceptor
- Automatically injects the authentication token retrieved from `useAuthStore` into the request headers:
  ```typescript
  config.headers.Authorization = `Bearer ${token}`;
  ```
- Injects the active language locale code (`ar` or `en`) into the `Accept-Language` header to support server-side translations.

### Response Interceptor
- Processes successful responses and handles errors globally.
- Redirects users or resets tokens automatically if the server returns a `401 Unauthorized` status code.

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

## 4. API Mocking for Testing (Mock Service Worker)

During Vitest test runs, we intercept network requests using **MSW (Mock Service Worker)**:
- Outgoing requests to `https://api.jnan-store.com/v1/*` are intercepted by MSW handlers (`src/test/mocks/handlers.ts`) in the test runner.
- MSW returns standard HTTP responses matching our API's production payloads.
- This allows testing network scenarios, error handling, and authorization flows without running a live backend server.
