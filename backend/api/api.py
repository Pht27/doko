from flask import Blueprint, render_template, request, jsonify

from backend.api.config_API import get_max_player_name_length

from backend.api.database.db_API import execute_query_with_placeholder_params
from backend.api.database.db_API import execute_defined_function_with_params
from backend.api.database.db_API import execute_stored_procedure_with_params
from backend.api.database.db_API import get_db_connection

from backend.api.utils.insert_round_data import insert_round_data

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

    # Print the received round data to the terminal
    print("Received round data:")
    print(data)

    insert_round_data(data)

    # Just return a simple success message
    return jsonify({"message": "Round added successfully"}), 200
