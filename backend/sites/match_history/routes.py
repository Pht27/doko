from flask import Blueprint, render_template, request, jsonify

from backend.api.database.db_API import execute_query_with_placeholder_params
from backend.api.database.db_API import execute_stored_procedure_with_params
from backend.sites.match_history.utils.transform_match_data import transform_match_data

match_history_bp = Blueprint(
    'match_history',                   # interner Name
    __name__,
    url_prefix='/match_history'
)


@match_history_bp.route('/')
def match_history():
    matches = execute_query_with_placeholder_params(
        'database/round/queries/get_rounds_for_match_history.sql', ()
    )
    comments_by_round = execute_query_with_placeholder_params(
        'database/comment/queries/get_comments_by_round.sql', ()
    )
    player_ids_by_team = execute_query_with_placeholder_params(
        'database/team/queries/get_player_ids_by_team.sql'
    )
    transformed_matches = transform_match_data(
        matches, comments_by_round, player_ids_by_team)
    print(transformed_matches[2])
    return render_template('sites/match_history/match_history.html', matches=transformed_matches)
