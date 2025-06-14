#!/bin/bash

# ---------- CONFIG ----------
CONFIG_FILE="$1"
if [ -z "$CONFIG_FILE" ]; then
    echo "❌ No config file path provided."
    exit 1
fi

# ---------- INI-WERTE LADEN ----------
DB_NAME=$(awk -F'=' '/^db_name/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_USER=$(awk -F'=' '/^db_user/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_PASSWORD=$(awk -F'=' '/^db_password/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_HOST=$(awk -F'=' '/^db_host_address/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")

# ---------- PATH SETUP ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_PATH="$SCRIPT_DIR/../../../venv"
if [ -x "$VENV_PATH/bin/python" ]; then
    PYTHON="$VENV_PATH/bin/python"
else
    echo "⚠️  Virtual environment not found at $VENV_PATH. Falling back to system 'python'."
    PYTHON="python"
fi
SQL_DIR="$SCRIPT_DIR/sql_queries"


# ---------- CLEARING DIRECTORIES ----------
echo "✇ Clearing old SQL and CSV files..."
rm -f "$SCRIPT_DIR/sql_queries/"*.sql
rm -f "$SCRIPT_DIR/new_csvs/"*.csv
rm -f "$SCRIPT_DIR/static_csvs/"*.csv

# ---------- SQL AUSFÜHREN ----------
echo -e "$SQL_COMMANDS" | mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD"

# ---------- RUN PYTHON SCRIPTS ----------
echo "❯ Activating Python venv and running Python scripts..."
"$PYTHON" "$SCRIPT_DIR/create_static_csvs.py"
"$PYTHON" "$SCRIPT_DIR/refactor_csvs.py"
"$PYTHON" "$SCRIPT_DIR/convert_csvs_to_sql.py"

# ---------- EXECUTE SQL QUERIES ----------
echo "🗃️  Running SQL files from $SQL_DIR..."
for sql_file in "$SQL_DIR"/*.sql; do
    sql_name=$(basename "$sql_file")
    echo "🚀 Running $sql_name..."
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$sql_file"
done

# ---------- RUN add_profile_pictures.sql ----------
echo "📸 Running add_profile_pictures.sql..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$SCRIPT_DIR/add_profile_pictures.sql"
