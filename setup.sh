/bin/bash database/setup/create_database.sh --drop
/bin/bash database/setup/create_tables.sh
/bin/bash database/setup/fill_static_tables.sh

/bin/bash database/_refactor_old_data/refactor_old_data.sh
