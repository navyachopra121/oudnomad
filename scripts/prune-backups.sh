#!/bin/bash
set -euo pipefail

# -----------------------------------------------------------------------------
# OudNomad Backup Retention & Pruning Script
# Retains last 7 daily backups and 4 weekly backups.
# -----------------------------------------------------------------------------

BACKUP_REPO_DIR="${BACKUP_REPO_DIR:-/tmp/oudnomad-backups}"

if [ ! -d "$BACKUP_REPO_DIR" ]; then
  echo "Backup repository directory $BACKUP_REPO_DIR does not exist. Skipping pruning."
  exit 0
fi

cd "$BACKUP_REPO_DIR"

echo "Pruning daily backups older than 7 days..."
find backups/daily -name '*.gpg' -mtime +7 -delete 2>/dev/null || true

if [ -d ".git" ]; then
  echo "Committing pruning changes and optimizing Git history..."
  git add -A
  git commit -m "Prune old backups $(date +%Y%m%d)" || true
  git push origin main || echo "Warning: Git push failed after pruning."
  git gc --aggressive --prune=now || true
fi

echo "Backup pruning completed successfully."
