#!/bin/bash

# ---------- CONFIG ----------
CONFIG_FILE="config/database/db_config.ini"

# ---------- INI-WERTE LADEN ----------
DB_NAME=$(awk -F'=' '/^db_name/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_USER=$(awk -F'=' '/^db_user/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_PASSWORD=$(awk -F'=' '/^db_password/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_HOST=$(awk -F'=' '/^db_host_adress/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")

# ---------- PATH SETUP ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_PATH="$SCRIPT_DIR/../../venv"
PYTHON="$VENV_PATH/bin/python"
SQL_DIR="$SCRIPT_DIR/sql_queries"

# ---------- RUN PYTHON SCRIPTS ----------
echo "🔧 Activating Python venv and running Python scripts..."
"$PYTHON" "$SCRIPT_DIR/refactor_csvs.py"
"$PYTHON" "$SCRIPT_DIR/convert_csvs_to_sql.py"

# ---------- EXECUTE SQL QUERIES ----------
echo "🗃️  Running SQL files from $SQL_DIR..."
for sql_file in "$SQL_DIR"/*.sql; do
    echo "🚀 Running $sql_file..."
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$sql_file"
done
