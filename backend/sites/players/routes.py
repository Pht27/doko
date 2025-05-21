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
        'database/players/queries/get_all_players.sql'
    )
    return render_template('players/players.html', players=players)
