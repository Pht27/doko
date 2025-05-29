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
