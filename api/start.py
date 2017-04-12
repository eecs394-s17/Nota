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
notes_table = "CREATE TABLE notes (id integer primary key autoincrement, filename text, upload_date text, course text, title text, price text, description text, userID integer, foreign key(userID) references users(id))"
users_table = "CREATE TABLE users(id integer primary key autoincrement, email text, password text)"



try:
    c.execute(notes_table)
    c.execute(users_table)
except:
    print "Could not create table"
    exit()
