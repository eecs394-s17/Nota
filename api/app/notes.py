from flask import Flask, Response
from flask_restful import Resource, Api, reqparse

from utils import get_db
from utils import dict_factory

import datetime

import uuid

import base64


class Notes(Resource):

    def __init__(self):

        self.parser = reqparse.RequestParser()
        self.parser.add_argument("title", type=str, required=True)
        self.parser.add_argument("course", type=str, required=True)
        self.parser.add_argument("price", type=str, required=True)
        self.parser.add_argument("notes", type=str, required=True)
        self.parser.add_argument("description", type=str, required=False)
        self.parser.add_argument("id")

    def get(self):
        """
        there are two ways to access this endpoint via a get request:
        1) /api/v1/notes -> this will return the metadata for all notes
        2) /api/v1/notes/{id} -> this will return the metadata as well as the notes themselves
        TODO: eventually we will wanna abstract this out so that metadata is a different endpoint
        """
        notes = []

        conn = get_db()
        conn.row_factory = dict_factory
        c = conn.cursor()

        for row in c.execute("SELECT * FROM notes"):

            with open(row["filename"], "rb") as f:

                data = f.read()
                notes_data = base64.encodestring(data)

                current_notes = {
                                "notes": notes_data,
                                "course": row["course"],
                                "upload_date": row["upload_date"],
                                "price": row["price"],
                                "title": row["title"],
                                "description": row["description"],
                                "userID": row["userID"]
                                }

                notes.append(current_notes)

        notes_json = { "all_notes" : notes }

        return notes_json

    def post(self):
        """
        there is one way to access this endpoint via a post request
        with the data in the body of the request
        1) /api/v1/notes -> creates a new set of notes
        """

        args = self.parser.parse_args()

        course = args["course"]
        upload_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
        price = args["price"]
        title = args["title"]
        notes = args["notes"]
        description = args["description"]
        userID = 5
        username = "dajunjin"


        if description == None:
            description = ""

        # try to save base64 image
        image = base64.decodestring(notes)

        # save base64 to somewhere on machine
        unique_filename = "/srv/images/" + str(uuid.uuid4())
        with open(unique_filename, 'wb') as f:
            f.write(image)

        # connect to the database
        conn = get_db()
        c = conn.cursor()

        # add the stuff to database
        # c.execute("INSERT INTO notes VALUES ( 'NULL' + '" + unique_filename + "', '" + upload_date + "', '" + course + "', '" + title + "', '" + price + "', '" + "', '" + description + "', '" + str(userID) +  "')")
        c.execute("INSERT INTO notes (filename, upload_date, course, title, price, description, userID) VALUES (?,?,?,?,?,?,?)", (unique_filename, upload_date, course, title, price, description, userID))
        conn.commit()

        return { "id" : unique_filename, "user_id": userID }

    def delete(self):
        """
        there two ways to access this endpoint via a delete request
        1) /api/v1/notes -> this will delete all notes (yikes)
        2) /api/v1/notes/{id} -> this will delete the notes associated with the id
        """

        # connect to the database
        conn = get_db()
        c = conn.cursor()

        c.execute("DELETE FROM notes")
        conn.commit()
