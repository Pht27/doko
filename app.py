from flask import Flask, render_template

from backend.config.database.db_config import get_db_url

app = Flask(__name__)


@app.route('/')
def index():
    db_session = scoped_session(sessionmaker(bind=engine))
    players = db_session.query(
        Players.id, Players.name,  Players.start_points)[0]
    for item in db_session.query(Players.id, Players.name, Players.start_points):
        print(item)
    print(players)
    players = Players.query.all()
    return render_template('index.html', players=players)
