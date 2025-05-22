from flask import Blueprint, render_template

from backend.api.database.db_API import execute_query_with_placeholder_params
from backend.sites.match_history.utils.transform_match_data import transform_match_data

match_history_bp = Blueprint(
    'match_history',                   # interner Name
    __name__,
    url_prefix='/match_history'
)


@match_history_bp.route('/')
def match_history():
    limit = 20
    offset = 0
    matches = execute_query_with_placeholder_params(
        'database/round/queries/get_latest_rounds_for_match_history.sql', (limit, offset)
    )
    transformed_matches = transform_match_data(matches)
    print(transformed_matches)
    return render_template('sites/match_history/match_history.html', matches=transformed_matches)
