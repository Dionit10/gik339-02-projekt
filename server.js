const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.get("/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/books", (req, res) => {
  const { title, author, year, genre, rating, color } = req.body;
  db.run(
    `INSERT INTO books VALUES (NULL, ?, ?, ?, ?, ?, ?)`,
    [title, author, year, genre, rating, color],
    () => res.json({ message: "Bok skapad" })
  );
});

app.put("/books", (req, res) => {
  const { id, title, author, year, genre, rating, color } = req.body;
  db.run(
    `UPDATE books SET title=?, author=?, year=?, genre=?, rating=?, color=? WHERE id=?`,
    [title, author, year, genre, rating, color, id],
    () => res.json({ message: "Bok uppdaterad" })
  );
});

app.delete("/books/:id", (req, res) => {
  db.run(`DELETE FROM books WHERE id=?`, req.params.id, () =>
    res.json({ message: "Bok borttagen" })
  );
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
