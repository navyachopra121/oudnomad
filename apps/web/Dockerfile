FROM node:20-alpine AS base
WORKDIR /app

# ── deps layer ────────────────────────────────────────────────────────────────
FROM base AS deps
COPY apps/web/package.json ./apps/web/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN corepack enable && pnpm install --filter web... --frozen-lockfile --ignore-scripts

# ── build layer ───────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_API_URL must be set at build time for static pages
ARG NEXT_PUBLIC_API_URL=https://oudnomaddubai.com/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN corepack enable && pnpm --filter web build

# ── runner layer (standalone) ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --chown=nextjs:nodejs --from=build /app/apps/web/.next/standalone ./
COPY --chown=nextjs:nodejs --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --chown=nextjs:nodejs --from=build /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
