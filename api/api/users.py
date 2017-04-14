from flask import Flask, Response
from flask_restful import Resource, Api, reqparse
from flask import abort

from utils import get_db
from utils import dict_factory

import os


class Users(Resource):

    def get(self):
        """
        there are two ways to access this endpoint via a get request:
        1) /api/v1/users -> this will return the data for all users
        2) /api/v1/users/{id} -> this will return data for the user specified by the id
        """

        conn = get_db()
        conn.row_factory = dict_factory
        c = conn.cursor()

        parser = reqparse.RequestParser()
        parser.add_argument("id", type=str, required=False)
        args = parser.parse_args()

        user_id = args["id"]
        if user_id != None:

            c.execute("SELECT * FROM users WHERE id='" + user_id + "'")
            requested_user = c.fetchone()
            if  requested_user == None:
                print "Those user don't exist :O"
                abort(400)

            user_data = {
                    "id" : requested_user["id"],
                    "email" : requested_user["email"],
                    "password" : requested_user["password"]
            }

            return user_data

        users = []

        for row in c.execute("SELECT * FROM users"):

            current_user = {
                            "id": row["id"],
                            "email": row["email"],
                            "password": row["password"]
                            }

            users.append(current_user)

        users_json = { "users" : users }

        return users_json

    def post(self):
        """
        there is one way to access this endpoint via a post request
        with the data in the body of the request
        1) /api/v1/users -> creates a new user and returns their id
        """

        conn = get_db()
        conn.row_factory = dict_factory
        c = conn.cursor()

        parser = reqparse.RequestParser()
        parser.add_argument("email", type=str, required=True)
        parser.add_argument("password", type=str, required=True)
        args = parser.parse_args()

        email = args["email"]
        password = args["password"]

        c.execute("INSERT INTO users (email, password) VALUES (?,?)", (email, password))
        conn.commit()

        last_row_id = c.lastrowid

        return { "id" : last_row_id }

    def delete(self):
        """
        there is one way to access this endpoint via a delete request
        1) /api/v1/users -> this will delete all users
        2) /api/v1/users/{id} -> this will delete the user associated with the id
        """

        conn = get_db()
        conn.row_factory = dict_factory
        c = conn.cursor()

        parser = reqparse.RequestParser()
        parser.add_argument("id", type=str, required=False)
        args = parser.parse_args()

        user_id = args["id"]
        if user_id != None:

            c.execute("DELETE FROM users WHERE id ='" + user_id + "'")
            conn.commit()

            return

        c.execute("DELETE FROM users")
        conn.commit()
