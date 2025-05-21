#!/bin/bash

# --drop um existierende db zu droppen

# ---------- KONFIG ----------
CONFIG_FILE="config/database/db_config.ini"
DROP_FIRST=false

# ---------- OPTIONEN PARSEN ----------
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --drop) DROP_FIRST=true ;;
        *) echo "❌ Unbekannte Option: $1" && exit 1 ;;
    esac
    shift
done

# ---------- INI-WERTE LADEN ----------
DB_NAME=$(awk -F'=' '/^db_name/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_USER=$(awk -F'=' '/^db_user/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_PASSWORD=$(awk -F'=' '/^db_password/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")
DB_HOST=$(awk -F'=' '/^db_host_adress/ {gsub(/ /, "", $2); print $2}' "$CONFIG_FILE")

# ---------- SQL-BEFEHLE VORBEREITEN ----------
SQL_COMMANDS=""
if $DROP_FIRST; then
    SQL_COMMANDS+="DROP DATABASE IF EXISTS \`$DB_NAME\`;\n"
fi
SQL_COMMANDS+="CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;"

# ---------- SQL AUSFÜHREN ----------
echo -e "$SQL_COMMANDS" | mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD"

if [ $? -eq 0 ]; then
    echo "✅ Datenbank '$DB_NAME' erfolgreich erstellt."
    if $DROP_FIRST; then echo "ℹ️ Alte Version wurde vorher gelöscht."; fi
else
    echo "❌ Fehler beim Erstellen der Datenbank."
fi
