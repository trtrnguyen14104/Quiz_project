#!/bin/bash

# Cấu hình kết nối PostgreSQL
DB_NAME="quiz_project"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Thư mục chứa migration files
MIGRATION_DIR="./database/migrations"

echo "🚀 Bắt đầu chạy migrations cho database: $DB_NAME"

# Lặp qua tất cả file .sql trong thư mục migrations theo thứ tự tên file
for file in $(ls $MIGRATION_DIR/*.sql | sort); do
  echo "👉 Đang chạy migration: $file"
  psql -U $DB_USER -d $DB_NAME -h $DB_HOST -p $DB_PORT -f "$file"
done

# Thư mục chứa seed files
SEED_DIR="./database/seeds"

echo "🚀 Bắt đầu chạy seed dữ liệu cho database: $DB_NAME"

# Lặp qua tất cả file .sql trong thư mục seeds
for file in $SEED_DIR/*.sql; do
  echo "👉 Đang chạy seed: $file"
  psql -U $DB_USER -d $DB_NAME -h $DB_HOST -p $DB_PORT -f "$file"
done


echo "✅ Hoàn tất seed dữ liệu!"