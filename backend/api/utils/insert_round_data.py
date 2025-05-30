from backend.api.database.db_API import execute_stored_procedure_with_params
from datetime import datetime


def insert_round_data(round):
    if round['round_id'] is None:
        insert_new_round(round)
    else:
        edit_existing_round(round)


def insert_new_round(round):
    try:
        ########################
        ####### ROUND ##########
        ########################
        points = round['points']
        winning_party = round['winning_party']
        time_stamp = convert_date(round['time_stamp'])

        round_id = insert_new_round_in_round_table_and_return_round_id(
            winning_party, points, time_stamp)[0]['round_id']

        ###########################
        ####### GAME MODE #########
        ###########################
        game_mode_id = round['game_mode']['game_mode_id']
        add_game_mode_to_round(round_id, game_mode_id)

        ###########################
        ####### COMMENTS ##########
        ###########################
        for comment in round['comments']:
            insert_new_comment_to_round(round_id, comment['text'])

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
                player_id1, player_id2, team_name)[0]['team_id']
            party = team_dict['party']

            update_team_names()

            add_team_to_round(round_id, team_id, position, party)

            ###########################
            ####### EXTRA POINTS ######
            ###########################
            for extra_point_name, extra_point_count in team_dict['extra_points'].items():
                extra_point_id = get_extra_point_id_from_name(extra_point_name)[
                    0]['extra_point_id']
                add_extra_point_to_team_in_round(
                    round_id, team_id, extra_point_id, extra_point_count)

            ###########################
            ####### SPECIAL CARD ######
            ###########################
            for special_card_name in team_dict['special_cards']:
                special_card_id = get_special_card_id_from_name(special_card_name)[
                    0]['special_card_id']
                add_special_card_to_team_in_round(
                    round_id, team_id, special_card_id)

    except Exception as e:
        raise


def edit_existing_round(round):
    try:
        round_id = round['round_id']

        #############################
        ######### DELETIONS #########
        #############################
        delete_game_mode_from_round(round_id)
        delete_comments_from_round(round_id)
        delete_teams_from_round(round_id)
        delete_extra_points_from_round(round_id)
        delete_special_cards_from_round(round_id)

        ########################
        ####### ROUND ##########
        ########################
        points = round['points']
        winning_party = round['winning_party']
        update_round_values(round_id, points, winning_party)

        ###########################
        ####### GAME MODE #########
        ###########################
        game_mode_id = round['game_mode']['game_mode_id']
        add_game_mode_to_round(round_id, game_mode_id)

        ###########################
        ####### COMMENTS ##########
        ###########################
        for comment in round['comments']:
            insert_new_comment_to_round(round_id, comment['text'])

        ###########################
        ####### TEAMS #############
        ###########################
        for position in range(1, 5):
            pos = str(position)
            team_data = round['teams'][pos]
            team_dict = {'position': pos, **team_data}

            player_id1 = team_dict['player_ids'][0]
            player_id2 = team_dict['player_ids'][1] if len(
                team_dict['player_ids']) == 2 else None

            team_name = team_dict['name']

            team_id = get_team_id_for_player_ids(
                player_id1, player_id2, team_name)[0]['team_id']

            update_team_names()

            party = team_dict['party']
            add_team_to_round(round_id, team_id, position, party)

            ###########################
            ####### EXTRA POINTS ######
            ###########################
            for extra_point_name, extra_point_count in team_dict['extra_points'].items():
                extra_point_id = get_extra_point_id_from_name(extra_point_name)[
                    0]['extra_point_id']
                add_extra_point_to_team_in_round(
                    round_id, team_id, extra_point_id, extra_point_count)

            ###########################
            ####### SPECIAL CARD ######
            ###########################
            for special_card_name in team_dict['special_cards']:
                special_card_id = get_special_card_id_from_name(special_card_name)[
                    0]['special_card_id']
                add_special_card_to_team_in_round(
                    round_id, team_id, special_card_id)

    except Exception as e:
        raise


def insert_new_round_in_round_table_and_return_round_id(winning_party, points, time_stamp):
    return execute_stored_procedure_with_params('SP_insert_round', (winning_party, points, time_stamp))


def add_game_mode_to_round(round_id, game_mode_id):
    execute_stored_procedure_with_params(
        'SP_add_game_mode_to_round', (round_id, game_mode_id))


def insert_new_comment_to_round(round_id, text):
    return execute_stored_procedure_with_params('SP_insert_comment', (round_id, text))


def get_team_id_for_player_ids(player_id1, player_id2, team_name):
    return execute_stored_procedure_with_params('SP_create_or_get_team_from_player_ids', (player_id1, player_id2, team_name))


def update_team_names():
    execute_stored_procedure_with_params('SP_update_team_names', ())


def add_team_to_round(round_id, team_id, position, party):
    execute_stored_procedure_with_params(
        'SP_add_team_to_round', (round_id, team_id, position, party))


def get_extra_point_id_from_name(extra_point_name):
    return execute_stored_procedure_with_params('SP_get_extra_point_id_from_name', (extra_point_name,))


def get_special_card_id_from_name(special_card_name):
    return execute_stored_procedure_with_params('SP_get_special_card_id_from_name', (special_card_name,))


def add_extra_point_to_team_in_round(round_id, team_id, extra_point_id, extra_point_count):
    execute_stored_procedure_with_params(
        'SP_add_extra_point_to_team_in_round', (round_id, team_id, extra_point_id, extra_point_count))


def add_special_card_to_team_in_round(round_id, team_id, special_card_id):
    execute_stored_procedure_with_params(
        'SP_add_special_card_to_team_in_round', (round_id, team_id, special_card_id))


def update_round_values(round_id, points, winning_party):
    execute_stored_procedure_with_params(
        'SP_update_round', (round_id, winning_party, points))


def delete_game_mode_from_round(round_id):
    execute_stored_procedure_with_params(
        'SP_delete_game_mode_from_round', (round_id,))


def delete_comments_from_round(round_id):
    execute_stored_procedure_with_params(
        'SP_delete_comments_from_round', (round_id,))


def delete_teams_from_round(round_id):
    execute_stored_procedure_with_params(
        'SP_delete_teams_from_round', (round_id,))


def delete_extra_points_from_round(round_id):
    execute_stored_procedure_with_params(
        'SP_delete_extra_points_from_round', (round_id,))


def delete_special_cards_from_round(round_id):
    execute_stored_procedure_with_params(
        'SP_delete_special_cards_from_round', (round_id,))


def convert_date(iso_str):
    dt = datetime.fromisoformat(iso_str.replace('Z', '+00:00'))
    return dt.strftime('%Y-%m-%d %H:%M:%S')
