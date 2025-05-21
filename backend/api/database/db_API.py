import pymysql

from backend.api.database.db_config import get_db_host_address, get_db_name, get_db_user_and_password


def load_sql(path):
    with open(path, 'r') as f:
        return f.read()


def get_db_connection():
    db_host_address = get_db_host_address()
    db_user, db_password = get_db_user_and_password()
    db_name = get_db_name()

    return pymysql.connect(
        host=db_host_address,
        user=db_user,
        password=db_password,
        database=db_name,
        cursorclass=pymysql.cursors.DictCursor  # für dict-artige Zeilen
    )


# geeignet für sql files mit paltzhalter %s
def execute_query_with_placeholder_params(sql_filepath, params=()):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            query = load_sql(sql_filepath)
            cur.execute(query, params)
            return cur.fetchall()
    finally:
        conn.close()


# geeignet für stored procedures mit parametern
def execute_stored_procedure_with_params(stored_procedure_name, params=()):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc(stored_procedure_name, params)
            result = cur.fetchall()
        return result
    finally:
        conn.close()
