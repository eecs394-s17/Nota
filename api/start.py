import sqlite3
import os


conn = sqlite3.connect('database/database.db')
c = conn.cursor()


# make the database dir if it doesn't exist
try:
    os.stat("database")
except:
    os.mkdir("database")

# try to create the notes table
notes_table = "CREATE TABLE notes (id integer primary key autoincrement, filename text, upload_date text, course text, title text, price text, description text, email text, constraint unique_filename UNIQUE (filename), foreign key(email) references users(email))"
users_table = "CREATE TABLE users(id integer primary key autoincrement, email text, password text, constraint unique_email UNIQUE (email))"

try:
    c.execute(notes_table)
except:
    print "Could not create notes table"
    exit()

try:
    c.execute(users_table)
except:
    print "Could not create user table"
    exit()
