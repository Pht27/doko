#!/bin/bash

# ---------- INPUT VALIDATION ----------
CONFIG_FILE="$1"
if [ -z "$CONFIG_FILE" ]; then
    echo "❌ No config file path provided."
    exit 1
fi

# ---------- LOAD INI VALUES ----------
DB_NAME=$(awk -F'=' '/^db_name/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_USER=$(awk -F'=' '/^db_user/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_PASSWORD=$(awk -F'=' '/^db_password/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_HOST=$(awk -F'=' '/^db_host_address/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")

# ---------- SETUP ----------
echo "🔍 Searching for view definitions..."
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# ---------- PASS 1: CREATE EMPTY PLACEHOLDER VIEWS ----------
echo "🧱 Creating placeholder views..."
find "$BASE_DIR" -type d -name "views" | while read -r views_dir; do
    for sql_file in "$views_dir"/VI_*.sql; do
        if [ -f "$sql_file" ]; then
            view_name=$(basename "$sql_file" .sql)
            echo "🕳️ Creating placeholder for $view_name"
            echo "CREATE OR REPLACE VIEW \`$view_name\` AS SELECT 1 AS dummy_column;" \
                | mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"
        fi
    done
done

# ---------- PASS 2: REPLACE WITH REAL VIEW LOGIC ----------
echo "🚀 Creating real views..."
find "$BASE_DIR" -type d -name "views" | while read -r views_dir; do
    for sql_file in "$views_dir"/VI_*.sql; do
        if [ -f "$sql_file" ]; then
            echo "📄 Replacing view with logic: $(basename "$sql_file")"
            mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$sql_file"
        fi
    done
done

echo "✅ All views created successfully."
