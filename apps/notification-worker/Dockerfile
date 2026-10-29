FROM node:20-alpine AS base
WORKDIR /app

# ── deps layer ────────────────────────────────────────────────────────────────
FROM base AS deps
COPY apps/notification-worker/package.json ./apps/notification-worker/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN corepack enable && pnpm install --filter notification-worker... --frozen-lockfile

# ── build layer ───────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/notification-worker/node_modules ./apps/notification-worker/node_modules
COPY . .
RUN corepack enable && pnpm --filter notification-worker db:generate
RUN corepack enable && pnpm --filter notification-worker build

# ── runner layer ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 workergroup && \
    adduser --system --uid 1001 workeruser

COPY --chown=workeruser:workergroup --from=build /app/node_modules ./node_modules
COPY --chown=workeruser:workergroup --from=build /app/apps/notification-worker/node_modules ./apps/notification-worker/node_modules
COPY --chown=workeruser:workergroup --from=build /app/apps/notification-worker/dist ./apps/notification-worker/dist
COPY --chown=workeruser:workergroup --from=build /app/apps/notification-worker/prisma ./apps/notification-worker/prisma
COPY --chown=workeruser:workergroup --from=build /app/apps/notification-worker/package.json ./apps/notification-worker/package.json

USER workeruser
WORKDIR /app/apps/notification-worker

CMD ["node", "dist/index.js"]
