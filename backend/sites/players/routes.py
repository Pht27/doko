from flask import Blueprint, render_template

from backend.api.database.db_API import execute_query_with_placeholder_params

from backend.sites.players.utils.transform_player_data import transform_player_data


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
