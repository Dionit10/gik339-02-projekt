const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      year INTEGER NOT NULL,
      genre TEXT NOT NULL,
      rating INTEGER NOT NULL,
      color TEXT NOT NULL
    )
  `);
});

module.exports = db;
