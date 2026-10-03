#!/bin/bash
set -e
cd /var/www/oudnomad/apps/api
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oudnomad?schema=public"

echo "Pushing Prisma Schema..."
npx --yes prisma@6.12.0 db push --schema=prisma/schema.prisma

echo "Seeding Database..."
npx --yes tsx prisma/seed.ts

echo "DB_MIGRATION_AND_SEED_SUCCESSFUL"
