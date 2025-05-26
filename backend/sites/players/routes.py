from flask import Blueprint
from flask import render_template
from flask import request
from flask import jsonify

from backend.api.database.db_API import execute_query_with_placeholder_params
from backend.api.database.db_API import execute_stored_procedure_with_params
from backend.api.database.db_API import execute_defined_function_with_params

from backend.sites.players.utils.transform_player_data import transform_player_data

from backend.api.config_API import get_max_player_name_length


players_bp = Blueprint(
    'players',                   # interner Name
    __name__,
    url_prefix='/players'
)


@players_bp.route('/')
def players():
    players = execute_query_with_placeholder_params(
        'database/player/queries/get_stats_for_all_players.sql'
    )
    transformed_player_data = transform_player_data(players)
    return render_template('sites/players/players.html', players=transformed_player_data)


@players_bp.route('/add_player', methods=['POST'])
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
