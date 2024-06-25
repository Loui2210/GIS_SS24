const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware für statische Dateien
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/beispielDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB verbunden...'))
  .catch(err => console.error('MongoDB Verbindung fehlgeschlagen:', err));

const beispielSchema = new mongoose.Schema({
  datum: String,
  inhalt: String,
  zusatzinfos: String
});

const Beispiel = mongoose.model('Beispiel', beispielSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'indexneu.html'));
});

app.get('/eintrag.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'eintrag.html'));
});

app.get('/vergangen.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vergangen.html'));
});

app.get('/impressum.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'impressum.html'));
});

// API-Endpunkte
app.get('/api/beispiele', (req, res) => {
  Beispiel.find({}, (err, beispiele) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(beispiele);
  });
});

app.post('/api/beispiele', (req, res) => {
  const beispiel = new Beispiel(req.body);
  beispiel.save((err, savedBeispiel) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(savedBeispiel);
  });
});

app.delete('/api/beispiele/:id', (req, res) => {
  Beispiel.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
