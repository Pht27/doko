from backend.api.database.db_API import execute_stored_procedure_with_params
from backend.api.database.db_API import get_db_connection


def insert_round_data(round):
    if round['round_id'] is None:
        insert_new_round(round)
    else:
        edit_existing_round(round)
    pass


def insert_new_round(round):
    # create own connection to make transaction safe
    conn = get_db_connection()
    try:
        with conn:  # this uses the connection as a transaction context

            ########################
            ####### ROUND ##########
            ########################

            points = round['points']
            winning_party = round['winning_party']
            time_stamp = convert_date(round['time_stamp'])

            round_id = insert_new_round_in_round_table_and_return_round_id(
                winning_party, points, time_stamp, conn)

            ###########################
            ####### GAME MODE #########
            ###########################

            game_mode_id = round['game_mode']['game_mode_id']
            add_game_mode_to_round(round_id, game_mode_id, conn)

            ###########################
            ####### COMMENTS ##########
            ###########################

            for comment in round['comments']:
                insert_new_comment_to_round(round_id, comment['text'], conn)

            for position in range(1, 5):
                pos = str(position)
                team_data = round['teams'][pos]
                team_dict = {'position': pos, **team_data}

                ###########################
                ####### TEAMS #############
                ###########################

                player_id1 = team_dict['player_ids'][0]
                player_id2 = team_dict['player_ids'][1] if len(
                    team_dict['player_ids']) == 2 else None
                team_name = team_dict['name']
                team_id = get_team_id_for_player_ids(
                    player_id1, player_id2, team_name, conn)
                party = team_dict['party']

                add_team_to_round(round_id, team_id, position, party, conn)

                ###########################
                ####### EXTRA POINTS ######
                ###########################

                for extra_point_name, extra_point_count in team_dict['extra_points'].items():
                    extra_point_id = get_extra_point_id_from_name(
                        extra_point_name, conn)
                    add_extra_point_to_team_in_round(
                        round_id, team_id, extra_point_id, extra_point_count, conn)

                ###########################
                ####### SPECIAL CARD ######
                ###########################

                for special_card_name in team_dict['special_cards']:
                    special_card_id = get_special_card_id_from_name(
                        special_card_name, conn)
                    add_special_card_to_team_in_round(
                        round_id, team_id, special_card_id, conn)
    except Exception as e:
        conn.rollback()
        raise
    finally:
        conn.close()


def edit_existing_round(round):
    pass


# round = dict({'comments': [{'id': 6, 'text': 'crazy -E.'}, {'id': 7, 'text': 'cwazY -E.'}, {'id': 8, 'text': 'naja'}, {'id': 9, 'text': 'teslu'}],
#               'game_mode': {'game_mode_id': 7, 'game_mode_name': 'Fleischloses', 'is_solo': True},
#               'points': 2,
#               'round_id': 5,
#               'teams': {'1': {'extra_points': {}, 'name': 'Bob', 'party': 'Re', 'player_ids': [2], 'special_cards': []},
#                         '2': {'extra_points': {}, 'name': 'Alice', 'party': 'Kontra', 'player_ids': [1], 'special_cards': []},
#                         '3': {'extra_points': {}, 'name': 'Charlie', 'party': 'Kontra', 'player_ids': [3], 'special_cards': []},
#                         '4': {'extra_points': {}, 'name': 'Diana, Eve', 'party': 'Kontra', 'player_ids': [4, 5], 'special_cards': []}},
#               'time_stamp': '2025-05-30T11:16:40.228Z',
#               'winning_party': 'Re'})


def insert_new_round_in_round_table_and_return_round_id(
        winning_party, points, time_stamp, conn):
    return execute_stored_procedure_with_params(
        'SP_insert_round', (winning_party, points, time_stamp))


def add_game_mode_to_round(round_id, game_mode_id, conn):
    execute_stored_procedure_with_params(
        'SP_add_game_mode_to_round', (round_id, game_mode_id))


def insert_new_comment_to_round(round_id, text, conn):
    return execute_stored_procedure_with_params('SP_insert_comment', (round_id, text))


def get_team_id_for_player_ids(player_id1, player_id2, team_name, conn):
    return execute_stored_procedure_with_params('SP_create_or_get_team_from_player_ids', (player_id1, player_id2, team_name))


def add_team_to_round(round_id, team_id, position, party, conn):
    execute_stored_procedure_with_params(
        'SP_add_team_to_round', (round_id, team_id, position, party))


def add_extra_point_to_team_in_round(round_id, team_id, extra_point_id, extra_point_count, conn):
    execute_stored_procedure_with_params(
        'SP_add_extra_point_to_team_in_round', (round_id, team_id, extra_point_id, extra_point_count))


def add_special_card_to_team_in_round(round_id, team_id, special_card_id, conn):
    execute_stored_procedure_with_params(
        'SP_add_special_card_to_team_in_round', (round_id, team_id, special_card_id))


def convert_date(iso_str):
    # Convert ISO 8601 string to datetime object
    dt = datetime.fromisoformat(iso_str.replace('Z', '+00:00'))

    # Format to MySQL DATETIME (no milliseconds)
    dt_str = dt.strftime('%Y-%m-%d %H:%M:%S')

    return dt_str
