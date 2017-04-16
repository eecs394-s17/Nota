from flask import Flask, Response
from flask_restful import Resource, Api, reqparse
from flask import abort

from api import notes
from api import users

from flask import g

import os

import datetime

import uuid

import base64

import sqlite3

# from flask.ext.login import LoginManager, UserMixin, login_required


app = Flask(__name__)
api = Api(app)




# login_manager = LoginManager()
# login_manager.init_app(app)

# class User(UserMixin):
#     # proxy for a database of users
#     user_database = {"JohnDoe": ("JohnDoe", "John"),
#                "JaneDoe": ("JaneDoe", "Jane")}
#
#     def __init__(self, username, password):
#         self.id = username
#         self.password = password
#
#     @classmethod
#     def get(cls,id):
#         return cls.user_database.get(id)


# @login_manager.request_loader
# def load_user(request):
#     token = request.headers.get('Authorization')
#     if token is None:
#         token = request.args.get('token')
#
#     if token is not None:
#         username,password = token.split(":") # naive token
#         user_entry = User.get(username)
#         if (user_entry is not None):
#             user = User(user_entry[0],user_entry[1])
#             if (user.password == password):
#                 return user
#     return None


# @app.route("/",methods=["GET"])
# def index():
#     return Response(response="Hello World!",status=200)
#
#
# @app.route("/protected/",methods=["GET"])
# @login_required
# def protected():
#     return Response(response="Hello Protected World!", status=200)







@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

api.add_resource(notes.Notes, "/api/v1/notes")
api.add_resource(users.Users, "/api/v1/users")

if __name__ == '__main__':

    # app.config["SECRET_KEY"] = "ITSASECRET"

    debug = os.environ.get('DEBUG')
    if debug:
        app.run(debug=True)
    else:
        app.run(host="0.0.0.0", debug=False)
