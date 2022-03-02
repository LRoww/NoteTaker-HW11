const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
// const dbData = require('./db/db.json'); //api
const dbPath = './db/db.json';


const app = express();
const PORT = 3001;

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// html routes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

//api routes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/diagnostics.json').then((data) =>
    res.json(JSON.parse(data))
  );
  console.info(`${req.method} request received`);
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    title,
    text,
    id: uuid(),
  };

  // Convert the data to a string so we can save it
  var noteData =fs.readFileSync(dbPath);
  noteData = JSON.parse(noteData);
  noteData = noteData.push(newNote);
  var noteString = JSON.stringify(noteData);

  // Write the string to a file
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(newNote);
      fs.writeFile(dbPath, JSON.stringify(parsedData, null, 4), (err) =>
      err ? console.error(err) : console.info(`Data written to ${dbPath}`)
    );
    }
  });

  res.status(201).json(newNote);
  console.info(newNote);
  console.info(`${req.method} request received`);
});

// // app.post()

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);