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

    # TODO: maybe build this out later
    # def setup(handler_function):
    #
    #     def setup_wrapper(notes_class):
    #
    #         print resource_class
    #
    #         parser = reqparse.RequestParser()
    #
    #         return handler_function(notes_class)
    #
    #     return setup_wrapper

    # TODO: pull out the stuff common to the get and delete methods like in a decorator
    def get(self):
        """
        there are two ways to access this endpoint via a get request:
        1) /api/v1/notes -> this will return the metadata for all notes
        2) /api/v1/notes/{id} -> this will return the metadata as well as the notes themselves
        TODO: eventually we will wanna abstract this out so that metadata is a different endpoint
        """

        conn = get_db()
        conn.row_factory = dict_factory
        c = conn.cursor()

        parser = reqparse.RequestParser()
        parser.add_argument("id", type=str, required=False, location="args")
        parser.add_argument("user_id", type=str, required=False, location="args")
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
                                "user_id": requested_notes["user_id"],
                                "password": requested_notes["password"],
                                "notes": notes_data
                              }

                return notes_dict

        notes = []

        user_id = args["user_id"]
        select_notes = "SELECT * FROM notes"
        if user_id != None:
            select_notes += (" WHERE user_id = '" + user_id + "'")

        print select_notes
        # otherwise we are gonna return all the notes
        for row in c.execute(select_notes):

            current_notes = {
                            "id": row["id"],
                            "course": row["course"],
                            "upload_date": row["upload_date"],
                            "price": row["price"],
                            "title": row["title"],
                            "description": row["description"],
                            "user_id": row["user_id"],
                            "score": row["score"],
                            "password": row["password"]
                            }

            notes.append(current_notes)

        notes_json = { "notes" : notes }

        return notes_json

    def post(self):
        """
        there is one way to access this endpoint via a post request
        with the data in the body of the request
        1) /api/v1/notes -> creates a new set of notes
        """

        parser = reqparse.RequestParser()
        parser.add_argument("title", type=str, required=False)
        parser.add_argument("course", type=str, required=False)
        parser.add_argument("price", type=str, required=False)
        parser.add_argument("notes", type=str, required=False)
        parser.add_argument("user_id", type=str, required=False)
        parser.add_argument("description", type=str, required=False)
        parser.add_argument("score", type=int, required=False)
        parser.add_argument("note_id", type=int, required=False)
        parser.add_argument("password", type=str, required=False)
        args = parser.parse_args()

        course = args["course"]
        upload_date = datetime.datetime.now().strftime('%b %d %Y %I:%M %p')
        price = args["price"]
        title = args["title"]
        notes = args["notes"]
        user_id = args["user_id"]
        description = args["description"]
        score = args["score"]
        note_id = args["note_id"]
        password = args["password"]

        if score != None and note_id != None:
            conn = get_db()
            conn.row_factory = dict_factory
            c = conn.cursor()
            #print "UPDATE notes SET score= {0} WHERE id={1}".format(score,note_id)
            c.execute("UPDATE notes SET score= {0} WHERE id={1}".format(score,note_id));
            conn.commit()
            return {"score": score }







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
        conn.row_factory = dict_factory
        c = conn.cursor()

        # add the stuff to database
        c.execute("INSERT INTO notes (filename, upload_date, course, title, price, description, user_id, score, password) VALUES (?,?,?,?,?,?,?,?,?)", (unique_filename, upload_date, course, title, price, description, user_id,0, password))
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

            return

        c.execute("DELETE FROM notes")
        conn.commit()
