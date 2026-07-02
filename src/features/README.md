# `/src/features/`

This folder houses feature-based modules. This structure divides the store by domain to ensure scalability.

Each domain folder should contain its own:
- Components (feature-specific UI components).
- Hooks (feature-specific hooks).
- Services (API queries/mutations).
- Types (custom type contracts).

Standard domains:
- `auth`: Sign in, sign up, verify tokens.
- `products`: Product listings, category filters, details.
- `cart`: Cart actions, item drawer list.
- `checkout`: Multi-step checkout details, summaries.
- `orders`: Order tracking and invoices.
