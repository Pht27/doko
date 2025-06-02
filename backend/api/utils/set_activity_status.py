from backend.api.database.db_API import execute_stored_procedure_with_params

def set_activity_status(player_id, active):
    execute_stored_procedure_with_params(
        'SP_set_activity_status', (player_id, active))