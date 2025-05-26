from flask import Blueprint, render_template, request

from backend.api.database.db_API import execute_query_with_placeholder_params
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
    transformed_matches = transform_match_data(matches)
    print(transformed_matches[0])
    return render_template('sites/match_history/match_history.html', matches=transformed_matches)
