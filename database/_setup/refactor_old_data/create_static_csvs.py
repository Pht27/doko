import warnings
from configparser import ConfigParser

import os
import pymysql
import csv

import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
config_path = BASE_DIR + '/../../../config/database/db_config.ini'
out_dir = BASE_DIR + '/static_csvs/'


def get_db_name():
    config_object = ConfigParser()
    config_object.read(config_path)
    DBSETUP = config_object['DBSETUP']
    db_name = DBSETUP['db_name']

    return db_name


def get_db_user_and_password():
    config_object = ConfigParser()
    config_object.read(config_path)
    DBSETUP = config_object['DBCONNECT']
    db_user = DBSETUP['db_user']
    db_password = DBSETUP['db_password']

    return db_user, db_password


def get_db_host_address():
    config_object = ConfigParser()
    config_object.read(config_path)
    DBSETUP = config_object['DBCONNECT']
    db_host_address = DBSETUP['db_host_address']

    return db_host_address


def get_db_url():
    config_object = ConfigParser()
    config_object.read(config_path)
    DBCONNECT = config_object['DBCONNECT']
    db_name = 'mysql://' + DBCONNECT['db_user'] + ':' + DBCONNECT['db_password'] + \
        '@' + DBCONNECT['db_host_address'] + '/' + get_db_name()

    return db_name


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


def write_dicts_to_csv(dict_rows, filename):
    if not dict_rows:
        print("No data to write.")
        return

    # Get the field names from the keys of the first dictionary
    fieldnames = dict_rows[0].keys()

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(dict_rows)


def export_query_to_csv(query, filename):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()
            write_dicts_to_csv(rows, filename)
    finally:
        conn.close()


game_mode_query = 'SELECT * FROM game_mode;'
special_card_query = 'SELECT * FROM extra_point;'
extra_point_query = 'SELECT * FROM special_card;'

game_mode_path = out_dir + 'game_mode.csv'
special_card_path = out_dir + 'extra_point.csv'
extra_point_path = out_dir + 'special_card.csv'

export_query_to_csv(game_mode_query, game_mode_path)
export_query_to_csv(special_card_query, special_card_path)
export_query_to_csv(extra_point_query, extra_point_path)
