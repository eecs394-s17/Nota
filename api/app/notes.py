from flask import Flask, Response
from flask_restful import Resource, Api, reqparse
from flask import abort

from utils import get_db
from utils import dict_factory

import os

import datetime

import uuid

import base64


class Notes(Resource):

    def __init__(self):
        pass

    # TODO: pull out the stuff common to the get and delete methods
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

        parser = reqparse.RequestParser()
        parser.add_argument("id", type=str, required=False, location="args")
        args = parser.parse_args()

        # if we have indeed found and id let's get the corresponding notes assuming they exist
        notes_id = args["id"]
        if notes_id != None:

            c.execute("SELECT * FROM notes WHERE id='" + notes_id + "'")
            requested_notes = c.fetchone()
            if requested_notes == None:
                print "Those notes don't exist :O"
                abort(400)

            with open(requested_notes["filename"], "rb") as f:

                data = f.read()
                notes_data = base64.encodestring(data)

                notes_dict = {
                                "id": requested_notes["id"],
                                "course": requested_notes["course"],
                                "upload_date": requested_notes["upload_date"],
                                "price": requested_notes["price"],
                                "title": requested_notes["title"],
                                "description": requested_notes["description"],
                                "user_id": requested_notes["userID"],
                                "notes": notes_data
                              }

                return notes_dict

        # otherwise we are gonna return all the notes
        for row in c.execute("SELECT * FROM notes"):

            current_notes = {
                            "id": row["id"],
                            "course": row["course"],
                            "upload_date": row["upload_date"],
                            "price": row["price"],
                            "title": row["title"],
                            "description": row["description"],
                            "user_id": row["userID"]
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

        parser = reqparse.RequestParser()
        parser.add_argument("title", type=str, required=True)
        parser.add_argument("course", type=str, required=True)
        parser.add_argument("price", type=str, required=True)
        parser.add_argument("notes", type=str, required=True)
        parser.add_argument("description", type=str, required=False)
        args = parser.parse_args()

        course = args["course"]
        upload_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
        price = args["price"]
        title = args["title"]
        notes = args["notes"]
        description = args["description"]
        userID = 5
        username = "test_user"


        if description == None:
            description = ""

        # try to save base64 image
        image = base64.decodestring(notes)

        # save base64 to somewhere on machine
        # unique_filename = "/srv/images/" + str(uuid.uuid4()) # eventually have this run when not in debug
        unique_filename = str(uuid.uuid4())
        with open(unique_filename, 'wb') as f:
            f.write(image)

        # connect to the database
        conn = get_db()
        c = conn.cursor()

        # add the stuff to database
        # c.execute("INSERT INTO notes VALUES ( 'NULL' + '" + unique_filename + "', '" + upload_date + "', '" + course + "', '" + title + "', '" + price + "', '" + "', '" + description + "', '" + str(userID) +  "')")
        c.execute("INSERT INTO notes (filename, upload_date, course, title, price, description, userID) VALUES (?,?,?,?,?,?,?)", (unique_filename, upload_date, course, title, price, description, userID))
        conn.commit()

        last_row_id = c.lastrowid

        return { "id" : last_row_id }

    def delete(self):
        """
        there two ways to access this endpoint via a delete request
        1) /api/v1/notes -> this will delete all notes (yikes)
        2) /api/v1/notes/{id} -> this will delete the notes associated with the id
        """

        conn = get_db()
        conn.row_factory = dict_factory
        c = conn.cursor()

        parser = reqparse.RequestParser()
        parser.add_argument("id", type=str, required=False, location="args")
        args = parser.parse_args()

        # if we have indeed found and id let's get the corresponding notes assuming they exist
        notes_id = args["id"]
        if notes_id != None:

            c.execute("SELECT * FROM notes WHERE id='" + notes_id + "'")
            requested_notes = c.fetchone()
            if requested_notes == None:
                print "Those notes don't exist :O"
                abort(400)

            os.remove(requested_notes["filename"])

            c.execute("DELETE FROM notes WHERE id ='" + notes_id + "'")
            conn.commit()

            return { "deleted" : notes_id }


        c.execute("DELETE FROM notes")
        conn.commit()

        return { "deleted" : "all notes deleted" }
