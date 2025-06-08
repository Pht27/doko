#!/bin/bash

# ---------- KONFIG ----------
CONFIG_FILE="$1"
if [ -z "$CONFIG_FILE" ]; then
    echo "❌ No config file path provided."
    exit 1
fi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/sql_queries/fill_static_tables.sql"

# ---------- INI-WERTE LADEN ----------
DB_NAME=$(awk -F'=' '/^db_name/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_USER=$(awk -F'=' '/^db_user/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_PASSWORD=$(awk -F'=' '/^db_password/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_HOST=$(awk -F'=' '/^db_host_address/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")

# ---------- PRÜFEN OB SQL-FILE EXISTIERT ----------
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ SQL-Datei '$SQL_FILE' nicht gefunden!"
    exit 1
fi

# ---------- SQL AUSFÜHREN ----------
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Statische Tabellen erfolgreich in '$DB_NAME' gefüllt."
else
    echo "❌ Fehler beim Ausführen von '$SQL_FILE'."
fi
