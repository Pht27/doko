#!/bin/bash

CONFIG_FILE="config/database/db_config.ini"

USE_TEST_DATA=false
USE_OLD_DATA=false

# Check for --test_data flag
if [[ "$1" == "--test_data" ]]; then
    USE_TEST_DATA=true
fi

# Check for --old_data flag
if [[ "$1" == "--old_data" ]]; then
    USE_OLD_DATA=true
fi

# ---------- Setup Steps ----------
/bin/bash database/_setup/create_database/create_database.sh "$CONFIG_FILE"
/bin/bash database/_setup/create_database/create_tables.sh "$CONFIG_FILE"
/bin/bash database/_setup/create_database/fill_static_tables.sh "$CONFIG_FILE"

# ---------- Conditional Data Population ----------
if $USE_TEST_DATA; then
    echo "⚠️  Using test data..."
    /bin/bash database/_setup/create_database/fill_tables_with_test_data.sh "$CONFIG_FILE"
elif $USE_OLD_DATA; then
    echo "⚠️  Using old data..."
    /bin/bash database/_setup/refactor_old_data/refactor_old_data.sh "$CONFIG_FILE"
fi

# ---------- Views and USPs etc. ----------
/bin/bash database/_setup/setup_usps_views/create_views.sh "$CONFIG_FILE"
/bin/bash database/_setup/setup_usps_views/create_usps.sh "$CONFIG_FILE"
/bin/bash database/_setup/setup_usps_views/run_init_usps.sh "$CONFIG_FILE"

echo '✔️ DONE'
