from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models import User, db

auth = Blueprint("auth_blueprint", __name__)
bcrypt = Bcrypt()


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({"userid": user.userid})
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"userid": new_user.userid}), 201
