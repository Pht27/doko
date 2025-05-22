#!/bin/bash

# ---------- KONFIG ----------
CONFIG_FILE="$1"
if [ -z "$CONFIG_FILE" ]; then
    echo "❌ No config file path provided."
    exit 1
fi

# ---------- INI-WERTE LADEN ----------
DB_NAME=$(awk -F'=' '/^db_name/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_USER=$(awk -F'=' '/^db_user/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_PASSWORD=$(awk -F'=' '/^db_password/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_HOST=$(awk -F'=' '/^db_host_adress/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")

# ---------- SQL-BEFEHLE VORBEREITEN ----------
SQL_COMMANDS=""
SQL_COMMANDS+="DROP DATABASE IF EXISTS \`$DB_NAME\`;\n"
SQL_COMMANDS+="CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;"

# ---------- SQL AUSFÜHREN ----------
echo -e "$SQL_COMMANDS" | mariadb -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD"

if [ $? -eq 0 ]; then
    echo "✅ Datenbank '$DB_NAME' erfolgreich erstellt."
    if $DROP_FIRST; then echo "ℹ️ Alte Version wurde vorher gelöscht."; fi
else
    echo "❌ Fehler beim Erstellen der Datenbank."
fi
