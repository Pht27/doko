import os
from flask import Flask, redirect, url_for

from backend.sites.players.routes import players_bp
from backend.sites.match_history.routes import match_history_bp
from backend.sites.new_match.routes import new_match_bp
from backend.api.api import api_bp

app = Flask(
    __name__,
    template_folder=os.path.join("frontend", "templates"),
    static_folder=os.path.join("frontend", "static"),
)

app.register_blueprint(players_bp)
app.register_blueprint(match_history_bp)
app.register_blueprint(new_match_bp)
app.register_blueprint(api_bp)


@app.route('/')
def index():
    return redirect(url_for('players.players'))
