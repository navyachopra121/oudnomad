FROM node:20-alpine AS base
WORKDIR /app

# ── deps layer ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY apps/notification-worker/package.json ./apps/notification-worker/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN corepack enable && pnpm install --filter notification-worker... --frozen-lockfile

# ── build layer ─────────────────────────────────────────────────────────────
FROM base AS builder
COPY apps/notification-worker/ ./apps/notification-worker/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/notification-worker/node_modules ./apps/notification-worker/node_modules
RUN corepack enable && pnpm --filter notification-worker build

# ── runner layer ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: non-root user
USER node

COPY --chown=node:node --from=builder /app/apps/notification-worker/dist ./dist
COPY --chown=node:node --from=deps /app/apps/notification-worker/node_modules ./node_modules

CMD ["node", "dist/index.js"]
