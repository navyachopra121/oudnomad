FROM node:20-alpine AS base
WORKDIR /app

# --- deps stage ---
FROM base AS deps
COPY apps/web/package.json ./apps/web/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN corepack enable && pnpm install --filter web... --frozen-lockfile

# --- build stage ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && pnpm --filter web build

# --- runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER node

COPY --chown=node:node --from=build /app/apps/web/.next ./apps/web/.next
COPY --chown=node:node --from=build /app/apps/web/public ./apps/web/public
COPY --chown=node:node --from=build /app/apps/web/package.json ./apps/web/package.json
COPY --chown=node:node --from=deps /app/apps/web/node_modules ./apps/web/node_modules

EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "apps/web"]
