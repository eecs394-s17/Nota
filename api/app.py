from flask import Flask, Response
from flask_restful import Resource, Api, reqparse
from flask import g
from flask import abort


import datetime

import uuid

import base64

import sqlite3

from flask.ext.login import LoginManager, UserMixin, login_required


app = Flask(__name__)
api = Api(app)
login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    # proxy for a database of users
    user_database = {"JohnDoe": ("JohnDoe", "John"),
               "JaneDoe": ("JaneDoe", "Jane")}


    def __init__(self, username, password):
        self.id = username
        self.password = password

    @classmethod
    def get(cls,id):
        return cls.user_database.get(id)


@login_manager.request_loader
def load_user(request):
    token = request.headers.get('Authorization')
    if token is None:
        token = request.args.get('token')

    if token is not None:
        username,password = token.split(":") # naive token
        user_entry = User.get(username)
        if (user_entry is not None):
            user = User(user_entry[0],user_entry[1])
            if (user.password == password):
                return user
    return None


@app.route("/",methods=["GET"])
def index():
    return Response(response="Hello World!",status=200)


@app.route("/protected/",methods=["GET"])
@login_required
def protected():
    return Response(response="Hello Protected World!", status=200)




# database initialization stuff
DATABASE = './database/database.db'

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

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
        conn.row_factory = dict_factory
        c = conn.cursor()
        c.execute("SELECT * FROM notes")
        print c.fetchone()["title"]

        for row in c.execute("SELECT * FROM notes"):

            # note_path = 0
            # course = 1
            # upload_date = 2
            # price = 3
            # title = 4
            # description = 5
            # userID = 6

            with open(row["filename"], "rb") as f:

                data = f.read()
                notes_data = base64.encodestring(data)

                current_notes = {
                                "notes": notes_data,
                                "course": row["course"],
                                "upload_date": row["upload_date"],
                                "price": row["price"],
                                "title": row["title"],
                                "description": row["description"]
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
        upload_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
        price = args["price"]
        title = args["title"]
        notes = args["notes"]
        description = args["description"]
        userID = 5


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
        # c.execute("INSERT INTO notes VALUES ( 'NULL' + '" + unique_filename + "', '" + upload_date + "', '" + course + "', '" + title + "', '" + price + "', '" + "', '" + description + "', '" + str(userID) +  "')")
        c.execute("INSERT INTO notes (filename, upload_date, course, title, price, description, userID) VALUES (?,?,?,?,?,?,?)", (unique_filename, upload_date, course, title, price, description, userID))
        conn.commit()

        print(c.lastrowid)

        # # write file where image was saved to csv
        # with open(self.notes_filepath, 'a') as csvfile:
        #     writer = csv.writer(csvfile)
        #     writer.writerow([unique_filename])

        return { "path" : unique_filename, "userID": userID }

    def delete(self):
        """
        delete endpoint that deletes all notes or a specific set of notes
        """

        # connect to the database
        conn = get_db()
        c = conn.cursor()

        c.execute("DELETE FROM notes")
        conn.commit()




api.add_resource(Notes, "/api/v1/notes")


if __name__ == '__main__':
    app.config["SECRET_KEY"] = "ITSASECRET"
    # app.run(port=5000,debug=True)
    app.run(debug=True)
