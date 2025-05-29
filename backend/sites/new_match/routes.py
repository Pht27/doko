from flask import Blueprint, render_template, request, jsonify

from backend.api.database.db_API import execute_query_with_placeholder_params
from backend.api.database.db_API import execute_stored_procedure_with_params

from backend.sites.new_match.utils.transform_match_data import transform_match_data

new_match_bp = Blueprint(
    'new_match',                   # interner Name
    __name__,
    url_prefix='/new_match'
)


@new_match_bp.route('/')
def new_match():
    round_id = request.args.get("round_id", type=int)

    if round_id:
        # Editing existing round
        round_data = execute_query_with_placeholder_params(
            'database/round/queries/get_specific_round_for_match_history.sql', (round_id,)
            )
        if not round_data:
            abort(404, "Runde nicht gefunden.")
        comments_by_round = execute_query_with_placeholder_params(
        'database/comment/queries/get_comments_by_round.sql', ()
        )
        player_ids_by_team = execute_query_with_placeholder_params(
            'database/team/queries/get_player_ids_by_team.sql'
        )
        round_data = transform_match_data(round_data, comments_by_round, player_ids_by_team)[0]
        return render_template('sites/new_match/new_match.html', round=round_data)
    else:
        # Creating new round
        return render_template('sites/new_match/new_match.html', round=None)
