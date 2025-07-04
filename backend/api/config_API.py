from configparser import ConfigParser

config_path = 'config/config.ini'

def get_max_player_name_length():
    config_object = ConfigParser()
    config_object.read(config_path)
    PLAYERS = config_object['PLAYERS']
    max_name_length = PLAYERS['max_name_length']

    return max_name_length

def get_profile_pics_directory():
    config_object = ConfigParser()
    config_object.read(config_path)
    PLAYERS = config_object['PLAYERS']
    directory_name = PLAYERS['profile_pic_directory']

    return directory_name