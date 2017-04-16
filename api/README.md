# NAVY API

## Quickstart
* Install python virtualenv if you don't have it
```
$ pip install virtualenv
```
* create a python virtualenv inside this directory
```
$ virtualenv api
```
* install python requirements
```
$ pip install -r requirements.txt
```
* the permissions are pretty lenient at this point...(shhh don't tell). Just create some aws credentials and configurue them according to this

## Run
* get some setup stuff out of the way by running the start file
```
$ python start.py
```
* start up the environment
```
$ source api/bin/activate
```
* startup the flask app
```
$ python app.py
```

## API Docs
* the notes endpoint accepts 3 different types of request in accordance with restful principles (GET, POST, DELETE)

    * GET
        * **/api/v1/notes**: returns a list with the data for all notes on the database (but not the notes these can be retrieved by making a get request with the id specified)
        * **/api/v1/notes?id={id}**: returns the data for the notes associated with the id specified including the notes themselves
        * **/api/v1/notes?user_id={user_id}**: returns a list with the data for all notes on the database for the specified user

    * POST
        * **/api/v1/notes**: saves a new set of notes and returns the id of the notes created
            * this requires you to set the following parameters *title, course, price, notes, user_id*
            * an optional parameter is *description*

    * DELETE
        * **/api/v1/notes**: deletes all notes on and returns nothing
        * **/api/v1/notes?id={id}**: deletes the notes of the specified id and returns nothing

* the users endpoint closely mirrors the notes endpoint; it accepts 3 different types of request in accordance with restful principles (GET, POST, DELETE)

    * GET
        * /api/v1/users
        * /api/v1/users?id={id}
    * POST
        * /api/v1/users
    * DELETE
        * /api/v1/users
        * /api/v1/users?id={id}
