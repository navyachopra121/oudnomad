FROM node:20-alpine AS base
WORKDIR /app

# ── deps layer ────────────────────────────────────────────────────────────────
FROM base AS deps
COPY apps/api/package.json ./apps/api/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN corepack enable && pnpm install --filter api... --frozen-lockfile

# ── build layer ───────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN corepack enable && pnpm --filter api db:generate
RUN corepack enable && pnpm --filter api build

# ── runtime layer ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 apigroup && \
    adduser --system --uid 1001 apiuser

COPY --chown=apiuser:apigroup --from=build /app/apps/api/dist ./dist
COPY --chown=apiuser:apigroup --from=build /app/apps/api/node_modules ./node_modules
COPY --chown=apiuser:apigroup --from=build /app/apps/api/prisma ./prisma
COPY --chown=apiuser:apigroup --from=build /app/apps/api/package.json ./package.json

# Create uploads directory for in-house storage
RUN mkdir -p /app/uploads && chown apiuser:apigroup /app/uploads

USER apiuser

EXPOSE 3001
CMD ["node", "dist/main.js"]
