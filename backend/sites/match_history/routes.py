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
    transformed_matches = transform_match_data(matches, comments_by_round)
    return render_template('sites/match_history/match_history.html', matches=transformed_matches)


@match_history_bp.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    round_id = data.get('round_id')
    comment = data.get('comment', '').strip()
    print(round_id)
    print(comment)
    if not comment:
        return jsonify(error="Kommentar darf nicht leer sein."), 400

    # Save comment to the database
    execute_stored_procedure_with_params(
        'SP_insert_comment', (round_id, comment))

    return jsonify(message="Kommentar hinzugefügt."), 200
