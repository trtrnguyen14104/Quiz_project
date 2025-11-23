
#!/bin/bash

set -e

# Cấu hình kết nối PostgreSQL
DB_URL="${DB_URL}"

# Thư mục chứa migration files
MIGRATION_DIR="./database/migrations"

log "Bắt đầu chạy migrations cho database: $DB_NAME"

# Lặp qua tất cả file .sql trong thư mục migrations theo thứ tự tên file
for file in $(ls $MIGRATION_DIR/*.sql | sort); do
  log "Đang chạy migration: $file"
  psql "$DB_URL" -f "$file"
done