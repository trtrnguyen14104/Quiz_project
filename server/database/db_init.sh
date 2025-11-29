
#!/bin/bash

set -e

# Đọc từng dòng trong .env
export $(grep -v '^#' .env | xargs)

log() {
  echo "[INFO] $1"
}

export PGPASSWORD="$PG_PASSWORD"

MIGRATION_DIR="./database/migrations"

log "Bắt đầu chạy migrations cho database: $PG_DATABASE"

# Lặp qua tất cả file .sql trong thư mục migrations theo thứ tự tên file
for file in $(ls $MIGRATION_DIR/*.sql | sort); do
  log "Đang chạy migration: $file"
  psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -f "$file"
done