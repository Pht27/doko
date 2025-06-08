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

# ---------- FUNCTION TO GENERATE PLACEHOLDER SQL ----------
generate_placeholder_from_view_file() {
    local sql_file="$1"
    local view_name
    view_name=$(basename "$sql_file" .sql)

    # Extract column aliases
    columns=$(awk '
        BEGIN {in_select=0}
        /SELECT/ {in_select=1; next}
        in_select && /FROM/ {exit}
        in_select {
            gsub(/--.*/, "")
            gsub(/,[[:space:]]*$/, "", $0)
            if (NF > 0) {
                if (tolower($0) ~ / as /) {
                    split($0, parts, / as /); print parts[2];
                } else {
                    n=split($0, parts, " "); print parts[n];
                }
            }
        }
    ' "$sql_file" | tr '\n' ',' | sed 's/,$//')

    if [ -z "$columns" ]; then
        columns="dummy_column"
    fi

    echo "CREATE OR REPLACE VIEW \`$view_name\` AS SELECT $(echo "$columns" | sed 's/[^,]*/NULL AS &/g');"
}

# ---------- FIND ALL VIEW FILES ----------
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VIEW_FILES=()

while IFS= read -r -d '' file; do
    VIEW_FILES+=("$file")
done < <(find "$BASE_DIR" -type f -name 'VI_*.sql' -print0)

# ---------- PASS 1: PLACEHOLDER CREATION ----------
echo "🧱 Creating placeholder views..."
for sql_file in "${VIEW_FILES[@]}"; do
    view_name=$(basename "$sql_file")
    echo "📄 Creating placeholder: $view_name"
    placeholder_sql=$(generate_placeholder_from_view_file "$sql_file")
    echo "$placeholder_sql" | mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"
done

# ---------- PASS 2: REAL VIEW CREATION ----------
echo "🚀 Creating real views..."
for sql_file in "${VIEW_FILES[@]}"; do
    view_name=$(basename "$sql_file")
    echo "📄 Replacing view with logic: $view_name"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$sql_file"
done

echo "✅ All views created."
