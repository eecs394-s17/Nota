from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask import g
from flask import abort

import datetime

import uuid

import base64

import sqlite3


app = Flask(__name__)
api = Api(app)


# database initialization stuff
DATABASE = './database/database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


class Notes(Resource):

    def __init__(self):

        self.parser = reqparse.RequestParser()
        self.parser.add_argument("title", type=str, required=True)
        self.parser.add_argument("course", type=str, required=True)
        self.parser.add_argument("price", type=str, required=True)
        self.parser.add_argument("notes", type=str, required=True)
        self.parser.add_argument("description", type=str, required=False)

    def get(self):
        """
        serves the get endpoint
        when hit it will return all the notes
        """
        notes = []

        conn = get_db()
        c = conn.cursor()

        for row in c.execute("SELECT * FROM notes"):

            note_path = 0
            course = 1
            upload_date = 2
            price = 3
            title = 4
            description = 5

            with open(row[note_path], "rb") as f:

                data = f.read()
                notes_data = base64.encodestring(data)

                current_notes = {
                                "notes": notes_data,
                                "course": row[course],
                                "upload_date": row[upload_date],
                                "price": row[price],
                                "title": row[title],
                                "description": row[description]
                                }

                notes.append(current_notes)


        # TODO: setup hosting to return URLs

        notes_json = { "all_notes" : notes }

        return notes_json

    def post(self):
        """
        a post endpoint that adds notes
        """

        args = self.parser.parse_args()

        course = args["course"]
        upload_date = str(datetime.datetime.now())
        price = args["price"]
        title = args["title"]
        notes = args["notes"]
        description = args["description"]

        if description == None:
            description = ""

        # try to save base64 image
        image = base64.decodestring(notes)

        # save base64 to somewhere on machine
        # TODO: handle different filetypes
        unique_filename = str(uuid.uuid4())
        with open(unique_filename, 'wb') as f:
            f.write(image)

        # connect to the database
        conn = get_db()
        c = conn.cursor()

        # add the stuff to database
        print "Adding data to database"
        c.execute("INSERT INTO notes VALUES ( '" + unique_filename + "', '" + course + "', '" + upload_date + "', '" + price + "', '" + title + "', '" + description +  "')")
        conn.commit()

        # # write file where image was saved to csv
        # with open(self.notes_filepath, 'a') as csvfile:
        #     writer = csv.writer(csvfile)
        #     writer.writerow([unique_filename])

        return { "path" : unique_filename }


api.add_resource(Notes, "/api/v1/notes")


if __name__ == '__main__':
    app.run(debug=True)
