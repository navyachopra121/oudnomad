# Contributing to oudnomad-store

Thanks for working on this project. This document explains the workflow conventions to follow so the codebase stays clean and CI stays green.

---

## Branching Model

```
main   ──────────────────────────────────────────────────── production (auto-deploy)
         ↑ PR (reviewed + CI green)
dev    ──────────────────────────────────────────────────── staging (auto-deploy)
         ↑ PR (CI green)
feature/task-name  ──────── short-lived, one task per branch
```

### Rules
- **Never push directly to `main` or `dev`** — both have branch protection enabled.
- Branch from `dev`, not `main`.
- Keep feature branches short-lived. Merge and delete once the PR lands.
- One logical task per branch (e.g. `feature/user-auth`, `feature/product-listing`).

### Branch Naming
```
feature/short-description     # new features
fix/short-description         # bug fixes
chore/short-description       # dependency updates, config changes
docs/short-description        # documentation only
refactor/short-description    # code restructuring, no behavior change
```

---

## Commit Convention (Conventional Commits)

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <short imperative summary>

[optional body]

[optional footer: e.g. Closes #123]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior change |
| `chore` | Dependency updates, config, tooling |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |

### Examples

```
feat: add product variant management
feat: implement cart persistence for guest users
feat: add stripe checkout flow
fix: prevent duplicate order creation on double-submit
fix: correct tax calculation for EU region
refactor: simplify product service layer
chore: update prisma to 6.x
docs: document API authentication flow
test: add unit tests for order service
ci: cache pnpm store in GitHub Actions
```

### Rules
- Use the **imperative mood**: "add" not "added", "fix" not "fixed"
- Keep the summary line under 72 characters
- No period at the end of the summary
- Reference issues in the footer: `Closes #42`

---

## Pull Request Workflow

1. **Branch** from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-task-name
   ```

2. **Work** in small, focused commits following the convention above.

3. **Before opening a PR**, make sure locally:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```

4. **Open a PR** from `feature/*` → `dev`.
   - CI must pass (lint + typecheck + build).
   - Self-review before requesting review.
   - Keep PRs focused — one task per PR.

5. **Merge** using "Squash and merge" to keep `dev` history clean.

6. **Promote to main**: Open a PR from `dev` → `main` after staging validation. Requires one review.

---

## Code Style

- **TypeScript strict mode** is enabled in both apps. No `any` unless absolutely unavoidable (add a comment explaining why).
- **Prettier** handles formatting automatically — run `pnpm format` before committing.
- **ESLint** enforces linting — `pnpm lint` must return zero errors.
- **Imports**: Use absolute imports (`@/...`) inside each app. Avoid `../../..` chains.

---

## Database Changes

All schema changes go through **Prisma migrations**:

```bash
# Create a new migration (development)
pnpm db:migrate:dev --name describe-what-changed

# Apply migrations (staging/production)
pnpm db:migrate
```

**Never** edit the Supabase schema directly via the dashboard for anything other than quick experimentation. All changes must be captured in a migration file and committed.

---

## Environment Variables

- **Never commit `.env`** — it is gitignored.
- When adding a new required variable:
  1. Add it to `.env.example` with a comment explaining what it is and where to get it.
  2. Update your local `.env` with the real value.
  3. Add it to the relevant secrets in GitHub Actions if needed for CI.
