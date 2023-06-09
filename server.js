const express = require("express");
const path = require("path");
const fs = require("fs");
const db_notes = require("./db/db.json");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  return res.json(db_notes);
});

app.post("/api/notes", function (req, res) {
  const notes = req.body;
  notes.id = new Date().getTime().toString();
  console.log(notes);
  db_notes.push(notes);
  fs.writeFile("./db/db.json", JSON.stringify(db_notes), (err) => {
    if (err) throw err;
    res.json(notes);
  });
});

app.delete("/api/notes/:id", function (req, res) {
  const id = req.params.id;
  const index = db_notes.findIndex(function (note) {
    return note.id === id;
  });
  if (index !== -1) {
    db_notes.splice(index, 1);
  }
  fs.writeFileSync("/db/db.json", JSON.stringify(db_notes));
  return res.json(id);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function () {
  console.log("Running server on port: " + PORT);
});
