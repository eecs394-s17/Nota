from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask import abort

import csv

import uuid

import base64


app = Flask(__name__)
api = Api(app)


class Notes(Resource):

    def __init__(self):

        self.notes_filepath = "notes.csv"
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('notes', type=str, required=True)


    def get(self):
        """
        serves the get endpoint
        when hit it will return all the notes
        """
        notes = []

        with open(self.notes_filepath, 'rb') as csvfile:
                    reader = csv.reader(csvfile)
                    for row in reader:
                        # TODO: strip excess spaces
                        notes.append(row)

        # TODO: should we get the image using base64?
        # or should we go straight for hosting

        images = []
        for note in notes:
            note_path = note[0] # just cuz its csv
            with open(note_path, "rb") as f:
                data = f.read()
                image = base64.encodestring(data)
                images.append(image)

        notes_json = { "notes" : images }

        return notes_json

    def post(self):
        """
        a post endpoint that adds notes
        """

        args = self.parser.parse_args()
        notes = args["notes"]

        # try to save base64 image
        image = base64.decodestring(notes)

        # save base64 to somewhere on machine
        # TODO: handle different filetypes
        unique_filename = str(uuid.uuid4())
        with open(unique_filename, 'wb') as f:
            f.write(image)

        # write file where image was saved to csv
        with open(self.notes_filepath, 'a') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([unique_filename])

        return { "path" : unique_filename }


api.add_resource(Notes, "/api/v1/notes")


if __name__ == '__main__':
    app.run(debug=True)
