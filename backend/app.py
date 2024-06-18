from flask import Flask
from flask_cors import CORS
from models import db

from blueprints.auth import auth
from blueprints.timetable import timetable

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
app.config["SECRET_KEY"] = "SECRET_KEY"

db.init_app(app)

CORS(app)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(timetable, url_prefix="/api/timetable")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
