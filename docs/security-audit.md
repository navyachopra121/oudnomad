# OudNomad Security Audit & Hardening Report (OWASP Top 10)

This document details the security self-audit and hardening controls verified across the OudNomad codebase for Phase 10 compliance.

---

## OWASP Top 10 Category Audits

### 1. A01:2021 — Broken Access Control
- **Audit Findings**:
  - **Admin Controllers**: All `/admin/*` routes in `OrdersAdminController`, `UsersAdminController`, `NotificationsAdminController`, `ReviewsAdminController`, `InventoryAdminController` are protected with `@Roles(UserRole.ADMIN)` at the controller class level.
  - **Ownership Verification**: Customer order queries (`GET /orders/:id`) explicitly assert `order.userId === req.user.sub`. User address, cart, review edit/delete, and wishlist endpoints restrict modifications strictly to `req.user.sub`.
- **Status**: `PASS`

---

### 2. A02:2021 — Cryptographic Failures
- **Audit Findings**:
  - **Password Storage**: Passwords hashed using Argon2 (`argon2.hash()`) with secure salt/work factors. No plain-text passwords stored or logged.
  - **Token Management**: Password reset tokens use cryptographic UUIDs (`PasswordResetToken`), hashed token storage (`tokenHash`), and strict 15-minute expiry windows with one-time `usedAt` invalidation.
  - **Stripe & Payment Signatures**: Stripe webhook signature verification (`stripe.webhooks.constructEvent`) is enforced before processing events.
- **Status**: `PASS`

---

### 3. A03:2021 — Injection
- **Audit Findings**:
  - **Database Queries**: All database interactions use Prisma ORM parameterized queries.
  - **Raw SQL Inspection**: Phase 9 recommendation batch query (`$queryRaw`) uses static SQL template literals without direct string interpolation of user input.
  - **OpenSearch Query Building**: Search queries construct structured OpenSearch Query DSL objects rather than interpolating raw user text into JSON fields.
- **Status**: `PASS`

---

### 4. A04:2021 — Insecure Design
- **Audit Findings**:
  - **Order State Machine**: Strict state transition validation in `orders.service.ts` prevents illegal status skips (e.g. transitioning `PENDING_PAYMENT` straight to `DELIVERED`).
  - **Admin Lockout Guard**: User service prevents demoting or blocking the final remaining active administrator account.
- **Status**: `PASS`

---

### 5. A05:2021 — Security Misconfiguration
- **Audit Findings**:
  - **Port Isolation**: OpenSearch (9200) and Redis (6379) ports are unexposed in `docker-compose.yml` and bound exclusively to the internal Docker network.
  - **Environment Variables**: `.env` files are excluded in `.gitignore` and build scripts prevent baking secrets into container images.
- **Status**: `PASS`

---

### 6. A06:2021 — Vulnerable and Outdated Components
- **Audit Findings**:
  - **Automated Dependency Checks**: GitHub Dependabot enabled for security updates.
  - **CI Security Gate**: `npm audit` / `pnpm audit` configured to fail CI builds on High/Critical severity vulnerabilities.
- **Status**: `PASS`

---

### 7. A07:2021 — Identification and Authentication Failures
- **Audit Findings**:
  - **Rate Limiting**: NestJS Throttler backed by Redis enforces strict limit (5 req/min) on `/auth/login`, `/auth/forgot-password`, and `/auth/reset-password`.
  - **Account Blocking**: Setting `isBlocked = true` immediately revokes active refresh tokens in `refresh_tokens` table.
- **Status**: `PASS`

---

### 8. A08:2021 — Software and Data Integrity Failures
- **Audit Findings**:
  - **Deterministic Lockfiles**: Monorepo builds require `pnpm-lock.yaml` / `package-lock.json` lockfiles in CI (`pnpm install --frozen-lockfile`).
  - **Webhook Payload Verification**: Signature checks prevent forged webhook payloads from altering payment or shipment states.
- **Status**: `PASS`

---

### 9. A09:2021 — Security Logging and Monitoring Failures
- **Audit Findings**:
  - **Audit Logging**: All administrative actions (user blocking, role changes, inventory adjustments, refunds, review removals) write immutable rows to `AuditLog`.
  - **Authentication Failures**: Failed logins and rate-limit rejections emit structured warnings to stdout / log files.
- **Status**: `PASS`

---

### 10. A10:2021 — Server-Side Request Forgery (SSRF)
- **Audit Findings**:
  - **Cloudinary Uploads**: Media uploads process multipart file streams directly or use signed upload presets without making server-initiated HTTP requests to arbitrary user-supplied URLs.
- **Status**: `PASS`

---

## Audit Summary
- **Total Categories Audited**: 10
- **Pass Rate**: 100% (10 PASS, 0 FAIL)
- **Audit Date**: September 12, 2026
