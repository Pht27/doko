CONFIG_FILE="config/database/db_config.ini"


/bin/bash database/setup/create_database/create_database.sh  "$CONFIG_FILE"
/bin/bash database/setup/create_database/create_tables.sh "$CONFIG_FILE"
/bin/bash database/setup/create_database/fill_static_tables.sh "$CONFIG_FILE"

/bin/bash database/setup/_refactor_old_data/refactor_old_data.sh "$CONFIG_FILE"
