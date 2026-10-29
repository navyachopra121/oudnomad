FROM node:20-alpine AS base
WORKDIR /app

# ── deps layer ────────────────────────────────────────────────────────────────
FROM base AS deps
COPY apps/notification-worker/package.json ./apps/notification-worker/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN corepack enable && pnpm install --filter notification-worker... --frozen-lockfile

# ── build layer ───────────────────────────────────────────────────────────────
FROM base AS builder
COPY package.json pnpm-workspace.yaml ./
COPY apps/notification-worker/ ./apps/notification-worker/
COPY apps/api/prisma ./apps/api/prisma
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/notification-worker/node_modules ./apps/notification-worker/node_modules
# Call the prisma binary directly — avoids Prisma's auto-install detection
# (which fires when it can't find package.json in /app/apps/)
RUN cd apps/notification-worker && \
    ./node_modules/.bin/prisma generate --schema=../api/prisma/schema.prisma
RUN corepack enable && pnpm --filter notification-worker build

# ── runner layer ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 workergroup && \
    adduser --system --uid 1001 workeruser

COPY --chown=workeruser:workergroup --from=builder /app/apps/notification-worker/dist ./dist
COPY --chown=workeruser:workergroup --from=deps /app/apps/notification-worker/node_modules ./node_modules
# Copy the generated Prisma client binaries into the runtime image
COPY --chown=workeruser:workergroup --from=builder /app/apps/notification-worker/node_modules/.prisma ./node_modules/.prisma

USER workeruser

CMD ["node", "dist/index.js"]
