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

## Example
* hit the simple get endpoint by putting this in your browser
```
$ http://127.0.0.1:5000/api/v1/notes
```
