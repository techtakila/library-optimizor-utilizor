# Simple SQLite helpers for demo (not a full ORM)
import sqlite3
from pathlib import Path

DB = Path(__file__).parent / "library.db"

def init_db():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    # users (simple demo user)
    cur.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, role TEXT)''')
    cur.execute("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (1, 'admin', 'adminpass', 'admin')")
    # books table
    cur.execute('''CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY, title TEXT, author TEXT)''')
    # branches
    cur.execute('''CREATE TABLE IF NOT EXISTS branches (id INTEGER PRIMARY KEY, name TEXT, capacity INTEGER)''')
    # copies (book distribution)
    cur.execute('''CREATE TABLE IF NOT EXISTS copies (book_id INTEGER, branch_id INTEGER, copies INTEGER, PRIMARY KEY(book_id,branch_id))''')
    conn.commit()
    conn.close()
