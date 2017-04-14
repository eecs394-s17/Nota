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

        return { "id" : "test" }

    def post(self):
        """
        there is one way to access this endpoint via a post request
        with the data in the body of the request
        1) /api/v1/users -> creates a new user and returns their id
        """

        return { "id" : "test"}

    def delete(self):
        """
        there is one way to access this endpoint via a delete request
        1) /api/v1/users/{id} -> this will delete the user associated with the id
        """

        return { "id" : "test"}
