from flask import Flask, render_template

from backend.config.database.db_config import get_db_url

from backend.database.database_API import execute_query_with_placeholder_params

app = Flask(__name__)


@app.route('/')
@app.route('/players')
def index():
    players = execute_query_with_placeholder_params(
        'backend/database/players/queries/get_all_players.sql')
    print(players)
    return render_template('players/players.html', players=players)
