const express = require('express'); 
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;
app.use(cors());

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


app.get('/api/beispiele', async (req, res) => {
  let beispiele = await Beispiel.find({});
    res.json(beispiele);
});

app.post('/api/beispiele', async (req, res) => {
  try {
    const beispiel = new Beispiel(req.body);
    const savedBeispiel = await beispiel.save();
    res.json(savedBeispiel);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.delete('/api/beispiele/:id', async (req, res) => {
  try {
    await Beispiel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
