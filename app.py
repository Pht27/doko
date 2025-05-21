import os
from flask import Flask, redirect, url_for

from backend.sites.players.routes import players_bp

app = Flask(
    __name__,
    template_folder=os.path.join("frontend", "templates"),
    static_folder=os.path.join("frontend", "static"),
)

app.register_blueprint(players_bp)


@app.route('/')
def index():
    return redirect(url_for('players.players'))
