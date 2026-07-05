# Contributor Guidelines

Thank you for contributing to Jnan Store! To maintain code quality and consistencies across our enterprise codebase, all contributors must follow the guidelines outlined below.

---

## 1. Git Branching Strategy

We follow a structured branch naming convention based on the type of work being done:

* **Feature Development**: `feat/description-of-change` (e.g. `feat/apply-coupons`)
* **Bug Fixes**: `fix/description-of-bug` (e.g. `fix/cart-item-row-quantity`)
* **Refactoring**: `refactor/description` (e.g. `refactor/quantity-selector`)
* **Documentation**: `docs/description` (e.g. `docs/testing-setup`)
* **Build/CI/CD Configuration**: `chore/ci-workflow` or `chore/husky-config`

### Branch Flow
1. Branch off of the `dev` branch.
2. Complete coding, local typecheck checks, lint checking, and test runs.
3. Open a Pull Request targeting `dev`.
4. Peer review and automated CI validation checks must pass before merging.
5. The `dev` branch is merged into `main` periodically for release deployments.

---

## 2. Commit Message Conventions

We enforce the **Conventional Commits** standard using `commitlint` and `husky`. Every commit message is validated before check-in and must follow this structure:

```
<type>(<scope>): <description>
```

### Allowed Commit Types:
- **`feat`**: A new feature.
- **`fix`**: A bug fix.
- **`refactor`**: Code changes that neither fix a bug nor add a feature.
- **`docs`**: Documentation updates.
- **`test`**: Adding new tests or fixing existing ones.
- **`chore`**: Maintenance tasks, dependencies updates, or build configs.

### Examples:
- `feat(cart): implement coupon validation check`
- `fix(checkout): resolve address selection modal crash`
- `refactor(ui): extract generic quantity selector`
- `chore(deps): install vitest and react-testing-library`

---

## 3. Pull Request Checklist

Before submitting a Pull Request, ensure that:

- [ ] **Typecheck**: `npm run typecheck` passes with no errors.
- [ ] **Linter**: `npm run lint` passes with no warnings or errors.
- [ ] **Code Format**: Code is formatted using `npm run format`.
- [ ] **Test Coverage**: All Vitest test suites (`npm run test`) pass.
- [ ] **E2E Scenarios**: E2E test runs (`npm run test:e2e`) pass.
- [ ] **Build Validation**: The production build compiles successfully (`npm run build`).
- [ ] **Documentation**: Any code changes that modify API contracts or architecture are documented in the `docs/` folder.

---

## 4. Coding Standards

- **TypeScript**: Avoid using `any`. If a type cannot be determined beforehand, use `unknown` or define generic interfaces.
- **Imports Aliasing**: Use absolute imports starting with `@/` instead of relative paths:
  ```typescript
  // Correct
  import { useCartStore } from '@/store/cart.store';

  // Incorrect
  import { useCartStore } from '../../../store/cart.store';
  ```
- **Environment Variables**: Never access `import.meta.env` directly. Use the validated `env` configuration from `src/config/env.ts`.
- **Formatting**: We use Prettier for code formatting. Ensure your editor is configured to format on save, or run `npm run format` manually.
