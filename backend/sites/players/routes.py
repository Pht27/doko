from flask import Blueprint
from flask import render_template
from flask import request
from flask import jsonify

from backend.api.database.db_API import execute_query_with_placeholder_params
from backend.api.database.db_API import execute_stored_procedure_with_params

from backend.sites.players.utils.transform_player_data import transform_player_data
from backend.sites.players.utils.transform_match_data import transform_match_data


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


@players_bp.route('/<int:player_id>')
def specific_player(player_id):
    matches = execute_query_with_placeholder_params(
        'database/round/queries/get_rounds_for_personal_match_history.sql', (
            player_id,)
    )
    comments_by_round = execute_query_with_placeholder_params(
        'database/comment/queries/get_comments_by_round.sql', ()
    )
    player_ids_by_team = execute_query_with_placeholder_params(
        'database/team/queries/get_player_ids_by_team.sql'
    )
    best_match = execute_query_with_placeholder_params(
        'database/round/queries/get_best_round_for_player.sql', (player_id,)
    )
    worst_match = execute_query_with_placeholder_params(
        'database/round/queries/get_worst_round_for_player.sql', (player_id,)
    )

    transformed_matches = transform_match_data(
        matches, comments_by_round, player_ids_by_team)

    transformed_best_match = transform_match_data(
        best_match, comments_by_round, player_ids_by_team)

    transformed_worst_match = transform_match_data(
        worst_match, comments_by_round, player_ids_by_team)

    return render_template('sites/players/specific_player.html',
                           player_id=player_id,
                           matches=transformed_matches,
                           best_match=transformed_best_match,
                           worst_match=transformed_worst_match)
