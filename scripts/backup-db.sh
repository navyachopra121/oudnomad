#!/bin/bash
set -euo pipefail

# -----------------------------------------------------------------------------
# OudNomad Database Backup Script (Encrypted & Size-Guarded)
# -----------------------------------------------------------------------------

DATABASE_URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/oudnomad}"
BACKUP_REPO_DIR="${BACKUP_REPO_DIR:-/tmp/oudnomad-backups}"
BACKUP_GPG_PASSPHRASE="${BACKUP_GPG_PASSPHRASE:-change-this-in-prod-environment}"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DUMP_FILE="/tmp/backup-${TIMESTAMP}.sql.gz"
ENCRYPTED_FILE="${DUMP_FILE}.gpg"

echo "Starting Postgres database dump..."
pg_dump "$DATABASE_URL" | gzip > "$DUMP_FILE"

# Size Check Guard: max 80MB (83,886,080 bytes)
SIZE=$(stat -c%s "$DUMP_FILE" 2>/dev/null || stat -f%z "$DUMP_FILE")
MAX_SIZE=$((80 * 1024 * 1024))

echo "Dump created. Size: ${SIZE} bytes (Threshold: ${MAX_SIZE} bytes)."

if [ "$SIZE" -gt "$MAX_SIZE" ]; then
  echo "ERROR: Backup size (${SIZE} bytes) exceeds 80MB threshold (${MAX_SIZE} bytes)." >&2
  echo "Aborting backup to prevent exceeding GitHub file size limits. Switch destination storage immediately." >&2
  rm -f "$DUMP_FILE"
  exit 1
fi

echo "Encrypting dump file with GPG (AES256)..."
gpg --symmetric --cipher-algo AES256 --batch --passphrase "$BACKUP_GPG_PASSPHRASE" -o "$ENCRYPTED_FILE" "$DUMP_FILE"
rm -f "$DUMP_FILE"

if [ -d "$BACKUP_REPO_DIR" ]; then
  mkdir -p "${BACKUP_REPO_DIR}/backups/daily"
  cp "$ENCRYPTED_FILE" "${BACKUP_REPO_DIR}/backups/daily/backup-${TIMESTAMP}.sql.gz.gpg"
  cd "$BACKUP_REPO_DIR"
  if [ -d ".git" ]; then
    git add "backups/daily/backup-${TIMESTAMP}.sql.gz.gpg"
    git commit -m "Backup ${TIMESTAMP}" || true
    git push origin main || echo "Warning: Git push failed. Backup retained locally."
  fi
fi

rm -f "$ENCRYPTED_FILE"
echo "Database backup completed successfully at ${TIMESTAMP}."
