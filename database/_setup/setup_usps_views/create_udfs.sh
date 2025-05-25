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

# ---------- SEARCH AND EXECUTE UDF FILES ----------
echo "🔍 Searching for UDF definitions..."
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

find "$BASE_DIR" -type d -name "udfs" | while read -r udfs_dir; do
    for sql_file in "$udfs_dir"/DF_*.sql; do
        if [ -f "$sql_file" ]; then
            echo "📄 Creating UDF: $(basename "$sql_file")"
            mariadb -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$sql_file"
        fi
    done
done

echo "✅ All UDFs created."
