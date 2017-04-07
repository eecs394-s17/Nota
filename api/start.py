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
table_description = "CREATE TABLE notes (note_path text, course text, lecture text, price text, name text)"
try:
    c.execute(table_description)
except:
    print "Could not create table"
    exit()
