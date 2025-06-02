from flask import Blueprint, render_template, request, jsonify, send_from_directory, abort

import os

from backend.api.config_API import get_max_player_name_length
from backend.api.config_API import get_profile_pics_directory

from backend.api.database.db_API import execute_query_with_placeholder_params
from backend.api.database.db_API import execute_defined_function_with_params
from backend.api.database.db_API import execute_stored_procedure_with_params
from backend.api.database.db_API import get_db_connection

from backend.api.utils.insert_round_data import insert_round_data
from backend.api.utils.set_activity_status import set_activity_status
from backend.api.utils.serialize_timeseries import serialize_timeseries
from backend.api.utils.rename_player_base_stats import rename_player_base_stats, rename_player_alone_stats
from backend.api.utils.refactor_game_mode_data import refactor_game_mode_data


api_bp = Blueprint(
    'api',                   # interner Name
    __name__,
    url_prefix='/api'
)


###############################
########## GETTERS ############
###############################


@api_bp.route('/get_game_modes', methods=['GET'])
def get_game_modes():
    game_modes = execute_query_with_placeholder_params(
        'database/game_mode/queries/get_all_game_modes.sql', ())

    return jsonify(game_modes)


@api_bp.route('/get_active_players', methods=['GET'])
def get_active_players():
    players = execute_query_with_placeholder_params(
        'database/player/queries/get_active_players.sql', ())

    return jsonify(players)


@api_bp.route('/get_special_cards', methods=['GET'])
def get_special_cards():
    players = execute_query_with_placeholder_params(
        'database/special_card/queries/get_special_cards.sql', ())

    return jsonify(players)


@api_bp.route('/get_extra_points', methods=['GET'])
def get_extra_points():
    players = execute_query_with_placeholder_params(
        'database/extra_point/queries/get_extra_points.sql', ())

    return jsonify(players)


@api_bp.route('/get_card_by_name', methods=['GET'])
def get_card_by_name():
    CARDS_DIR = get_profile_pics_directory()

    name = request.args.get('name')
    if not name or not name.isalnum():
        return abort(400, description="Invalid name")

    filename = f"{name}.svg"
    file_path = os.path.join(CARDS_DIR, filename)

    if not os.path.exists(file_path):
        return abort(404, description="Card not found")

    return send_from_directory(CARDS_DIR, filename, mimetype='image/svg+xml')


###############################
########## STATS ##############
###############################

@api_bp.route('/player_info/<int:player_id>', methods=['GET'])
def player_info(player_id):
    player_info = execute_query_with_placeholder_params(
        'database/player/queries/get_player_by_id.sql', player_id
    )[0]

    return jsonify(player_info)


@api_bp.route('/player_base_stats/<int:player_id>', methods=['GET'])
def player_base_stats(player_id):
    player_base_stats = execute_query_with_placeholder_params(
        'database/player/queries/get_base_stats_for_specific_player.sql', player_id
    )[0]

    player_base_stats = rename_player_base_stats(player_base_stats)

    return jsonify(player_base_stats)


@api_bp.route('/player_timeseries/<int:player_id>', methods=['GET'])
def player_timeseries(player_id):
    time_series = execute_query_with_placeholder_params(
        'database/player/queries/get_time_series_for_player.sql', (player_id,))
    clean_data = serialize_timeseries(time_series)
    return jsonify(clean_data)


@api_bp.route('/player_game_modes_stats/<int:player_id>', methods=['GET'])
def player_game_modes_stats(player_id):
    game_modes_stats = execute_query_with_placeholder_params(
        'database/player/queries/get_player_game_modes_stats.sql', (player_id,))
    transformed_data = refactor_game_mode_data(game_modes_stats)
    print(transformed_data)
    return jsonify(transformed_data)


@api_bp.route('/player_special_cards_stats/<int:player_id>', methods=['GET'])
def player_special_cards_stats(player_id):
    special_cards_stats = execute_query_with_placeholder_params(
        'database/player/queries/get_player_special_cards_stats.sql', (player_id,))
    return jsonify(special_cards_stats)


@api_bp.route('/player_extra_points_stats/<int:player_id>', methods=['GET'])
def player_extra_points_stats(player_id):
    extra_points_stats = execute_query_with_placeholder_params(
        'database/player/queries/get_player_extra_points_stats.sql', (player_id,))
    return jsonify(extra_points_stats)


@api_bp.route('/player_partner_stats/<int:player_id>', methods=['GET'])
def player_partner_stats(player_id):
    player_partner_stats = execute_query_with_placeholder_params(
        'database/player/queries/get_player_partner_stats.sql', (player_id,))
    return jsonify(player_partner_stats)


@api_bp.route('/player_alone_stats/<int:player_id>', methods=['GET'])
def player_alone_stats(player_id):
    player_alone_stats = execute_query_with_placeholder_params(
        'database/player/queries/get_player_alone_stats.sql', (player_id,))[0]
    player_alone_stats = rename_player_alone_stats(player_alone_stats)
    return jsonify(player_alone_stats)


###############################
########## POSTERS ############
###############################


@api_bp.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    round_id = data.get('round_id')
    comment = data.get('comment', '').strip()

    if not comment:
        return jsonify(error="Kommentar darf nicht leer sein."), 400

    # Save comment to the database
    execute_stored_procedure_with_params(
        'SP_insert_comment', (round_id, comment))

    return jsonify(message="Kommentar hinzugefügt."), 200


@api_bp.route('/add_player', methods=['POST'])
def add_player():
    data = request.get_json()
    name = data.get('name', '').strip()

    if not name:
        return jsonify(error="Name darf nicht leer sein."), 400

    if ',' in name:
        return jsonify(error="Name darf kein Komma enthalten."), 400

    max_player_name_length = int(get_max_player_name_length())

    if len(name) > max_player_name_length:
        return jsonify(error="Name darf nicht länger als " + str(max_player_name_length) + " Zeichen sein.")

    name_taken = execute_defined_function_with_params(
        'DF_check_if_name_is_taken', name)
    if name_taken:
        return jsonify(error="Name ist bereits vergeben."), 400

    execute_stored_procedure_with_params('SP_insert_player', (name,))
    return jsonify(message=f"{name} wurde hinzugefügt."), 200


@api_bp.route('/add_round', methods=['POST'])
def add_round():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    insert_round_data(data)

    return jsonify({"message": "Round added successfully"}), 200


@api_bp.route('/set_activity_status', methods=['POST'])
def activity_status():
    data = request.get_json()
    player_id = data['player_id']
    active = data['active']

    if not data:
        return jsonify({"error": "No data received"}), 400

    set_activity_status(player_id, active)

    return jsonify({"message": "Activity status set successfully"}), 200
