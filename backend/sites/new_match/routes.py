from flask import Blueprint, render_template, request, jsonify

from backend.api.database.db_API import execute_query_with_placeholder_params
from backend.api.database.db_API import execute_stored_procedure_with_params

new_match_bp = Blueprint(
    'new_match',                   # interner Name
    __name__,
    url_prefix='/new_match'
)


@new_match_bp.route('/')
def new_match():
    return render_template('sites/new_match/new_match.html', match=None)


@new_match_bp.route('/get_game_types', methods=['GET'])
def get_game_modes():
    # Save comment to the database
    game_modes = execute_query_with_placeholder_params(
        'database/game_mode/queries/get_all_game_modes.sql', ())
    print(game_modes)

    return game_modes
