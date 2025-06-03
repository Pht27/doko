from flask import Blueprint, render_template

stats_bp = Blueprint(
    'stats',                   # interner Name
    __name__,
    url_prefix='/stats'
)


@stats_bp.route('/')
def stats():
    return render_template('sites/stats/stats.html')
