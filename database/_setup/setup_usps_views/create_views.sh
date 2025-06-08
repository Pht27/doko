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
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
declare -A PRIORITY_GROUPS
NO_PRIORITY=()

# ---------- FIND AND SORT VIEW FILES ----------
while IFS= read -r -d '' file; do
    first_line=$(head -n 1 "$file")
    if [[ "$first_line" =~ ^--[[:space:]]*priority[[:space:]]+([0-9]+) ]]; then
        priority="${BASH_REMATCH[1]}"
        PRIORITY_GROUPS["$priority"]+="$file"$'\n'
    else
        NO_PRIORITY+=("$file")
    fi
done < <(find "$BASE_DIR" -type f -name 'VI_*.sql' -print0)

# ---------- EXECUTE IN ORDER ----------
echo "🚀 Creating views based on priority..."

# Sort and run by priority
for priority in $(printf "%s\n" "${!PRIORITY_GROUPS[@]}" | sort -n); do
    echo "🔢 Running priority $priority views..."
    while IFS= read -r view_file; do
        [ -z "$view_file" ] && continue
        view_name=$(basename "$view_file")
        echo "📄 Executing $view_name"
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$view_file"
    done <<< "${PRIORITY_GROUPS[$priority]}"
done

# Then run views with no priority
if [ ${#NO_PRIORITY[@]} -gt 0 ]; then
    echo "🔻 Running views with no priority..."
    for view_file in "${NO_PRIORITY[@]}"; do
        view_name=$(basename "$view_file")
        echo "📄 Executing $view_name"
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$view_file"
    done
fi

echo "✅ All views created."
