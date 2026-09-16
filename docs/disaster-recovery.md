# OudNomad Disaster Recovery (DR) Runbook

This document details the operational runbook and restore procedures for recovering the OudNomad ecommerce platform from data corruption or complete server loss.

---

## Recovery Objectives

- **Recovery Point Objective (RPO)**: **24 Hours** (Worst-case data loss boundary based on daily automated backup cadence).
- **Recovery Time Objective (RTO)**: **45 Minutes** (Target duration to restore database and services on a fresh VPS node).

---

## Prerequisites & Required Credentials

- Access to private backup Git repository containing encrypted `.gpg` dumps.
- `BACKUP_GPG_PASSPHRASE` secret (stored in password manager / secret store outside the VPS).
- Target Postgres database connection string (`DATABASE_URL`).
- Hostinger VPS root / SSH access and Docker Compose environment.

---

## Restoration Procedure (Database Restore)

### Step 1: Fetch Latest Encrypted Backup
```bash
git clone git@github.com:your-org/oudnomad-backups.git /tmp/backups
cd /tmp/backups/backups/daily
LATEST_BACKUP=$(ls -t *.gpg | head -n1)
echo "Latest backup file: $LATEST_BACKUP"
```

### Step 2: Decrypt & Decompress Dump
```bash
export BACKUP_GPG_PASSPHRASE="<YOUR_GPG_PASSPHRASE>"
gpg --decrypt --batch --passphrase "$BACKUP_GPG_PASSPHRASE" -o /tmp/restore.sql.gz "$LATEST_BACKUP"
gunzip -f /tmp/restore.sql.gz
```

### Step 3: Restore to Postgres Database
```bash
# Drop existing public schema tables (or restore into fresh database)
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql "$DATABASE_URL" < /tmp/restore.sql
rm -f /tmp/restore.sql
```

### Step 4: Verification & Smoke Test
```bash
# Verify product count
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM products;"

# Verify latest order status
psql "$DATABASE_URL" -c "SELECT id, status, total FROM orders ORDER BY created_at DESC LIMIT 5;"
```

---

## Full VPS Disaster Recovery (Complete Server Rebuild)

In the event of complete Hostinger VPS hardware failure or loss:

1. **Provision Fresh VPS**: Spin up Ubuntu 24.04 VPS (8GB RAM, Docker & Docker Compose installed).
2. **Clone Codebase**:
   ```bash
   git clone https://github.com/your-org/oudnomad.git /app
   cd /app
   ```
3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   # Populate DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, RESEND_API_KEY, etc.
   ```
4. **Restore Postgres Database**: Execute Steps 1–3 above to restore database state.
5. **Launch Docker Services**:
   ```bash
   docker compose up -d
   ```
6. **Rebuild Search & Recommendation Indices**:
   ```bash
   # Re-index products into OpenSearch
   pnpm --filter api npx tsx ../../scripts/reindex-products.ts

   # Recompute recommendations
   curl -X POST http://localhost:3001/api/admin/recommendations/recompute \
     -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
   ```
7. **DNS Switchover**: Update Cloudflare DNS A record to point to new VPS public IP address.

---

## Quarterly Restore Drill Protocol

To ensure backup integrity and team readiness, perform this restore drill every 90 days:
1. Spin up a temporary local Postgres container (`docker run --name dr-test -p 5433:5432 -e POSTGRES_PASSWORD=test -d postgres:16`).
2. Run decrypt and restore procedure against port 5433.
3. Assert row count equality between production database and restored test container.
4. Record drill completion date, RTO timing, and operator name in compliance log.
