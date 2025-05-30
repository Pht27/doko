import pymysql

import pandas as pd

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
def execute_query_with_placeholder_params(sql_filepath, params=(), conn=None):
    create_connection = False
    if conn is None:
        conn = get_db_connection()
        create_connection = True

    try:
        with conn.cursor() as cur:
            query = load_sql(sql_filepath)
            cur.execute(query, params)
            if create_connection:
                conn.commit()
            return cur.fetchall()
    except Exception:
        if create_connection:
            conn.rollback()
        raise
    finally:
        if create_connection:
            conn.close()


# geeignet für stored procedures mit parametern
def execute_stored_procedure_with_params(stored_procedure_name, params=(), conn=None):
    create_connection = False
    if conn is None:
        conn = get_db_connection()
        create_connection = True

    try:
        with conn.cursor() as cur:
            cur.callproc(stored_procedure_name, params)
            result = cur.fetchall()
        if create_connection:
            conn.commit()
        return result
    except Exception as e:
        if create_connection:
            conn.rollback()
        raise
    finally:
        if create_connection:
            conn.close()


# hilft beim ausführen von funktionen
def call_function(conn, func_name, *args):
    with conn.cursor() as cursor:
        placeholders = ", ".join(["%s"] * len(args))
        query = f"SELECT {func_name}({placeholders}) AS result"
        cursor.execute(query, args)
        return cursor.fetchone()["result"]


# geeignet für defined function mit parametern
def execute_defined_function_with_params(defined_function_name, *args, conn=None):
    create_connection = False
    if conn is None:
        conn = get_db_connection()
        create_connection = True

    try:
        result = call_function(conn, defined_function_name, *args)
        if create_connection:
            conn.commit()
        return result
    except Exception:
        if create_connection:
            conn.rollback()
        raise
    finally:
        if create_connection:
            conn.close()
