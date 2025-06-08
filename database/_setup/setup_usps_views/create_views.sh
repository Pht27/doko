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
DB_HOST=$(awk -F'=' '/^db_host_adress/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")

# ---------- SEARCH AND EXECUTE VIEW FILES ----------
echo "🔍 Searching for view definitions..."
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

find "$BASE_DIR" -type d -name "views" | while read -r views_dir; do
    for sql_file in "$views_dir"/VI_*.sql; do
        if [ -f "$sql_file" ]; then
            echo "📄 Creating view: $(basename "$sql_file")"
            mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$sql_file"
        fi
    done
done

echo "✅ All views created."
