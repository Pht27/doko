from configparser import ConfigParser

config_path = 'config/database/db_config.ini'


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
