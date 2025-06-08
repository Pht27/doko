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
echo "🔍 Searching for init UPSs..."
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

find "$BASE_DIR" -type f -path "*/usps/*.sql" | while read -r usp_file; do
    if grep -q "RUN_ON_DB_CREATION" "$usp_file"; then
        usp_name=$(basename "$usp_file")

        # Extract procedure name by removing 'SP_' prefix and '.sql' suffix
        proc_name="${usp_name}"
        proc_name="${proc_name%.sql}"

        echo "⚙️ Running init USP: $usp_name"
        mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME" -e "CALL $proc_name();"
    fi
done

echo "✅ Ran all init USPs."
