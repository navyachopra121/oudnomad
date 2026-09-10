# oudnomad-store

Single-vendor ecommerce platform for physical goods — multi-region, multi-currency, region-based tax rules.

**Stack**: Next.js 14 · NestJS 10 · PostgreSQL (Supabase) · Prisma · Redis · BullMQ · Stripe · Cloudinary · Docker

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Minimum version | Install |
|------|----------------|---------|
| Node.js | 22.x | [nodejs.org](https://nodejs.org) |
| pnpm | 11.x | `npm install -g pnpm` |
| Docker Desktop | Any recent | [docker.com](https://www.docker.com/products/docker-desktop) |
| Git | 2.x | [git-scm.com](https://git-scm.com) |

External accounts required (Phase 0):
- **Supabase** — managed PostgreSQL ([supabase.com](https://supabase.com))
- **Cloudinary** — image/file storage ([cloudinary.com](https://cloudinary.com))
- **Stripe** — payments ([stripe.com](https://stripe.com))

---

## Setup

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/oudnomad-store.git
cd oudnomad-store

# 2. Install all dependencies (both apps + root)
pnpm install

# 3. Create your local .env from the template
cp .env.example .env
# → Open .env and fill in your real credentials (see "Environment Variables" below)

# 4. Start local Docker services (Redis with AOF persistence)
docker compose up -d

# 5. Run database migrations against Supabase
pnpm db:migrate

# 6. Start development servers (frontend + backend, runs in parallel)
pnpm dev
```

After `pnpm dev`, you'll have:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health check**: http://localhost:3001/health
- **Prisma Studio**: `pnpm db:studio` → http://localhost:5555

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string (Session mode, port 5432) | Supabase dashboard → Settings → Database → Connection string |
| `REDIS_URL` | Redis connection URL | Default: `redis://localhost:6379` (local Docker) |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | Same as above (use a different value) |
| `STRIPE_SECRET_KEY` | Stripe secret key (test: `sk_test_...`) | Stripe dashboard → Developers → API Keys |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test: `pk_test_...`) | Same as above |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `stripe listen --forward-to localhost:3001/payments/webhook` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Cloudinary dashboard → Settings → Access Keys |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Same as above |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Same as above |
| `EMAIL_PROVIDER` | Email provider (`resend` / `sendgrid` / `mailgun`) | Your choice |
| `EMAIL_API_KEY` | Email provider API key | Provider dashboard |
| `EMAIL_FROM_ADDRESS` | Sender email address | e.g. `noreply@yourdomain.com` |
| `NODE_ENV` | Environment (`development` / `production`) | Set to `development` locally |
| `PORT` | NestJS API port | Default: `3001` |
| `NEXT_PUBLIC_API_URL` | Backend URL used by the frontend | Default: `http://localhost:3001` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | Default: `http://localhost:3000` |

---

## Project Structure

```
oudnomad-store/
├── apps/
│   ├── web/                # Next.js 14 — App Router, TypeScript, Tailwind CSS
│   └── api/                # NestJS 10 — REST API, Prisma, BullMQ
│       └── prisma/
│           └── schema.prisma
├── packages/               # Shared utilities/types (added in Phase 1+)
├── .github/
│   └── workflows/
│       └── ci.yml          # Lint + typecheck + build on every PR
├── docker-compose.yml      # Redis (local dev only)
├── .env.example            # Environment variable template
├── pnpm-workspace.yaml     # pnpm workspaces config
├── turbo.json              # Turborepo pipeline
└── README.md
```

---

## Common Commands

```bash
# Development
pnpm dev                    # Start both apps in parallel
pnpm --filter web dev       # Frontend only
pnpm --filter api dev       # Backend only (watch mode)

# Database
pnpm db:migrate:dev         # Create + apply new migration (dev)
pnpm db:migrate             # Apply pending migrations (staging/prod)
pnpm db:generate            # Regenerate Prisma client after schema change
pnpm db:studio              # Open Prisma Studio (visual DB browser)

# Code quality
pnpm lint                   # Lint all packages
pnpm lint:fix               # Lint + auto-fix
pnpm typecheck              # Type-check all packages (no emit)
pnpm format                 # Format all files with Prettier

# Docker
docker compose up -d        # Start Redis in background
docker compose down         # Stop all containers
docker compose logs -f      # Tail container logs

# Build (production)
pnpm build                  # Build all packages
```

---

## Architecture

```
Browser (Next.js 14)
    │  REST API calls
    ▼
NestJS API (port 3001)
    │           │           │
    ▼           ▼           ▼
Supabase    Redis       Cloudinary
(PostgreSQL) (cache/queue) (media)
    │
Prisma ORM
    │
BullMQ jobs ─→ Redis
    │
Stripe (payments)
```

**Key design decisions:**
- Supabase is used as a managed PostgreSQL host — Prisma owns all schema/migrations.
- Redis runs locally in Docker for dev; use Redis Cloud or a managed Redis in production.
- BullMQ uses the same Redis instance for job queuing (order processing, emails, etc.).
- All media (product images) goes through Cloudinary — no local file storage.

---

## Branch & Contribution Model

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full branching model, commit convention, and PR workflow.

**Quick reference:**
```
main   → production (requires PR review + CI)
dev    → staging (requires CI)
feature/* → one task per branch, branch from dev
```

---

## License

Private — all rights reserved.
