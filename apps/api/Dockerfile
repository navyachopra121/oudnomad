FROM node:20-alpine AS base
WORKDIR /app

# --- deps stage ---
FROM base AS deps
COPY apps/api/package.json ./apps/api/
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN corepack enable && pnpm install --filter api... --frozen-lockfile

# --- build stage ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN corepack enable && pnpm --filter api db:generate
RUN corepack enable && pnpm --filter api build

# --- runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Run container as non-root user for security
USER node

COPY --chown=node:node --from=build /app/apps/api/dist ./dist
COPY --chown=node:node --from=build /app/apps/api/node_modules ./node_modules
COPY --chown=node:node --from=build /app/apps/api/prisma ./prisma
COPY --chown=node:node --from=build /app/apps/api/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main.js"]
