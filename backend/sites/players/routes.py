from flask import Blueprint, render_template

from backend.api.database.db_API import execute_query_with_placeholder_params

players_bp = Blueprint(
    'players',                   # interner Name
    __name__,
    url_prefix='/players'
)


@players_bp.route('/')
def players():
    players = execute_query_with_placeholder_params(
        'database/player/queries/get_stats_for_all_active_players.sql'
    )
    sorted_players = sorted(
        players, key=lambda p: p['total_points'], reverse=True)
    return render_template('sites/players/players.html', players=sorted_players)
