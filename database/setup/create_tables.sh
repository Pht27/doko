#!/bin/bash

# ---------- KONFIG ----------
CONFIG_FILE="config/database/db_config.ini"
SQL_FILE="database/setup/create_tables.sql"

# ---------- INI-WERTE LADEN ----------
DB_NAME=$(awk -F'=' '/^db_name/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_USER=$(awk -F'=' '/^db_user/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_PASSWORD=$(awk -F'=' '/^db_password/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_HOST=$(awk -F'=' '/^db_host_adress/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")

# ---------- PRÜFEN OB SQL-FILE EXISTIERT ----------
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ SQL-Datei '$SQL_FILE' nicht gefunden!"
    exit 1
fi

# ---------- SQL AUSFÜHREN ----------
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Tabellen erfolgreich in '$DB_NAME' erstellt."
else
    echo "❌ Fehler beim Ausführen von '$SQL_FILE'."
fi
